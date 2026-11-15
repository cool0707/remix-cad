//! Job report: a small JSON document the host reads after a conversion.
//!
//! Written by hand to keep serde (and its code size) out of the engine.

use acadrust::ReadStats;

/// At most this many diagnostics are passed to the host.
const MAX_DIAGNOSTICS: usize = 50;

pub struct Report {
    ok: bool,
    error: Option<String>,
    source: &'static str,
    input_bytes: usize,
    pub source_version: &'static str,
    pub output_version: &'static str,
    pub output_bytes: usize,
    pub text_encoding: Option<&'static str>,
    /// `png` or `dib` when the job hands a thumbnail back.
    pub preview_format: Option<&'static str>,
    pub read_ms: f64,
    pub write_ms: f64,
    entities: usize,
    objects: usize,
    table_records: usize,
    skipped_records: usize,
    recovered_errors: usize,
    recovered: bool,
    diagnostics: Vec<(String, String)>,
    diagnostics_total: usize,
}

impl Report {
    pub fn new(source: &'static str, input_bytes: usize) -> Self {
        Self {
            ok: true,
            error: None,
            source,
            input_bytes,
            source_version: "",
            output_version: "",
            output_bytes: 0,
            text_encoding: None,
            preview_format: None,
            read_ms: 0.0,
            write_ms: 0.0,
            entities: 0,
            objects: 0,
            table_records: 0,
            skipped_records: 0,
            recovered_errors: 0,
            recovered: false,
            diagnostics: Vec::new(),
            diagnostics_total: 0,
        }
    }

    pub fn failure(message: &str) -> Self {
        let mut report = Self::new("", 0);
        report.ok = false;
        report.error = Some(message.to_string());
        report
    }

    pub fn absorb(&mut self, stats: &ReadStats) {
        self.entities = stats.output_entities;
        self.objects = stats.output_objects;
        self.table_records = stats.output_table_records;
        self.skipped_records = stats.skipped_source_records;
        self.recovered_errors = stats.recovered_errors;
        self.recovered = stats.recovered();
        for diagnostic in &stats.diagnostics {
            self.warn(&diagnostic.code, &diagnostic.message);
        }
    }

    pub fn warn(&mut self, code: &str, message: &str) {
        self.diagnostics_total += 1;
        if self.diagnostics.len() < MAX_DIAGNOSTICS {
            self.diagnostics
                .push((code.to_string(), message.to_string()));
        }
    }

    pub fn into_json(self) -> String {
        let mut out = String::with_capacity(256 + self.diagnostics.len() * 96);
        out.push('{');
        field_raw(&mut out, "ok", if self.ok { "true" } else { "false" });
        if let Some(error) = &self.error {
            field_str(&mut out, "error", error);
        }
        field_str(&mut out, "source", self.source);
        field_str(&mut out, "sourceVersion", self.source_version);
        field_str(&mut out, "outputVersion", self.output_version);
        if let Some(encoding) = self.text_encoding {
            field_str(&mut out, "textEncoding", encoding);
        }
        if let Some(format) = self.preview_format {
            field_str(&mut out, "previewFormat", format);
        }
        field_raw(&mut out, "inputBytes", &self.input_bytes.to_string());
        field_raw(&mut out, "outputBytes", &self.output_bytes.to_string());
        field_raw(&mut out, "readMs", &number(self.read_ms));
        field_raw(&mut out, "writeMs", &number(self.write_ms));
        field_raw(&mut out, "entities", &self.entities.to_string());
        field_raw(&mut out, "objects", &self.objects.to_string());
        field_raw(&mut out, "tableRecords", &self.table_records.to_string());
        field_raw(
            &mut out,
            "skippedRecords",
            &self.skipped_records.to_string(),
        );
        field_raw(
            &mut out,
            "recoveredErrors",
            &self.recovered_errors.to_string(),
        );
        field_raw(
            &mut out,
            "recovered",
            if self.recovered { "true" } else { "false" },
        );
        field_raw(
            &mut out,
            "diagnosticsTotal",
            &self.diagnostics_total.to_string(),
        );
        out.push_str("\"diagnostics\":[");
        for (index, (code, message)) in self.diagnostics.iter().enumerate() {
            if index > 0 {
                out.push(',');
            }
            out.push('{');
            field_str(&mut out, "code", code);
            out.push_str("\"message\":");
            string(&mut out, message);
            out.push('}');
        }
        out.push_str("]}");
        out
    }
}

fn field_raw(out: &mut String, name: &str, value: &str) {
    out.push('"');
    out.push_str(name);
    out.push_str("\":");
    out.push_str(value);
    out.push(',');
}

fn field_str(out: &mut String, name: &str, value: &str) {
    out.push('"');
    out.push_str(name);
    out.push_str("\":");
    string(out, value);
    out.push(',');
}

fn number(value: f64) -> String {
    if value.is_finite() {
        format!("{value:.1}")
    } else {
        "0".to_string()
    }
}

fn string(out: &mut String, value: &str) {
    out.push('"');
    for ch in value.chars() {
        match ch {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            '\t' => out.push_str("\\t"),
            ch if (ch as u32) < 0x20 => {
                out.push_str(&format!("\\u{:04x}", ch as u32));
            }
            ch => out.push(ch),
        }
    }
    out.push('"');
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn escapes_strings() {
        let json = Report::failure("bad \"file\"\n\tat C:\\x").into_json();
        assert!(json.contains(r#""error":"bad \"file\"\n\tat C:\\x""#));
        assert!(json.starts_with("{\"ok\":false,"));
        assert!(json.ends_with("\"diagnostics\":[]}"));
    }
}
