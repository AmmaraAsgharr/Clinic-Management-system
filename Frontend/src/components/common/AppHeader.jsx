import { useState } from "react";

const C = {
  wine: "#7A1528",
  wineDark: "#5C1020",
  gold: "#B79A63",
  white: "#FFFFFF",
  charcoal: "#242124",
  muted: "#7A756F",
  border: "#E8E5E2",
  ivory: "#F7F4EF",
};
const SERIF = "'Fraunces', Georgia, serif";

export default function AppHeader({ onLogout, doctor }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const doctorName = doctor?.name || "Doctor";
  const doctorSpecialty = doctor?.specialty || "General Physician";
  // Extract initial for avatar
  const cleanName = doctorName.replace(/^(Dr\.|Doctor)\s*/i, "").trim();
  const avatarLetter = cleanName ? cleanName.charAt(0).toUpperCase() : "D";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: "rgba(247,244,239,0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      <div style={{ height: 2.5, background: `linear-gradient(90deg,${C.wine},${C.gold},transparent)` }} />

      <div
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          padding: "0 44px",
          display: "flex",
          alignItems: "center",
          height: 60,
          justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: `linear-gradient(135deg,${C.wine},${C.wineDark})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 2px 10px rgba(122,21,40,0.28)`,
            }}
          >
            <span style={{ fontFamily: SERIF, color: C.white, fontSize: 15, fontStyle: "italic" }}>C</span>
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.charcoal, letterSpacing: "-0.02em" }}>Clinic</div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: C.muted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 1,
              }}
            >
              Management
            </div>
          </div>
        </div>

        {/* Doctor profile + logout */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "5px 12px 5px 5px",
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              background: C.white,
              cursor: "pointer",
              boxShadow: menuOpen ? "0 4px 16px rgba(36,33,36,0.08)" : "0 1px 4px rgba(36,33,36,0.05)",
              transition: "all 0.13s ease",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: `linear-gradient(135deg,${C.wine},${C.wineDark})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: SERIF,
                color: C.white,
                fontSize: 14,
                fontStyle: "italic",
              }}
            >
              {avatarLetter}
            </div>
            <div style={{ lineHeight: 1.2, textAlign: "left" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.charcoal, letterSpacing: "-0.01em" }}>
                {doctorName}
              </div>
              <div style={{ fontSize: 10, color: C.muted }}>{doctorSpecialty}</div>
            </div>
            <svg
              width="10"
              height="6"
              fill="none"
              viewBox="0 0 10 6"
              style={{ transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.13s", marginLeft: 4 }}
            >
              <path d="M1 1l4 4 4-4" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                minWidth: 160,
                background: C.white,
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                boxShadow: "0 8px 28px rgba(36,33,36,0.12)",
                overflow: "hidden",
                zIndex: 300,
              }}
            >
              <div style={{ padding: "10px 0" }}>
                <div style={{ padding: "8px 16px", borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.charcoal }}>{doctorName}</div>
                  <div style={{ fontSize: 10.5, color: C.muted }}>{doctorSpecialty}</div>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout?.();
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#DC2626",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
