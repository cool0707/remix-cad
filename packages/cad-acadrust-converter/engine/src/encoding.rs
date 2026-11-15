//! Text encoding of ASCII DXF input.
//!
//! acadrust decodes an ASCII DXF as UTF-8 for R2007+ and through `$DWGCODEPAGE`
//! for older files. Real drawings are less tidy: Jw_cad and several Japanese
//! CAD packages write Shift_JIS with no code page (or with `ANSI_1252`), and
//! some tools write UTF-8 into an R2000 file. This module decides what the
//! bytes really are — the same rules the viewer's TypeScript DXF reader uses —
//! and, when acadrust would get it wrong, hands it UTF-8 with the code page
//! rewritten so the header no longer contradicts the bytes.

use encoding_rs::Encoding;

/// What the reader should do with the input bytes.
pub struct Normalized {
    /// Replacement input (UTF-8). `None`: read the original bytes as they are.
    pub bytes: Option<Vec<u8>>,
    /// DXF code page name of the detected encoding (`ANSI_932`, …), set when
    /// it differs from what the header declares. Stored back in the document
    /// so a later DWG / legacy DXF export uses the right code page.
    pub code_page: Option<&'static str>,
    /// WHATWG label of the encoding the text was read as (for the report).
    pub label: &'static str,
}

const SAMPLE_LIMIT: usize = 256 * 1024;
const HEADER_SCAN_LIMIT: usize = 1024 * 1024;

struct HeaderInfo {
    /// `$ACADVER` is R2007 (AC1021) or later: the file is UTF-8 by definition.
    utf8_version: bool,
    version_seen: bool,
    /// Declared `$DWGCODEPAGE` value and its byte range in the file.
    code_page: Option<(String, std::ops::Range<usize>)>,
}

/// Decide the encoding of an ASCII DXF and convert it to UTF-8 when acadrust
/// would not decode it correctly on its own.
pub fn normalize_ascii_dxf(bytes: &[u8], forced: Option<&'static Encoding>) -> Normalized {
    if forced.is_none() && bytes.is_ascii() {
        return Normalized {
            bytes: None,
            code_page: None,
            label: "utf-8",
        };
    }

    let header = peek_header(bytes);
    let declared = header
        .code_page
        .as_ref()
        .and_then(|(name, _)| encoding_for_code_page(name));
    // What acadrust would use if left alone.
    let native: &'static Encoding = if header.utf8_version || !header.version_seen {
        encoding_rs::UTF_8
    } else {
        match &header.code_page {
            // An unknown code page name falls back to windows-1252 in acadrust.
            Some(_) => declared.unwrap_or(encoding_rs::WINDOWS_1252),
            None => encoding_rs::UTF_8,
        }
    };

    let actual: &'static Encoding = if let Some(forced) = forced {
        forced
    } else if std::str::from_utf8(bytes).is_ok() {
        // Valid UTF-8 is UTF-8 whatever a stale code page says.
        encoding_rs::UTF_8
    } else {
        let legacy = if header.version_seen && !header.utf8_version {
            declared
        } else {
            None
        };
        match legacy {
            Some(encoding) if encoding != encoding_rs::WINDOWS_1252 => encoding,
            _ => guess_legacy_encoding(bytes, legacy.or(declared)),
        }
    };

    if actual == native {
        return Normalized {
            bytes: None,
            code_page: None,
            label: actual.name(),
        };
    }

    // Transcode to UTF-8 and make the header agree. `UTF-8` is not a real
    // $DWGCODEPAGE value, but acadrust reads it as "no legacy encoding".
    let mut out = Vec::with_capacity(bytes.len() + bytes.len() / 8);
    match &header.code_page {
        Some((_, range)) => {
            transcode(actual, &bytes[..range.start], &mut out);
            out.extend_from_slice(b"UTF-8");
            transcode(actual, &bytes[range.end..], &mut out);
        }
        None => transcode(actual, bytes, &mut out),
    }
    Normalized {
        bytes: Some(out),
        code_page: code_page_for_encoding(actual),
        label: actual.name(),
    }
}

/// Resolve a caller-supplied encoding label (`shift_jis`, `cp949`, `ANSI_932`…).
pub fn encoding_from_label(label: &str) -> Option<&'static Encoding> {
    let trimmed = label.trim();
    if trimmed.is_empty() {
        return None;
    }
    if let Some(encoding) = encoding_for_code_page(trimmed) {
        return Some(encoding);
    }
    let lower = trimmed.to_ascii_lowercase();
    let alias = match lower.as_str() {
        "cp932" | "ms932" | "sjis" | "windows-31j" => "shift_jis",
        "cp936" | "ms936" => "gbk",
        "cp949" | "ms949" | "uhc" => "euc-kr",
        "cp950" | "ms950" => "big5",
        other => other,
    };
    Encoding::for_label(alias.as_bytes())
}

fn transcode(encoding: &'static Encoding, input: &[u8], out: &mut Vec<u8>) {
    if encoding == encoding_rs::UTF_8 {
        out.extend_from_slice(input);
        return;
    }
    // ASCII runs (group codes, numbers — almost all of a DXF) are copied
    // straight through; only lines with high bytes go through the decoder.
    let mut start = 0;
    while start < input.len() {
        let rest = &input[start..];
        let ascii_len = Encoding::ascii_valid_up_to(rest);
        if ascii_len == rest.len() {
            out.extend_from_slice(rest);
            break;
        }
        // Back up to the start of the line holding the first high byte, and
        // decode through the end of that line (all supported legacy encodings
        // keep CR / LF as single bytes, so lines are safe split points).
        let line_start = rest[..ascii_len]
            .iter()
            .rposition(|&b| b == b'\n')
            .map_or(0, |pos| pos + 1);
        out.extend_from_slice(&rest[..line_start]);
        let line_end = rest[ascii_len..]
            .iter()
            .position(|&b| b == b'\n')
            .map_or(rest.len(), |pos| ascii_len + pos + 1);
        let (text, _) = encoding.decode_without_bom_handling(&rest[line_start..line_end]);
        out.extend_from_slice(text.as_bytes());
        start += line_end;
    }
}

/// `$ACADVER` / `$DWGCODEPAGE` from the HEADER section.
fn peek_header(bytes: &[u8]) -> HeaderInfo {
    let mut info = HeaderInfo {
        utf8_version: false,
        version_seen: false,
        code_page: None,
    };
    let limit = bytes.len().min(HEADER_SCAN_LIMIT);
    let mut lines = LineCursor { bytes, pos: 0 };
    let mut pending: Option<&[u8]> = None;
    while lines.pos < limit {
        let Some((line, _)) = lines.next() else { break };
        let value = trim(line);
        match pending.take() {
            Some(b"$ACADVER") => {
                // The variable name is followed by a group code line, then the value.
                if let Some((raw, _)) = lines.next() {
                    let version = trim(raw);
                    info.version_seen = true;
                    info.utf8_version = is_utf8_version(version);
                }
            }
            Some(b"$DWGCODEPAGE") => {
                if let Some((raw, range)) = lines.next() {
                    let name = trim(raw);
                    let offset = name.as_ptr() as usize - raw.as_ptr() as usize;
                    let start = range.start + offset;
                    info.code_page = Some((
                        String::from_utf8_lossy(name).into_owned(),
                        start..start + name.len(),
                    ));
                }
            }
            _ => {
                if value == b"$ACADVER" || value == b"$DWGCODEPAGE" {
                    pending = Some(value);
                } else if value == b"ENDSEC" {
                    break;
                }
            }
        }
        if info.version_seen && info.code_page.is_some() {
            break;
        }
    }
    info
}

struct LineCursor<'a> {
    bytes: &'a [u8],
    pos: usize,
}

impl<'a> LineCursor<'a> {
    /// Next line without its terminator, and its byte range.
    fn next(&mut self) -> Option<(&'a [u8], std::ops::Range<usize>)> {
        if self.pos >= self.bytes.len() {
            return None;
        }
        let start = self.pos;
        let rest = &self.bytes[start..];
        let len = rest
            .iter()
            .position(|&b| b == b'\n' || b == b'\r')
            .unwrap_or(rest.len());
        let mut next = start + len;
        if next < self.bytes.len() && self.bytes[next] == b'\r' {
            next += 1;
        }
        if next < self.bytes.len() && self.bytes[next] == b'\n' {
            next += 1;
        }
        self.pos = next;
        Some((&self.bytes[start..start + len], start..start + len))
    }
}

fn trim(line: &[u8]) -> &[u8] {
    let start = line
        .iter()
        .position(|b| !b.is_ascii_whitespace())
        .unwrap_or(line.len());
    let end = line
        .iter()
        .rposition(|b| !b.is_ascii_whitespace())
        .map_or(start, |pos| pos + 1);
    &line[start..end]
}

/// `AC1021` (R2007) and later store text as UTF-8.
fn is_utf8_version(version: &[u8]) -> bool {
    if version.len() < 6 || !version[..2].eq_ignore_ascii_case(b"AC") {
        return false;
    }
    std::str::from_utf8(&version[2..6])
        .ok()
        .and_then(|digits| digits.parse::<u32>().ok())
        .is_some_and(|number| number >= 1021)
}

/// `$DWGCODEPAGE` name → encoding (the multi-byte and Windows pages that
/// matter for sniffing; anything else is left to acadrust).
fn encoding_for_code_page(name: &str) -> Option<&'static Encoding> {
    let lower = name.trim().to_ascii_lowercase();
    Some(match lower.as_str() {
        "ansi_932" | "dos932" => encoding_rs::SHIFT_JIS,
        "ansi_936" | "gb2312" => encoding_rs::GBK,
        "ansi_949" | "korean" => encoding_rs::EUC_KR,
        "ansi_950" | "big5" | "dos950" => encoding_rs::BIG5,
        "ansi_874" => encoding_rs::WINDOWS_874,
        "ansi_1250" => encoding_rs::WINDOWS_1250,
        "ansi_1251" => encoding_rs::WINDOWS_1251,
        "ansi_1252" => encoding_rs::WINDOWS_1252,
        "ansi_1253" => encoding_rs::WINDOWS_1253,
        "ansi_1254" => encoding_rs::WINDOWS_1254,
        "ansi_1255" => encoding_rs::WINDOWS_1255,
        "ansi_1256" => encoding_rs::WINDOWS_1256,
        "ansi_1257" => encoding_rs::WINDOWS_1257,
        "ansi_1258" => encoding_rs::WINDOWS_1258,
        _ => return None,
    })
}

fn code_page_for_encoding(encoding: &'static Encoding) -> Option<&'static str> {
    Some(if encoding == encoding_rs::SHIFT_JIS {
        "ANSI_932"
    } else if encoding == encoding_rs::GBK {
        "ANSI_936"
    } else if encoding == encoding_rs::EUC_KR {
        "ANSI_949"
    } else if encoding == encoding_rs::BIG5 {
        "ANSI_950"
    } else if encoding == encoding_rs::WINDOWS_874 {
        "ANSI_874"
    } else if encoding == encoding_rs::WINDOWS_1250 {
        "ANSI_1250"
    } else if encoding == encoding_rs::WINDOWS_1251 {
        "ANSI_1251"
    } else if encoding == encoding_rs::WINDOWS_1252 {
        "ANSI_1252"
    } else if encoding == encoding_rs::WINDOWS_1253 {
        "ANSI_1253"
    } else if encoding == encoding_rs::WINDOWS_1254 {
        "ANSI_1254"
    } else if encoding == encoding_rs::WINDOWS_1255 {
        "ANSI_1255"
    } else if encoding == encoding_rs::WINDOWS_1256 {
        "ANSI_1256"
    } else if encoding == encoding_rs::WINDOWS_1257 {
        "ANSI_1257"
    } else if encoding == encoding_rs::WINDOWS_1258 {
        "ANSI_1258"
    } else {
        return None;
    })
}

fn is_cjk(encoding: &'static Encoding) -> bool {
    encoding == encoding_rs::SHIFT_JIS
        || encoding == encoding_rs::GBK
        || encoding == encoding_rs::BIG5
        || encoding == encoding_rs::EUC_KR
}

fn decode_strict(encoding: &'static Encoding, sample: &[u8]) -> Option<String> {
    encoding
        .decode_without_bom_handling_and_without_replacement(sample)
        .map(|text| text.into_owned())
}

/// Guess the encoding of a DXF whose bytes are not valid UTF-8 and whose
/// header gives no usable code page (missing, declared on an R2007+ header,
/// or `ANSI_1252` written by tools that really emit Shift_JIS).
///
/// 1. A declared multi-byte CJK code page wins when it decodes strictly.
/// 2. Shift_JIS when it decodes strictly and the text looks Japanese.
/// 3. Single-byte text (isolated high bytes) → declared page or windows-1252.
/// 4. Big5 vs GBK by trail-byte distribution, then EUC-KR.
/// 5. Fallback: declared page or windows-1252.
fn guess_legacy_encoding(bytes: &[u8], declared: Option<&'static Encoding>) -> &'static Encoding {
    let sample = collect_non_ascii_lines(bytes, SAMPLE_LIMIT);
    let single_byte_fallback = match declared {
        Some(encoding) if !is_cjk(encoding) => encoding,
        _ => encoding_rs::WINDOWS_1252,
    };
    if let Some(encoding) = declared {
        if is_cjk(encoding) && decode_strict(encoding, &sample).is_some() {
            return encoding;
        }
    }
    if let Some(text) = decode_strict(encoding_rs::SHIFT_JIS, &sample) {
        if looks_japanese(&text) {
            return encoding_rs::SHIFT_JIS;
        }
    }
    let (isolated_ratio, low_trail_ratio) = high_byte_stats(&sample);
    if isolated_ratio >= 0.3 {
        return single_byte_fallback;
    }
    let order = if low_trail_ratio > 0.2 {
        [encoding_rs::BIG5, encoding_rs::GBK, encoding_rs::EUC_KR]
    } else {
        [encoding_rs::GBK, encoding_rs::BIG5, encoding_rs::EUC_KR]
    };
    for encoding in order {
        if decode_strict(encoding, &sample).is_some() {
            return encoding;
        }
    }
    single_byte_fallback
}

/// The lines that contain high bytes (up to `limit` bytes), joined by LF.
fn collect_non_ascii_lines(bytes: &[u8], limit: usize) -> Vec<u8> {
    let mut out = Vec::new();
    let mut start = 0;
    let mut non_ascii = false;
    let mut total = 0;
    let mut index = 0;
    while index <= bytes.len() && total < limit {
        let byte = if index < bytes.len() {
            bytes[index]
        } else {
            b'\n'
        };
        if byte == b'\n' || byte == b'\r' {
            if non_ascii && index > start {
                out.extend_from_slice(&bytes[start..index]);
                out.push(b'\n');
                total += index - start;
            }
            start = index + 1;
            non_ascii = false;
        } else if byte >= 0x80 {
            non_ascii = true;
        }
        index += 1;
    }
    out
}

/// `(isolated_ratio, low_trail_ratio)`:
/// share of high bytes with ASCII on both sides (single-byte Latin text), and
/// share of double-byte pairs whose trail byte is below 0xA1 (Big5 / Shift_JIS,
/// almost absent in GB2312 / EUC).
fn high_byte_stats(sample: &[u8]) -> (f64, f64) {
    let mut high = 0u32;
    let mut isolated = 0u32;
    let mut pairs = 0u32;
    let mut low_trail = 0u32;
    let mut index = 0;
    while index < sample.len() {
        let byte = sample[index];
        if byte < 0x80 {
            index += 1;
            continue;
        }
        high += 1;
        let prev = if index > 0 { sample[index - 1] } else { b'\n' };
        let next = if index + 1 < sample.len() {
            sample[index + 1]
        } else {
            b'\n'
        };
        if prev < 0x80 && next < 0x80 {
            isolated += 1;
        }
        if (0x81..=0xfe).contains(&byte) && index + 1 < sample.len() && next >= 0x40 && next != 0x7f
        {
            pairs += 1;
            if next < 0xa1 {
                low_trail += 1;
            }
            index += 1;
        }
        index += 1;
    }
    (
        if high > 0 {
            isolated as f64 / high as f64
        } else {
            0.0
        },
        if pairs > 0 {
            low_trail as f64 / pairs as f64
        } else {
            0.0
        },
    )
}

/// Text decoded as Shift_JIS looks Japanese: full-width kana, or mostly
/// ideographs / full-width symbols with few half-width kana and no private-use
/// characters (GBK / EUC-KR / Latin bytes read as Shift_JIS become half-width
/// kana runs or user-defined characters).
fn looks_japanese(text: &str) -> bool {
    let mut full_kana = 0u32;
    let mut half_kana = 0u32;
    let mut cjk = 0u32;
    let mut private_use = 0u32;
    let mut non_ascii = 0u32;
    for ch in text.chars() {
        let code = ch as u32;
        if code < 0x80 {
            continue;
        }
        non_ascii += 1;
        match code {
            0x3040..=0x30ff => full_kana += 1,
            0xff61..=0xff9f => half_kana += 1,
            0x4e00..=0x9fff | 0x3000..=0x303f | 0xff01..=0xff5e | 0x2460..=0x24ff => cjk += 1,
            0xe000..=0xf8ff => private_use += 1,
            _ => {}
        }
    }
    if non_ascii == 0 {
        return false;
    }
    if full_kana > 0 && private_use == 0 {
        return true;
    }
    private_use == 0
        && (half_kana as f64) <= non_ascii as f64 * 0.1
        && (cjk as f64) >= non_ascii as f64 * 0.5
}

#[cfg(test)]
mod tests {
    use super::*;

    fn dxf(version: &str, code_page: Option<&str>, text: &[u8]) -> Vec<u8> {
        let mut out = Vec::new();
        out.extend_from_slice(b"  0\r\nSECTION\r\n  2\r\nHEADER\r\n  9\r\n$ACADVER\r\n  1\r\n");
        out.extend_from_slice(version.as_bytes());
        out.extend_from_slice(b"\r\n");
        if let Some(code_page) = code_page {
            out.extend_from_slice(b"  9\r\n$DWGCODEPAGE\r\n  3\r\n");
            out.extend_from_slice(code_page.as_bytes());
            out.extend_from_slice(b"\r\n");
        }
        out.extend_from_slice(b"  0\r\nENDSEC\r\n  0\r\nTEXT\r\n  1\r\n");
        out.extend_from_slice(text);
        out.extend_from_slice(b"\r\n  0\r\nEOF\r\n");
        out
    }

    fn sjis(text: &str) -> Vec<u8> {
        encoding_rs::SHIFT_JIS.encode(text).0.into_owned()
    }

    #[test]
    fn ascii_is_left_alone() {
        let input = dxf("AC1015", Some("ANSI_1252"), b"plain");
        let result = normalize_ascii_dxf(&input, None);
        assert!(result.bytes.is_none());
    }

    #[test]
    fn declared_shift_jis_is_left_to_acadrust() {
        let input = dxf("AC1015", Some("ANSI_932"), &sjis("居間・食堂"));
        let result = normalize_ascii_dxf(&input, None);
        assert!(result.bytes.is_none());
        assert_eq!(result.label, "Shift_JIS");
    }

    #[test]
    fn shift_jis_behind_ansi_1252_is_transcoded() {
        let input = dxf("AC1015", Some("ANSI_1252"), &sjis("居間・食堂"));
        let result = normalize_ascii_dxf(&input, None);
        let bytes = result.bytes.expect("rewritten");
        let text = String::from_utf8(bytes).expect("utf-8");
        assert!(text.contains("居間・食堂"));
        assert!(text.contains("$DWGCODEPAGE\r\n  3\r\nUTF-8\r\n"));
        assert_eq!(result.code_page, Some("ANSI_932"));
    }

    #[test]
    fn shift_jis_without_header_is_transcoded() {
        let mut input = b"  0\r\nSECTION\r\n  2\r\nENTITIES\r\n  0\r\nTEXT\r\n  1\r\n".to_vec();
        input.extend_from_slice(&sjis("寸法線の文字"));
        input.extend_from_slice(b"\r\n  0\r\nENDSEC\r\n  0\r\nEOF\r\n");
        let result = normalize_ascii_dxf(&input, None);
        let text = String::from_utf8(result.bytes.expect("rewritten")).expect("utf-8");
        assert!(text.contains("寸法線の文字"));
    }

    #[test]
    fn utf8_in_a_legacy_file_stays_utf8() {
        let input = dxf("AC1015", Some("ANSI_1252"), "図面".as_bytes());
        let result = normalize_ascii_dxf(&input, None);
        let text = String::from_utf8(result.bytes.expect("rewritten")).expect("utf-8");
        assert!(text.contains("図面"));
        assert!(text.contains("UTF-8"));
    }

    #[test]
    fn utf8_in_a_modern_file_is_left_alone() {
        let input = dxf("AC1027", Some("ANSI_1252"), "図面".as_bytes());
        assert!(normalize_ascii_dxf(&input, None).bytes.is_none());
    }

    #[test]
    fn latin1_stays_single_byte() {
        let input = dxf("AC1015", Some("ANSI_1252"), b"fa\xe7ade caf\xe9");
        let result = normalize_ascii_dxf(&input, None);
        assert!(result.bytes.is_none());
        assert_eq!(result.label, "windows-1252");
    }

    #[test]
    fn forced_encoding_wins() {
        let input = dxf("AC1015", Some("ANSI_1252"), &sjis("図面"));
        let forced = encoding_from_label("cp932");
        assert_eq!(forced, Some(encoding_rs::SHIFT_JIS));
        let result = normalize_ascii_dxf(&input, forced);
        let text = String::from_utf8(result.bytes.expect("rewritten")).expect("utf-8");
        assert!(text.contains("図面"));
    }
}
