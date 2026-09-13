import { useState } from "react";
import { patients, getPatientHistory, addVisit } from "../data/store";
import AppHeader from "../components/common/AppHeader";

const C = {
  wine: "#7A1528",
  wineDark: "#5C1020",
  gold: "#B79A63",
  ivory: "#F7F4EF",
  ivoryLight: "#FAF8F4",
  white: "#FFFFFF",
  charcoal: "#242124",
  muted: "#7A756F",
  border: "#E8E5E2",
  error: "#DC2626",
};
const SERIF = "'Fraunces', Georgia, serif";

function Field({ label, value, onChange, type = "text", placeholder = "", required = false, span = 1 }) {
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <label style={{ fontSize: 11.5, fontWeight: 700, color: C.charcoal, letterSpacing: "0.02em", display: "block", marginBottom: 7 }}>
        {label}
        {required && <span style={{ color: C.wine, marginLeft: 2 }}>*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 10,
            fontSize: 13.5,
            border: `1.5px solid ${C.border}`,
            background: C.white,
            color: C.charcoal,
            resize: "vertical",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            lineHeight: 1.65,
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 10,
            fontSize: 13.5,
            border: `1.5px solid ${C.border}`,
            background: C.white,
            color: C.charcoal,
            fontFamily: "'Plus Jakarta Sans',sans-serif",
          }}
        />
      )}
    </div>
  );
}

export default function NewVisitPage({ patientId, onBack, onSaved }) {
  const patient = patients.find((p) => p.id === patientId);
  const history = getPatientHistory(patientId);

  const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  const [rxRows, setRxRows] = useState([
    { medicineName: "", frequency: "", duration: "", instructions: "" },
  ]);

  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  function updateRx(idx, field, val) {
    setRxRows((rows) => rows.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));
  }

  function addRxRow() {
    setRxRows((r) => [...r, { medicineName: "", frequency: "", duration: "", instructions: "" }]);
  }

  function removeRxRow(idx) {
    setRxRows((r) => r.filter((_, i) => i !== idx));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!symptoms.trim() && !diagnosis.trim()) {
      setErr("Please enter at least symptoms or diagnosis.");
      return;
    }
    const validRx = rxRows.filter((r) => r.medicineName.trim());
    setSaving(true);
    setTimeout(() => {
      addVisit(
        patientId,
        {
          visitDate: new Date(visitDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          symptoms: symptoms.trim(),
          doctorNotes: `Diagnosis: ${diagnosis.trim()}\n\n${notes.trim()}`,
          followUpDate: null,
        },
        validRx
      );
      setSaving(false);
      onSaved();
    }, 600);
  }

  if (!patient) return null;

  return (
    <div style={{ minHeight: "100vh", background: C.ivory, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <AppHeader onLogout={onBack} />

      {/* Wine Header */}
      <div style={{ background: C.wine, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg,transparent,rgba(183,154,99,0.5),transparent)` }} />
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -30, right: 80, width: 120, height: 120, borderRadius: "50%", background: "rgba(183,154,99,0.1)" }} />

        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 44px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, height: 52, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              onClick={onBack}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 8,
                padding: "6px 14px",
                color: "rgba(255,255,255,0.8)",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              {patient.name}
            </button>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>/</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
              New Visit
            </span>
          </div>

          <div style={{ padding: "28px 0 34px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.1)",
                  border: "1.5px solid rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: SERIF,
                  fontSize: 26,
                  color: C.white,
                  fontStyle: "italic",
                  flexShrink: 0,
                }}
              >
                {patient.name[0]}
              </div>
              <div>
                <h1 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 400, color: C.white, fontStyle: "italic", letterSpacing: "-0.025em", margin: 0, lineHeight: 1 }}>
                  New Visit — {patient.name}
                </h1>
                <div style={{ display: "flex", gap: 12, marginTop: 7, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.04em" }}>{patient.id}</span>
                  <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{patient.phone}</span>
                  {history?.allergies?.length ? (
                    <>
                      <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
                      <span style={{ fontSize: 11, color: "rgba(254,202,202,0.8)", fontWeight: 600 }}>
                        ⚠ Allergy: {history.allergies.join(", ")}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: 2.5, background: `linear-gradient(90deg,${C.wine},${C.gold},rgba(183,154,99,0.1))` }} />

      {/* Form Container */}
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "44px 44px 100px" }}>
        {err && (
          <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, padding: "12px 18px", marginBottom: 28, fontSize: 13.5, color: C.error }}>
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Visit Details */}
          <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 1px 6px rgba(36,33,36,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "16px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 3, height: 15, background: C.wine, borderRadius: 2 }} />
              <span style={{ fontSize: 10, letterSpacing: "0.16em", fontWeight: 800, color: C.muted, textTransform: "uppercase" }}>
                Visit Details
              </span>
            </div>
            <div style={{ padding: "24px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Field label="Visit Date" value={visitDate} onChange={setVisitDate} type="date" required span={2} />
              <Field label="Symptoms" value={symptoms} onChange={setSymptoms} type="textarea" placeholder="Describe patient-reported symptoms in detail…" span={2} />
              <Field label="Diagnosis" value={diagnosis} onChange={setDiagnosis} type="textarea" placeholder="Clinical diagnosis and key findings…" span={2} />
              <Field label="Doctor Notes" value={notes} onChange={setNotes} type="textarea" placeholder="Treatment plan, lifestyle advice, observations…" span={2} />
            </div>
          </div>

          {/* Prescriptions */}
          <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 1px 6px rgba(36,33,36,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "16px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 3, height: 15, background: C.gold, borderRadius: 2 }} />
                <span style={{ fontSize: 10, letterSpacing: "0.16em", fontWeight: 800, color: C.muted, textTransform: "uppercase" }}>
                  Prescriptions
                </span>
                <span style={{ fontSize: 12, color: C.muted }}>(stored separately)</span>
              </div>
              <button
                type="button"
                onClick={addRxRow}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  border: `1px solid rgba(122,21,40,0.2)`,
                  background: "rgba(122,21,40,0.06)",
                  color: C.wine,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1, fontWeight: 300 }}>+</span>
                Add medicine
              </button>
            </div>

            <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr 32px", gap: 12 }}>
                {["Medicine Name", "Frequency", "Duration", "Instructions", ""].map((h, i) => (
                  <span key={i} style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.12em", color: C.muted, textTransform: "uppercase" }}>
                    {h}
                  </span>
                ))}
              </div>

              {rxRows.map((rx, idx) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr 32px", gap: 12, alignItems: "start" }}>
                  <input
                    value={rx.medicineName}
                    onChange={(e) => updateRx(idx, "medicineName", e.target.value)}
                    placeholder="e.g. Metformin 500mg"
                    style={{ padding: "10px 12px", borderRadius: 9, fontSize: 13, border: `1.5px solid ${C.border}`, background: C.ivoryLight, color: C.charcoal, fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  />
                  <input
                    value={rx.frequency}
                    onChange={(e) => updateRx(idx, "frequency", e.target.value)}
                    placeholder="Twice daily"
                    style={{ padding: "10px 12px", borderRadius: 9, fontSize: 13, border: `1.5px solid ${C.border}`, background: C.ivoryLight, color: C.charcoal, fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  />
                  <input
                    value={rx.duration}
                    onChange={(e) => updateRx(idx, "duration", e.target.value)}
                    placeholder="3 months"
                    style={{ padding: "10px 12px", borderRadius: 9, fontSize: 13, border: `1.5px solid ${C.border}`, background: C.ivoryLight, color: C.charcoal, fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  />
                  <input
                    value={rx.instructions}
                    onChange={(e) => updateRx(idx, "instructions", e.target.value)}
                    placeholder="Take with meals"
                    style={{ padding: "10px 12px", borderRadius: 9, fontSize: 13, border: `1.5px solid ${C.border}`, background: C.ivoryLight, color: C.charcoal, fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  />
                  {rxRows.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeRxRow(idx)}
                      style={{
                        width: 32,
                        height: 36,
                        borderRadius: 8,
                        border: `1px solid rgba(220,38,38,0.2)`,
                        background: "rgba(220,38,38,0.05)",
                        color: "#DC2626",
                        cursor: "pointer",
                        fontSize: 16,
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                padding: "12px 28px",
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
              type="submit"
              disabled={saving}
              style={{
                padding: "12px 36px",
                borderRadius: 10,
                fontSize: 13.5,
                fontWeight: 800,
                background: saving ? C.muted : C.wine,
                color: C.white,
                border: "none",
                cursor: "pointer",
                boxShadow: saving ? "none" : `0 4px 16px rgba(122,21,40,0.25)`,
                letterSpacing: "0.01em",
              }}
            >
              {saving ? "Saving visit…" : "Save Visit →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
