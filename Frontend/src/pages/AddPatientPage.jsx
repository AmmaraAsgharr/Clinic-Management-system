import { useState } from "react";
import { addPatient, addMedicalHistory } from "../data/store";
import AppHeader from "../components/common/AppHeader";

const C = {
  wine: "#7A1528",
  gold: "#B79A63",
  champagne: "#EDE3D5",
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
          rows={3}
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
            lineHeight: 1.6,
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

export default function AddPatientPage({ onBack, onSaved }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [disease, setDisease] = useState("");
  const [address, setAddress] = useState("");
  const [prevDesc, setPrevDesc] = useState("");
  const [allergies, setAllergies] = useState("");
  const [diseases, setDiseases] = useState("");
  const [diagDate, setDiagDate] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!name.trim() || !phone.trim()) {
      setErr("Patient name and phone are required.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const p = addPatient({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        disease: disease.trim(),
        address: address.trim(),
      });
      addMedicalHistory({
        patientId: p.id,
        previousDescription: prevDesc.trim(),
        allergies: allergies.split(",").map((s) => s.trim()).filter(Boolean),
        diseases: diseases.split(",").map((s) => s.trim()).filter(Boolean),
        diagnosedDate: diagDate,
      });
      setSaving(false);
      onSaved(p.id);
    }, 600);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.ivory, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <AppHeader onLogout={onBack} />

      {/* Wine Sub-header */}
      <div style={{ background: C.wine, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg,transparent,rgba(183,154,99,0.5),transparent)` }} />
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)" }} />
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
              Dashboard
            </button>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>/</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
              Add New Patient
            </span>
          </div>
          <div style={{ padding: "28px 0 32px" }}>
            <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 400, color: C.white, fontStyle: "italic", letterSpacing: "-0.025em", margin: 0 }}>
              New Patient Registration
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
              Fill in the patient's information and medical history to create their record.
            </p>
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Patient Info Card */}
          <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 1px 6px rgba(36,33,36,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "18px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.wine, borderRadius: 2 }} />
              <span style={{ fontSize: 10, letterSpacing: "0.16em", fontWeight: 800, color: C.muted, textTransform: "uppercase" }}>
                Patient Information
              </span>
            </div>
            <div style={{ padding: "28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Field label="Full Name" value={name} onChange={setName} placeholder="Ahmed Khan" required />
              <Field label="Phone Number" value={phone} onChange={setPhone} placeholder="0300-1234567" required />
              <Field label="Email Address" value={email} onChange={setEmail} type="email" placeholder="patient@email.com" />
              <Field label="Primary Disease / Complaint" value={disease} onChange={setDisease} placeholder="e.g. Diabetes, Hypertension" />
              <Field label="Address" value={address} onChange={setAddress} placeholder="House no., Street, City" span={2} />
            </div>
          </div>

          {/* Medical History Card */}
          <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 1px 6px rgba(36,33,36,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "18px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
              <span style={{ fontSize: 10, letterSpacing: "0.16em", fontWeight: 800, color: C.muted, textTransform: "uppercase" }}>
                Medical History
              </span>
              <span style={{ fontSize: 12, color: C.muted, marginLeft: 4 }}>(optional)</span>
            </div>
            <div style={{ padding: "28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Field label="Known Diseases / Diagnoses" value={diseases} onChange={setDiseases} placeholder="Diabetes Type II, Hypertension (comma separated)" />
              <Field label="Allergies" value={allergies} onChange={setAllergies} placeholder="Penicillin, Aspirin (comma separated)" />
              <Field label="Date of First Diagnosis" value={diagDate} onChange={setDiagDate} type="date" span={2} />
              <Field
                label="Previous Medical History / Description"
                value={prevDesc}
                onChange={setPrevDesc}
                type="textarea"
                placeholder="Describe any prior illnesses, surgeries, hospitalizations, or relevant family history…"
                span={2}
              />
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
                padding: "12px 32px",
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
              {saving ? "Saving…" : "Save Patient →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
