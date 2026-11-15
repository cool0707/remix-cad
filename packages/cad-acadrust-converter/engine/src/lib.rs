//! RemixCAD DWG / DXF conversion engine.
//!
//! A thin, allocation-conscious wrapper around [acadrust] compiled to
//! WebAssembly (`wasm32-wasip1`, no JS glue generator). One job is one call to
//! [`cad_convert`]: bytes in (DWG, ASCII DXF or binary DXF), bytes out.
//!
//! - **Opening a drawing**: any input → *binary DXF*. The viewer's data model
//!   reads binary DXF straight from the transferred buffer, so no text is
//!   decoded and no number is parsed on the main thread.
//! - **Saving a drawing**: the DXF the data model writes → DWG, or DXF of
//!   another version / flavour (ASCII, binary, genuine R12).
//!
//! The input buffer is owned by the job and dropped as soon as the document is
//! parsed, before the output is written, to keep the peak linear memory low
//! (WebAssembly memory never shrinks; the host discards the whole instance
//! after a job to give it back).
//!
//! This file and its siblings are MIT. acadrust is MPL-2.0 and is used
//! unmodified as a dependency; see `THIRD_PARTY_NOTICES.md`.

mod encoding;
mod report;

use std::cell::RefCell;
use std::io::Cursor;
use std::sync::Arc;

use acadrust::{
    CadDocument, DwgReadOptions, DwgReader, DwgWriter, DxfReader, DxfReaderConfiguration,
    DxfVersion, DxfWriter, EntityType, ReadStats,
};

use report::Report;

/// Input kinds (`source` argument of [`cad_convert`]).
pub const SOURCE_AUTO: u32 = 0;
pub const SOURCE_DWG: u32 = 1;
pub const SOURCE_DXF: u32 = 2;

/// Output kinds (`target` argument of [`cad_convert`]).
pub const TARGET_DXF_BINARY: u32 = 0;
pub const TARGET_DXF_ASCII: u32 = 1;
pub const TARGET_DWG: u32 = 2;

/// `flags` bit: stop at the first malformed record instead of skipping it.
pub const FLAG_STRICT: u32 = 1;

/// Progress stages reported through `cad_progress`.
const STAGE_READ: u32 = 1;
const STAGE_WRITE: u32 = 2;

#[cfg(target_arch = "wasm32")]
mod host {
    #[link(wasm_import_module = "env")]
    extern "C" {
        /// `permille` is 0..=1000 within `stage`.
        pub fn cad_progress(stage: u32, permille: u32);
        /// A panic message, delivered before the instance traps.
        pub fn cad_panic(ptr: *const u8, len: usize);
    }
}

fn progress(stage: u32, permille: u32) {
    #[cfg(target_arch = "wasm32")]
    unsafe {
        host::cad_progress(stage, permille)
    };
    #[cfg(not(target_arch = "wasm32"))]
    let _ = (stage, permille);
}

struct JobResult {
    output: Vec<u8>,
    report: Vec<u8>,
    /// The drawing's embedded thumbnail (PNG or a Windows DIB), when the
    /// output format has no place for it (DXF).
    preview: Vec<u8>,
}

thread_local! {
    static RESULT: RefCell<JobResult> = const {
        RefCell::new(JobResult {
            output: Vec::new(),
            report: Vec::new(),
            preview: Vec::new(),
        })
    };
}

fn install_panic_hook() {
    use std::sync::Once;
    static HOOK: Once = Once::new();
    HOOK.call_once(|| {
        std::panic::set_hook(Box::new(|info| {
            let message = info.to_string();
            #[cfg(target_arch = "wasm32")]
            unsafe {
                host::cad_panic(message.as_ptr(), message.len())
            };
            #[cfg(not(target_arch = "wasm32"))]
            eprintln!("{message}");
        }));
    });
}

/// Allocate `len` bytes for the host to fill (the job input, or a label).
#[no_mangle]
pub extern "C" fn cad_alloc(len: usize) -> *mut u8 {
    let mut buffer = Vec::<u8>::new();
    if buffer.try_reserve_exact(len.max(1)).is_err() {
        return std::ptr::null_mut();
    }
    let ptr = buffer.as_mut_ptr();
    std::mem::forget(buffer);
    ptr
}

/// Free a buffer from [`cad_alloc`] that was *not* handed to [`cad_convert`].
///
/// # Safety
/// `ptr` / `len` must come from one `cad_alloc(len)` call.
#[no_mangle]
pub unsafe extern "C" fn cad_free(ptr: *mut u8, len: usize) {
    if !ptr.is_null() {
        drop(Vec::from_raw_parts(ptr, 0, len.max(1)));
    }
}

/// Convert a drawing. Returns 0 on success, 1 on failure; either way the
/// report (JSON) is available through [`cad_report_ptr`] / [`cad_report_len`],
/// and on success the output through [`cad_output_ptr`] / [`cad_output_len`].
///
/// - `input` / `input_len`: a [`cad_alloc`] buffer. **Ownership moves here.**
/// - `source`: `SOURCE_*`; `target`: `TARGET_*`.
/// - `version`: target version code (1009, 1012 … 1032), 0 = the drawing's own.
/// - `flags`: `FLAG_*`.
/// - `encoding` / `encoding_len`: optional text encoding label for ASCII DXF
///   input (borrowed; may be null).
///
/// # Safety
/// The pointers must be valid as described.
#[no_mangle]
pub unsafe extern "C" fn cad_convert(
    input: *mut u8,
    input_len: usize,
    source: u32,
    target: u32,
    version: u32,
    flags: u32,
    encoding: *const u8,
    encoding_len: usize,
) -> u32 {
    install_panic_hook();
    let input = if input.is_null() {
        Vec::new()
    } else {
        Vec::from_raw_parts(input, input_len, input_len.max(1))
    };
    let encoding = if encoding.is_null() || encoding_len == 0 {
        None
    } else {
        std::str::from_utf8(std::slice::from_raw_parts(encoding, encoding_len)).ok()
    };
    let job = Job {
        source,
        target,
        version,
        strict: flags & FLAG_STRICT != 0,
        encoding,
    };

    // With `panic = "abort"` (the stock wasm std) a panic traps after the hook
    // has told the host; with an unwinding std it lands here as an error.
    let outcome = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| run(job, input)));
    let (status, output, preview, report) = match outcome {
        Ok(Ok(done)) => (0, done.output, done.preview, done.report),
        Ok(Err(message)) => (1, Vec::new(), Vec::new(), Report::failure(&message)),
        Err(payload) => {
            let message = payload
                .downcast_ref::<String>()
                .map(String::as_str)
                .or_else(|| payload.downcast_ref::<&str>().copied())
                .unwrap_or("conversion engine panicked");
            (1, Vec::new(), Vec::new(), Report::failure(message))
        }
    };
    RESULT.with(|slot| {
        *slot.borrow_mut() = JobResult {
            output,
            report: report.into_json().into_bytes(),
            preview,
        };
    });
    status
}

#[no_mangle]
pub extern "C" fn cad_output_ptr() -> *const u8 {
    RESULT.with(|slot| slot.borrow().output.as_ptr())
}

#[no_mangle]
pub extern "C" fn cad_output_len() -> usize {
    RESULT.with(|slot| slot.borrow().output.len())
}

#[no_mangle]
pub extern "C" fn cad_report_ptr() -> *const u8 {
    RESULT.with(|slot| slot.borrow().report.as_ptr())
}

#[no_mangle]
pub extern "C" fn cad_report_len() -> usize {
    RESULT.with(|slot| slot.borrow().report.len())
}

/// The drawing's thumbnail from the last job (empty when there is none).
#[no_mangle]
pub extern "C" fn cad_preview_ptr() -> *const u8 {
    RESULT.with(|slot| slot.borrow().preview.as_ptr())
}

#[no_mangle]
pub extern "C" fn cad_preview_len() -> usize {
    RESULT.with(|slot| slot.borrow().preview.len())
}

/// Drop the output, report and preview of the last job.
#[no_mangle]
pub extern "C" fn cad_release() {
    RESULT.with(|slot| {
        *slot.borrow_mut() = JobResult {
            output: Vec::new(),
            report: Vec::new(),
            preview: Vec::new(),
        };
    });
}

struct Job<'a> {
    source: u32,
    target: u32,
    version: u32,
    strict: bool,
    encoding: Option<&'a str>,
}

/// Kind of input found by looking at the first bytes.
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum SourceKind {
    Dwg,
    DxfBinary,
    DxfAscii,
}

impl SourceKind {
    fn label(self) -> &'static str {
        match self {
            SourceKind::Dwg => "dwg",
            SourceKind::DxfBinary => "dxf-binary",
            SourceKind::DxfAscii => "dxf",
        }
    }
}

/// Tell DWG, binary DXF and ASCII DXF apart from the file signature.
pub fn detect_source(bytes: &[u8]) -> SourceKind {
    const BINARY_DXF: &[u8] = b"AutoCAD Binary DXF";
    if bytes.starts_with(BINARY_DXF) {
        return SourceKind::DxfBinary;
    }
    // DWG starts with a six-character version tag: "AC1015", "AC1.50", "MC0.0"…
    if bytes.len() >= 6 && &bytes[..2] == b"AC" {
        let tag = &bytes[2..6];
        let version_like = tag
            .iter()
            .all(|byte| byte.is_ascii_digit() || *byte == b'.');
        // An ASCII DXF never starts with "AC" (it starts with a group code).
        if version_like {
            return SourceKind::Dwg;
        }
    }
    SourceKind::DxfAscii
}

/// What a finished job hands back.
struct Done {
    output: Vec<u8>,
    preview: Vec<u8>,
    report: Report,
}

fn run(job: Job<'_>, input: Vec<u8>) -> Result<Done, String> {
    if input.is_empty() {
        return Err("the file is empty".to_string());
    }
    let kind = match job.source {
        SOURCE_DWG => SourceKind::Dwg,
        SOURCE_DXF => match detect_source(&input) {
            SourceKind::DxfBinary => SourceKind::DxfBinary,
            _ => SourceKind::DxfAscii,
        },
        _ => detect_source(&input),
    };
    let input_len = input.len();
    let mut report = Report::new(kind.label(), input_len);

    progress(STAGE_READ, 0);
    let started = web_now();
    // `input` moves into the reader and is freed when reading finishes.
    let (mut document, stats) = match kind {
        SourceKind::Dwg => read_dwg(input, job.strict)?,
        SourceKind::DxfBinary => read_dxf(input, job.strict)?,
        SourceKind::DxfAscii => {
            let forced = job.encoding.and_then(encoding::encoding_from_label);
            let normalized = encoding::normalize_ascii_dxf(&input, forced);
            report.text_encoding = Some(normalized.label);
            let code_page = normalized.code_page;
            let bytes = match normalized.bytes {
                Some(bytes) => {
                    drop(input);
                    bytes
                }
                None => input,
            };
            let (mut document, stats) = read_dxf(bytes, job.strict)?;
            if let Some(code_page) = code_page {
                document.header.code_page = code_page.to_string();
            } else if document.header.code_page.eq_ignore_ascii_case("UTF-8") {
                document.header.code_page = "ANSI_1252".to_string();
            }
            (document, stats)
        }
    };
    report.read_ms = elapsed_ms(started);
    report.source_version = document.version.as_str();
    report.absorb(&stats);
    progress(STAGE_READ, 1000);

    if !stats.has_usable_drawing_data() && stats.recovered() {
        return Err(first_error(&stats)
            .unwrap_or_else(|| "the drawing contains no readable data".to_string()));
    }

    progress(STAGE_WRITE, 0);
    let started = web_now();
    let target_version = match job.version {
        0 => None,
        code => Some(version_from_code(code)?),
    };
    // DXF has no thumbnail section acadrust writes, so a DWG's preview would
    // be lost on the way to the viewer. Hand it over next to the output.
    // (A DWG target keeps it in the document, where the writer stores it.)
    let preview = if job.target == TARGET_DWG {
        Vec::new()
    } else {
        match document.preview.take() {
            Some(preview)
                if matches!(
                    preview.format,
                    acadrust::PreviewFormat::Png | acadrust::PreviewFormat::Bmp
                ) =>
            {
                report.preview_format = Some(match preview.format {
                    acadrust::PreviewFormat::Png => "png",
                    _ => "dib",
                });
                preview.data
            }
            _ => Vec::new(),
        }
    };
    let output = match job.target {
        TARGET_DWG => {
            if let Some(version) = target_version {
                document.version = version;
            }
            // The earliest DWG acadrust writes without loss of structure.
            if document.version == DxfVersion::Unknown {
                document.version = DxfVersion::AC1032;
            }
            report.output_version = document.version.as_str();
            DwgWriter::write_to_vec(&document).map_err(|error| error.to_string())?
        }
        TARGET_DXF_ASCII | TARGET_DXF_BINARY => {
            if target_version == Some(DxfVersion::AC1009) {
                keep_r12_writer_from_splitting_block_names(&mut document);
            }
            let binary = job.target == TARGET_DXF_BINARY;
            let mut writer = if binary {
                DxfWriter::new_binary(&document)
            } else {
                DxfWriter::new(&document)
            };
            if let Some(version) = target_version {
                writer = writer.with_version(version);
            }
            let effective = target_version.unwrap_or(document.version);
            report.output_version = if binary && effective < DxfVersion::AC1021 {
                // acadrust promotes legacy binary DXF to R2010 (UTF-8 strings).
                DxfVersion::AC1024.as_str()
            } else {
                effective.as_str()
            };
            for omission in writer.omitted_architecture_records() {
                report.warn("dxf-omitted-record", &format!("{omission:?}"));
            }
            writer.write_to_vec().map_err(|error| error.to_string())?
        }
        other => return Err(format!("unknown output kind {other}")),
    };
    drop(document);
    report.write_ms = elapsed_ms(started);
    report.output_bytes = output.len();
    progress(STAGE_WRITE, 1000);
    Ok(Done {
        output,
        preview,
        report,
    })
}

/// Renames the block definitions acadrust's R12 writer cannot take.
///
/// That writer looks for the `*Paper_Space` prefix by cutting a block name at
/// its 12th byte, and a cut inside a multi-byte character ("FL記号（階高）")
/// is a panic - which, compiled to WebAssembly, ends the whole job. Such a
/// name is brought to plain ASCII first, with `_` for every other character:
/// what the writer itself makes of it a moment later, R12 symbol names being
/// ASCII only. Names it can take are left alone, so they keep its own mapping.
fn keep_r12_writer_from_splitting_block_names(document: &mut CadDocument) {
    const PREFIX_BYTES: usize = "*Paper_Space".len();
    let unsafe_names: Vec<String> = document
        .block_records
        .iter()
        .map(|record| &record.name)
        .filter(|name| name.len() >= PREFIX_BYTES && !name.is_char_boundary(PREFIX_BYTES))
        .cloned()
        .collect();
    if unsafe_names.is_empty() {
        return;
    }

    let mut renamed: Vec<(String, String)> = Vec::with_capacity(unsafe_names.len());
    for old in unsafe_names {
        let ascii: String = old
            .chars()
            .map(|c| if c.is_ascii() { c } else { '_' })
            .collect();
        // Two names can differ only in the characters that were replaced.
        let mut name = ascii.clone();
        let mut attempt = 1;
        while document.block_records.contains(&name) {
            name = format!("{ascii}_{attempt}");
            attempt += 1;
        }
        if document.block_records.rename(&old, name.clone()).is_ok() {
            renamed.push((old, name));
        }
    }

    // Everything that names a block has to follow.
    for entity in document.entities_mut() {
        let block_name = match entity {
            EntityType::Insert(insert) => &mut insert.block_name,
            EntityType::Dimension(dimension) => &mut dimension.base_mut().block_name,
            EntityType::Block(block) => &mut block.name,
            _ => continue,
        };
        if let Some((_, name)) = renamed
            .iter()
            .find(|(old, _)| old.eq_ignore_ascii_case(block_name))
        {
            block_name.clone_from(name);
        }
    }
}

fn read_dwg(input: Vec<u8>, strict: bool) -> Result<(CadDocument, ReadStats), String> {
    let options = DwgReadOptions {
        failsafe: !strict,
        ..DwgReadOptions::default()
    };
    let mut reader = DwgReader::from_stream_with_options(Cursor::new(input), options);
    reader.set_progress_callback(Arc::new(|permille| {
        progress(STAGE_READ, u32::from(permille));
    }));
    let outcome = reader
        .read_with_stats()
        .map_err(|error| error.to_string())?;
    Ok((outcome.document, outcome.stats))
}

fn read_dxf(input: Vec<u8>, strict: bool) -> Result<(CadDocument, ReadStats), String> {
    let configuration = DxfReaderConfiguration {
        failsafe: !strict,
        ..DxfReaderConfiguration::default()
    };
    let outcome = DxfReader::from_reader(Cursor::new(input))
        .map_err(|error| error.to_string())?
        .with_configuration(configuration)
        .read_with_stats()
        .map_err(|error| error.to_string())?;
    Ok((outcome.document, outcome.stats))
}

fn first_error(stats: &ReadStats) -> Option<String> {
    stats
        .diagnostics
        .first()
        .map(|diagnostic| diagnostic.message.clone())
}

fn version_from_code(code: u32) -> Result<DxfVersion, String> {
    Ok(match code {
        1009 => DxfVersion::AC1009,
        1012 => DxfVersion::AC1012,
        1014 => DxfVersion::AC1014,
        1015 => DxfVersion::AC1015,
        1018 => DxfVersion::AC1018,
        1021 => DxfVersion::AC1021,
        1024 => DxfVersion::AC1024,
        1027 => DxfVersion::AC1027,
        1032 => DxfVersion::AC1032,
        other => return Err(format!("unsupported drawing version AC{other}")),
    })
}

fn web_now() -> std::time::Instant {
    std::time::Instant::now()
}

fn elapsed_ms(started: std::time::Instant) -> f64 {
    started.elapsed().as_secs_f64() * 1000.0
}

/// Native entry point with the same behaviour as [`cad_convert`], for tests
/// and tooling.
pub fn convert(
    input: Vec<u8>,
    source: u32,
    target: u32,
    version: u32,
    strict: bool,
    encoding: Option<&str>,
) -> Result<(Vec<u8>, String), String> {
    let job = Job {
        source,
        target,
        version,
        strict,
        encoding,
    };
    run(job, input).map(|done| (done.output, done.report.into_json()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn detects_sources() {
        assert_eq!(detect_source(b"AC1032\0\0\0\0"), SourceKind::Dwg);
        assert_eq!(detect_source(b"AC1.50\0"), SourceKind::Dwg);
        assert_eq!(
            detect_source(b"AutoCAD Binary DXF\r\n\x1a\0"),
            SourceKind::DxfBinary
        );
        assert_eq!(detect_source(b"  0\r\nSECTION\r\n"), SourceKind::DxfAscii);
        assert_eq!(detect_source(b"999\nACME export\n"), SourceKind::DxfAscii);
    }

    fn sample_dxf() -> Vec<u8> {
        let mut document = CadDocument::new();
        let line = acadrust::Line::from_coords(0.0, 0.0, 0.0, 100.0, 50.0, 0.0);
        document
            .add_entity(acadrust::EntityType::Line(line))
            .expect("line");
        DxfWriter::new(&document).write_to_vec().expect("dxf")
    }

    #[test]
    fn dxf_to_binary_dxf_and_back() {
        let (binary, report) =
            convert(sample_dxf(), SOURCE_AUTO, TARGET_DXF_BINARY, 0, false, None).expect("binary");
        assert!(binary.starts_with(b"AutoCAD Binary DXF"));
        assert!(report.contains("\"ok\":true"));
        let (ascii, _) =
            convert(binary, SOURCE_AUTO, TARGET_DXF_ASCII, 0, false, None).expect("ascii");
        let text = String::from_utf8(ascii).expect("utf-8");
        assert!(text.contains("LINE"));
    }

    #[test]
    fn dxf_to_dwg_to_dxf() {
        for version in [1015u32, 1018, 1021, 1024, 1027, 1032] {
            let (dwg, report) =
                convert(sample_dxf(), SOURCE_AUTO, TARGET_DWG, version, false, None)
                    .unwrap_or_else(|error| panic!("AC{version}: {error}"));
            assert_eq!(&dwg[..6], format!("AC{version}").as_bytes());
            assert!(report.contains(&format!("\"outputVersion\":\"AC{version}\"")));
            let (ascii, _) = convert(dwg, SOURCE_AUTO, TARGET_DXF_ASCII, 0, false, None)
                .unwrap_or_else(|error| panic!("AC{version} read back: {error}"));
            assert!(String::from_utf8_lossy(&ascii).contains("LINE"));
        }
    }

    /// A block and an INSERT of it, the block's name given as written.
    fn dxf_with_block(name: &str) -> Vec<u8> {
        let pairs: &[(&str, &str)] = &[
            ("0", "SECTION"),
            ("2", "BLOCKS"),
            ("0", "BLOCK"),
            ("8", "0"),
            ("2", name),
            ("70", "0"),
            ("10", "0.0"),
            ("20", "0.0"),
            ("30", "0.0"),
            ("0", "LINE"),
            ("8", "0"),
            ("10", "0.0"),
            ("20", "0.0"),
            ("11", "10.0"),
            ("21", "5.0"),
            ("0", "ENDBLK"),
            ("8", "0"),
            ("0", "ENDSEC"),
            ("0", "SECTION"),
            ("2", "ENTITIES"),
            ("0", "INSERT"),
            ("8", "0"),
            ("2", name),
            ("10", "50.0"),
            ("20", "50.0"),
            ("0", "ENDSEC"),
            ("0", "EOF"),
        ];
        let mut text = String::new();
        for (code, value) in pairs {
            text.push_str(code);
            text.push('\n');
            text.push_str(value);
            text.push('\n');
        }
        text.into_bytes()
    }

    /// Values of group `code` that follow an entity of type `kind`.
    fn names_of(dxf: &str, kind: &str, code: &str) -> Vec<String> {
        let lines: Vec<&str> = dxf.lines().map(str::trim).collect();
        let mut names = Vec::new();
        let mut inside = false;
        for pair in lines.chunks(2) {
            let [group, value] = pair else { break };
            if *group == "0" {
                inside = *value == kind;
            } else if inside && *group == code {
                names.push(value.to_string());
                inside = false;
            }
        }
        names
    }

    #[test]
    fn r12_takes_block_names_with_a_character_across_the_12th_byte() {
        // 'F' 'L' + 3-byte characters: byte 12 is inside the fourth of them.
        let name = "FL記号（階高）";
        assert!(!name.is_char_boundary(12));
        let (r12, report) = convert(
            dxf_with_block(name),
            SOURCE_AUTO,
            TARGET_DXF_ASCII,
            1009,
            false,
            None,
        )
        .expect("R12");
        assert!(report.contains("\"outputVersion\":\"AC1009\""));
        let text = String::from_utf8(r12).expect("R12 is ASCII");
        // The definition is there under an R12 name, and the INSERT uses it.
        let inserted = names_of(&text, "INSERT", "2");
        assert_eq!(inserted, ["FL______"]);
        assert!(names_of(&text, "BLOCK", "2").contains(&inserted[0]));
    }

    #[test]
    fn r12_keeps_blocks_apart_whose_names_differ_only_in_other_scripts() {
        // Both come down to the same ASCII letters.
        let mut dxf = dxf_with_block("FL記号（階高）");
        let second = String::from_utf8(dxf_with_block("FL番号（階数）")).expect("utf-8");
        // Splice the second drawing's BLOCK into the first one's BLOCKS section.
        let block = &second[second.find("0\nBLOCK\n").expect("block")
            ..second.find("0\nENDSEC\n").expect("end of blocks")];
        let first = String::from_utf8(std::mem::take(&mut dxf)).expect("utf-8");
        let at = first.find("0\nENDSEC\n").expect("end of blocks");
        let merged = format!("{}{}{}", &first[..at], block, &first[at..]);

        let (r12, _) = convert(
            merged.into_bytes(),
            SOURCE_AUTO,
            TARGET_DXF_ASCII,
            1009,
            false,
            None,
        )
        .expect("R12");
        let text = String::from_utf8(r12).expect("R12 is ASCII");
        let blocks: Vec<String> = names_of(&text, "BLOCK", "2")
            .into_iter()
            .filter(|block| block.starts_with("FL"))
            .collect();
        assert_eq!(blocks.len(), 2, "{blocks:?}");
        assert_ne!(blocks[0], blocks[1]);
    }

    #[test]
    fn other_versions_keep_the_block_name() {
        let name = "FL記号（階高）";
        let (ascii, _) = convert(
            dxf_with_block(name),
            SOURCE_AUTO,
            TARGET_DXF_ASCII,
            1032,
            false,
            None,
        )
        .expect("AC1032");
        let text = String::from_utf8(ascii).expect("utf-8");
        assert_eq!(names_of(&text, "INSERT", "2"), [name]);
    }

    #[test]
    fn empty_input_is_an_error() {
        assert!(convert(Vec::new(), SOURCE_AUTO, TARGET_DXF_BINARY, 0, false, None).is_err());
    }
}
