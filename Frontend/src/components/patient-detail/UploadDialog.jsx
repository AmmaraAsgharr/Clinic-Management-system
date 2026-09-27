import { useState, useRef } from "react";
import { fileService } from "../../services/api";

const C = {
  wine: "#7A1528",
  wineAlpha: "rgba(122,21,40,0.07)",
  gold: "#B79A63",
  ivoryLight: "#FAF8F4",
  white: "#FFFFFF",
  charcoal: "#242124",
  muted: "#7A756F",
  border: "#E8E5E2",
  error: "#DC2626",
};
const SERIF = "'Fraunces', Georgia, serif";

export default function UploadDialog({ patientId, onClose, onUploaded }) {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState(null);
  const [fileType, setFileType] = useState("lab");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const FILE_TYPES = [
    { value: "lab", label: "Lab Report" },
    { value: "ecg", label: "ECG" },
    { value: "imaging", label: "Imaging / X-Ray" },
    { value: "other", label: "Other" },
  ];

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setSelected(f);
  }

  async function handleSave() {
    if (!selected) return;
    setUploading(true);
    setErr("");
    try {
      const formData = new FormData();
      formData.append("file", selected);
      formData.append("patientId", patientId);
      formData.append("fileType", fileType);
      formData.append("uploadedBy", "Dr. Ahmed");

      const res = await fileService.uploadFile(formData);

      if (res.success) {
        setDone(true);
        onUploaded?.();
        setTimeout(onClose, 900);
      } else {
        setErr(res.message || "Failed to upload file.");
      }
    } catch (error) {
      setErr(error.message || "Failed to connect to backend server.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(36,33,36,0.45)", backdropFilter: "blur(4px)" }} />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          background: C.white,
          borderRadius: 18,
          boxShadow: "0 24px 72px rgba(36,33,36,0.2)",
          overflow: "hidden",
        }}
      >
        <div style={{ background: C.wine, padding: "22px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.16em", fontWeight: 800, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 4 }}>
              Medical Files
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 22, color: C.white, fontStyle: "italic", letterSpacing: "-0.015em" }}>
              Upload Document
            </div>
          </div>
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
        <div style={{ height: 2, background: `linear-gradient(90deg,${C.wine},${C.gold},transparent)` }} />

        <div style={{ padding: "28px" }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 40, color: C.wine, marginBottom: 12 }}>✓</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.charcoal }}>File uploaded successfully</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>{selected?.name}</div>
            </div>
          ) : (
            <>
              {err && (
                <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.error, marginBottom: 16 }}>
                  {err}
                </div>
              )}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${dragging ? C.wine : C.border}`,
                  borderRadius: 12,
                  padding: "32px 20px",
                  textAlign: "center",
                  background: dragging ? C.wineAlpha : C.ivoryLight,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  marginBottom: 20,
                }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setSelected(f);
                  }}
                />
                {selected ? (
                  <div>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.charcoal }}>{selected.name}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                      {(selected.size / 1024).toFixed(1)} KB · Click to change
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.4 }}>⬆</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.charcoal, marginBottom: 4 }}>
                      Drop file here or click to browse
                    </div>
                    <div style={{ fontSize: 12, color: C.muted }}>PDF, PNG, JPG, DICOM supported</div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    fontWeight: 800,
                    color: C.muted,
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  File Type
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {FILE_TYPES.map((ft) => (
                    <button
                      key={ft.value}
                      type="button"
                      onClick={() => setFileType(ft.value)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 9,
                        fontSize: 13,
                        fontWeight: 600,
                        textAlign: "left",
                        border: `1.5px solid ${fileType === ft.value ? C.wine : C.border}`,
                        background: fileType === ft.value ? C.wineAlpha : C.white,
                        color: fileType === ft.value ? C.wine : C.muted,
                        cursor: "pointer",
                        transition: "all 0.13s ease",
                      }}
                    >
                      {ft.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 10,
                    fontSize: 13.5,
                    fontWeight: 700,
                    border: `1.5px solid ${C.border}`,
                    background: C.white,
                    color: C.muted,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!selected || uploading}
                  style={{
                    flex: 2,
                    padding: "12px",
                    borderRadius: 10,
                    fontSize: 13.5,
                    fontWeight: 800,
                    background: !selected || uploading ? C.muted : C.wine,
                    color: C.white,
                    border: "none",
                    cursor: !selected || uploading ? "not-allowed" : "pointer",
                    boxShadow: !selected || uploading ? "none" : `0 4px 14px rgba(122,21,40,0.25)`,
                    letterSpacing: "0.01em",
                  }}
                >
                  {uploading ? "Uploading…" : "Upload File →"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
