import { useState } from "react";
import { authService } from "../services/api";

const C = {
  wine: "#7A1528",
  wineDark: "#5C1020",
  gold: "#B79A63",
  champagne: "#EDE3D5",
  ivory: "#F7F4EF",
  white: "#FFFFFF",
  charcoal: "#242124",
  muted: "#7A756F",
  border: "#E8E5E2",
  error: "#DC2626",
};
const SERIF = "'Fraunces', Georgia, serif";

function Field({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label style={{ fontSize: 11.5, fontWeight: 700, color: C.charcoal, letterSpacing: "0.02em", display: "block", marginBottom: 7 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "13px 16px",
          borderRadius: 10,
          fontSize: 13.5,
          border: `1.5px solid ${C.border}`,
          background: C.white,
          color: C.charcoal,
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}
      />
    </div>
  );
}

export default function SignupPage({ onSuccess, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpec] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!name || !email || !password) {
      setErr("Please fill all required fields.");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const formattedName = name.startsWith("Dr.") ? name : "Dr. " + name;
      const res = await authService.register({
        name: formattedName.trim(),
        email: email.trim(),
        password,
        specialty: specialty.trim() || "General Physician",
      });
      if (res.success && res.doctor) {
        onSuccess(res.doctor);
      } else {
        setErr(res.message || "Registration failed.");
      }
    } catch (error) {
      setErr(error.message || "Failed to connect to server. Please check your backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.ivory, display: "flex", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      {/* Left panel */}
      <div
        style={{
          width: "42%",
          background: C.wine,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 56px",
          flexShrink: 0,
        }}
      >
        <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -50, left: 40, width: 160, height: 160, borderRadius: "50%", background: "rgba(183,154,99,0.1)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,rgba(183,154,99,0.5),transparent)` }} />

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 64 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontFamily: SERIF, color: C.white, fontSize: 16, fontStyle: "italic" }}>C</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.white }}>Clinic</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Management
              </div>
            </div>
          </div>

          <h2 style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 400, color: C.white, fontStyle: "italic", letterSpacing: "-0.025em", lineHeight: 1.1, margin: "0 0 16px" }}>
            Set up your practice.
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 320 }}>
            Create your account in seconds. Your clinical workspace will be ready immediately — no setup required.
          </p>

          <div style={{ marginTop: 56, padding: "24px", background: "rgba(255,255,255,0.06)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: 10.5, letterSpacing: "0.12em", fontWeight: 800, color: C.gold, textTransform: "uppercase", marginBottom: 12 }}>
              What you get
            </div>
            {["Unlimited patient records", "Complete visit history", "Prescription management", "Medical file storage", "Follow-up tracking"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: C.gold }}>✓</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.charcoal, letterSpacing: "-0.025em", margin: "0 0 6px" }}>
            Create your account
          </h1>
          <p style={{ fontSize: 13.5, color: C.muted, margin: "0 0 32px" }}>
            Already registered?{" "}
            <button onClick={onLogin} style={{ color: C.wine, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: 13.5 }}>
              Log in
            </button>
          </p>

          {err && (
            <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: C.error }}>
              {err}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label="Full name *" value={name} onChange={setName} placeholder="Dr. Ahmed Khan" />
            <Field label="Email address *" value={email} onChange={setEmail} type="email" placeholder="doctor@clinic.com" />
            <Field label="Specialty" value={specialty} onChange={setSpec} placeholder="e.g. General Physician" />
            <Field label="Password *" value={password} onChange={setPassword} type="password" placeholder="Min. 6 characters" />
            <Field label="Confirm password *" value={confirm} onChange={setConfirm} type="password" placeholder="Re-enter your password" />

            <p style={{ fontSize: 11.5, color: C.muted, margin: 0, lineHeight: 1.6 }}>
              By creating an account you agree to our Terms of Service and Privacy Policy.
            </p>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "14px",
                borderRadius: 11,
                fontSize: 14,
                fontWeight: 800,
                background: loading ? C.muted : C.wine,
                color: C.white,
                border: "none",
                cursor: "pointer",
                boxShadow: loading ? "none" : `0 4px 18px rgba(122,21,40,0.28)`,
                letterSpacing: "0.01em",
              }}
            >
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
