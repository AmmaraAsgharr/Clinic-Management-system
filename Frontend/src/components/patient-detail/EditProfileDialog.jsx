import { useState } from "react";
import { medicalHistories, getPatientHistory } from "../../data/store";

const C = {
  wine: "#7A1528",
  gold: "#B79A63",
  ivoryLight: "#FAF8F4",
  white: "#FFFFFF",
  charcoal: "#242124",
  muted: "#7A756F",
  border: "#E8E5E2",
};
const SERIF = "'Fraunces', Georgia, serif";

export default function EditProfileDialog({ patientId, patient, onClose, onUpdated }) {
  const existingHistory = getPatientHistory(patientId);

  const [tab, setTab] = useState("info");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const [name, setName] = useState(patient.name || "");
  const [email, setEmail] = useState(patient.email || "");
  const [phone, setPhone] = useState(patient.phone || "");
  const [disease, setDisease] = useState(patient.disease || "");
  const [address, setAddress] = useState(patient.address || "");

  const [diseases, setDiseases] = useState(existingHistory?.diseases?.join(", ") ?? "");
  const [allergies, setAllergies] = useState(existingHistory?.allergies?.join(", ") ?? "");
  const [prevDesc, setPrevDesc] = useState(existingHistory?.previousDescription ?? "");
  const [diagDate, setDiagDate] = useState(existingHistory?.diagnosedDate ?? "");

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      patient.name = name.trim() || patient.name;
      patient.email = email.trim();
      patient.phone = phone.trim();
      patient.disease = disease.trim();
      patient.address = address.trim();

      const idx = medicalHistories.findIndex((h) => h.patientId === patientId);
      const updatedHistory = {
        diseases: diseases.split(",").map((s) => s.trim()).filter(Boolean),
        allergies: allergies.split(",").map((s) => s.trim()).filter(Boolean),
        previousDescription: prevDesc.trim(),
        diagnosedDate: diagDate,
      };

      if (idx !== -1) {
        Object.assign(medicalHistories[idx], updatedHistory);
      } else {
        medicalHistories.push({
          id: `MH-${Date.now()}`,
          patientId,
          createdOn: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          ...updatedHistory,
        });
      }

      setSaving(false);
      setDone(true);
      onUpdated?.();
      setTimeout(onClose, 800);
    }, 600);
  }

  const iStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 9,
    fontSize: 13.5,
    border: `1.5px solid ${C.border}`,
    background: C.ivoryLight,
    color: C.charcoal,
    fontFamily: "'Plus Jakarta Sans',sans-serif",
  };
  const taStyle = { ...iStyle, resize: "vertical", lineHeight: 1.65 };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(36,33,36,0.45)", backdropFilter: "blur(4px)" }} />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          background: C.white,
          borderRadius: 18,
          boxShadow: "0 24px 72px rgba(36,33,36,0.2)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
              Patient Record
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 22, color: C.white, fontStyle: "italic", letterSpacing: "-0.015em" }}>
              Edit Profile
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
        <div style={{ height: 2, background: `linear-gradient(90deg,${C.wine},${C.gold},transparent)`, flexShrink: 0 }} />

        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0, background: C.ivoryLight }}>
          {[
            ["info", "Patient Info"],
            ["history", "Medical History"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              style={{
                flex: 1,
                padding: "13px",
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                background: "transparent",
                color: tab === key ? C.wine : C.muted,
                borderBottom: tab === key ? `2.5px solid ${C.wine}` : "2.5px solid transparent",
                letterSpacing: "0.005em",
                transition: "all 0.13s ease",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {done ? (
          <div style={{ textAlign: "center", padding: "48px 28px" }}>
            <div style={{ fontSize: 44, color: C.wine, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.charcoal }}>Profile updated successfully</div>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {tab === "info" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 7 }}>
                      Full Name *
                    </label>
                    <input value={name} onChange={(e) => setName(e.target.value)} style={iStyle} required />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 7 }}>
                      Phone
                    </label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} style={iStyle} />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 7 }}>
                      Email
                    </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={iStyle} />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 7 }}>
                      Primary Disease / Complaint
                    </label>
                    <input value={disease} onChange={(e) => setDisease(e.target.value)} style={iStyle} />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 7 }}>
                      Address
                    </label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} style={iStyle} />
                  </div>
                </div>
              )}

              {tab === "history" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 7 }}>
                      Conditions / Diseases
                    </label>
                    <input
                      value={diseases}
                      onChange={(e) => setDiseases(e.target.value)}
                      placeholder="Diabetes Type II, Hypertension (comma separated)"
                      style={iStyle}
                    />
                    <p style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>Separate multiple conditions with commas.</p>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 7 }}>
                      Allergies
                    </label>
                    <input
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="Penicillin, Aspirin (comma separated)"
                      style={iStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 7 }}>
                      Date of First Diagnosis
                    </label>
                    <input type="date" value={diagDate} onChange={(e) => setDiagDate(e.target.value)} style={iStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 7 }}>
                      Previous Medical History
                    </label>
                    <textarea
                      value={prevDesc}
                      onChange={(e) => setPrevDesc(e.target.value)}
                      rows={4}
                      placeholder="Prior illnesses, surgeries, hospitalizations, family history…"
                      style={taStyle}
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, flexShrink: 0, background: C.white }}>
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
                type="submit"
                disabled={saving}
                style={{
                  flex: 2,
                  padding: "12px",
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: 800,
                  background: saving ? C.muted : C.wine,
                  color: C.white,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: saving ? "none" : `0 4px 14px rgba(122,21,40,0.25)`,
                  letterSpacing: "0.01em",
                }}
              >
                {saving ? "Saving…" : "Save Changes →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
