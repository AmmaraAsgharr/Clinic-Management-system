import { fileService } from "../../services/api";

const C = {
  wine: "#7A1528",
  gold: "#B79A63",
  champagne: "#EDE3D5",
  ivoryLight: "#FAF8F4",
  white: "#FFFFFF",
  charcoal: "#242124",
  muted: "#7A756F",
  border: "#E8E5E2",
};
const SERIF = "'Fraunces', Georgia, serif";

export default function ViewFileDialog({ file, onClose }) {
  const typeLabel = {
    lab: "Laboratory Report",
    ecg: "ECG Report",
    imaging: "Imaging / X-Ray",
    other: "Document",
  };

  const fileId = file.fileId || file.id;

  // Direct GridFS URL — no extra API call needed
  const viewUrl = fileService.getViewUrl(fileId);

  function handleOpenFile() {
    window.open(viewUrl, "_blank", "noopener,noreferrer");
  }

  function handleDownload() {
    const link = document.createElement("a");
    link.href = viewUrl;
    link.download = file.filename;
    link.click();
  }

  return (
    <div className="dialog-overlay">
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(36,33,36,0.5)", backdropFilter: "blur(4px)" }} />
      <div className="dialog-modal-box" style={{ maxWidth: 680 }}>
        {/* Header */}
        <div
          style={{
            background: C.wine,
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 9.5,
                letterSpacing: "0.16em",
                fontWeight: 800,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {typeLabel[file.fileType] || "Medical Document"}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 22, color: C.white, fontStyle: "italic", letterSpacing: "-0.015em" }}>
              {file.filename}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={handleDownload}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.75)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download
            </button>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.7)",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>
        <div style={{ height: 2, background: `linear-gradient(90deg,${C.wine},${C.gold},transparent)`, flexShrink: 0 }} />

        {/* Metadata Strip */}
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, flexShrink: 0, background: C.ivoryLight }}>
          {[
            ["Date", file.date],
            ["Uploaded by", file.uploadedBy || "Doctor"],
            ["Type", typeLabel[file.fileType] || file.fileType],
            ["File ID", fileId],
          ].map(([k, v], i) => (
            <div key={i} style={{ padding: "12px 20px", borderRight: i < 3 ? `1px solid ${C.border}` : "none", flex: 1 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.12em", fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>
                {k}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Document Preview Area */}
        <div style={{ padding: "32px 28px", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 280, background: C.ivoryLight }}>
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              background: C.white,
              borderRadius: 14,
              border: `1px solid ${C.border}`,
              padding: "36px 24px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(36,33,36,0.04)",
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 12 }}>
              {file.fileType === "imaging" ? "🖼️" : file.fileType === "ecg" ? "📈" : "📋"}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.charcoal, marginBottom: 6 }}>
              {file.filename}
            </div>
            <p style={{ fontSize: 13, color: C.muted, margin: "0 auto 20px", maxWidth: 360, lineHeight: 1.6 }}>
              Stored securely in <strong>MongoDB Atlas</strong>
            </p>
            <div style={{ display: "inline-flex", gap: 10 }}>
              <button
                onClick={handleOpenFile}
                style={{
                  padding: "9px 24px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  background: C.wine,
                  color: C.white,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: `0 3px 12px rgba(122,21,40,0.25)`,
                }}
              >
                Open File ↗
              </button>
              <button
                onClick={handleDownload}
                style={{
                  padding: "9px 24px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  background: "transparent",
                  color: C.wine,
                  border: `1.5px solid ${C.wine}`,
                  cursor: "pointer",
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
