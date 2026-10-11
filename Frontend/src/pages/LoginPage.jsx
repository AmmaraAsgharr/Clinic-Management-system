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

export default function LoginPage({ onSuccess, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!email || !password) {
      setErr("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await authService.login({
        email: email.trim(),
        password,
      });
      if (res.success && res.doctor) {
        onSuccess(res.doctor);
      } else {
        setErr(res.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setErr(error.message || "Failed to connect to server. Please check your backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper" style={{ minHeight: "100vh", background: C.ivory, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      {/* Left panel — wine */}
      <div className="auth-side-panel">
        <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -50, left: 40, width: 160, height: 160, borderRadius: "50%", background: "rgba(183,154,99,0.1)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,rgba(183,154,99,0.5),transparent)` }} />

        <div style={{ position: "relative" }}>
          {/* Logo */}
          <div className="auth-logo" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 64 }}>
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
              <div style={{ fontSize: 13, fontWeight: 800, color: C.white, letterSpacing: "-0.01em" }}>Clinic</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Management
              </div>
            </div>
          </div>

          <h2 style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 400, color: C.white, fontStyle: "italic", letterSpacing: "-0.025em", lineHeight: 1.1, margin: "0 0 16px" }}>
            Welcome back, Doctor.
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 320, margin: 0 }}>
            Your clinical workspace is ready. Log in to access your patient records, visits, and prescriptions.
          </p>

          <div className="auth-features-list">
            {["Patient records in one place", "Visit history with prescriptions", "Follow-up date tracking", "Secure medical file storage"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-form-panel">
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.charcoal, letterSpacing: "-0.025em", margin: "0 0 6px" }}>
            Log in to your account
          </h1>
          <p style={{ fontSize: 13.5, color: C.muted, margin: "0 0 36px" }}>
            {"Don't have an account? "}
            <button onClick={onSignup} style={{ color: C.wine, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: 13.5 }}>
              Sign up
            </button>
          </p>

          {err && (
            <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: C.error }}>
              {err}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { label: "Email address", value: email, setter: setEmail, type: "email", placeholder: "doctor@clinic.com" },
              { label: "Password", value: password, setter: setPassword, type: "password", placeholder: "Enter your password" },
            ].map((f) => (
              <div key={f.label}>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: C.charcoal, letterSpacing: "0.02em", display: "block", marginBottom: 7 }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={f.value}
                  onChange={(e) => f.setter(e.target.value)}
                  placeholder={f.placeholder}
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
            ))}


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
                transition: "all 0.15s ease",
                letterSpacing: "0.01em",
              }}
            >
              {loading ? "Logging in…" : "Log in →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
