const C = {
  wine: "#7A1528",
  wineAlpha: "rgba(122,21,40,0.07)",
  gold: "#B79A63",
  ivoryLight: "#FAF8F4",
  white: "#FFFFFF",
  charcoal: "#242124",
  muted: "#7A756F",
  border: "#E8E5E2",
};

export default function VisitRow({ visit, index, isOpen, onToggle }) {
  return (
    <div
      style={{
        paddingLeft: "clamp(20px, 4vw, 32px)",
        paddingBottom: index === 0 ? 0 : 28,
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 7,
          top: 5,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: isOpen ? C.wine : C.white,
          border: `2px solid ${isOpen ? C.wine : C.gold}`,
          boxShadow: isOpen ? `0 0 0 4px ${C.wineAlpha}` : "none",
          zIndex: 2,
          transition: "all 0.18s ease",
        }}
      />

      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "none",
          border: "none",
          padding: 0,
          textAlign: "left",
          marginBottom: isOpen ? 20 : 0,
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: isOpen ? C.wine : C.charcoal,
            letterSpacing: "-0.015em",
            transition: "color 0.14s",
            whiteSpace: "nowrap",
          }}
        >
          {visit.visitDate}
        </span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        {isOpen && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: C.wine,
              background: C.wineAlpha,
              borderRadius: 6,
              padding: "2px 8px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Expanded
          </span>
        )}
        <svg
          width="14"
          height="14"
          fill="none"
          stroke={C.muted}
          strokeWidth="2"
          strokeLinecap="round"
          viewBox="0 0 24 24"
          style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            background: C.ivoryLight,
            border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.wine}`,
            borderRadius: "0 12px 12px 0",
            overflow: "hidden",
          }}
        >
          {visit.symptoms && (
            <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                <div style={{ width: 2.5, height: 12, background: C.muted, borderRadius: 2 }} />
                <span style={{ fontSize: 9, letterSpacing: "0.18em", fontWeight: 900, color: C.muted, textTransform: "uppercase" }}>
                  Symptoms
                </span>
              </div>
              <p style={{ fontSize: 13.5, color: C.charcoal, margin: 0, lineHeight: 1.7 }}>{visit.symptoms}</p>
            </div>
          )}
          {visit.doctorNotes && (
            <div
              style={{
                padding: "16px 22px",
                borderBottom: visit.prescriptions?.length ? `1px solid ${C.border}` : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                <div style={{ width: 2.5, height: 12, background: C.wine, borderRadius: 2 }} />
                <span style={{ fontSize: 9, letterSpacing: "0.18em", fontWeight: 900, color: C.muted, textTransform: "uppercase" }}>
                  Diagnosis & Notes
                </span>
              </div>
              <p style={{ fontSize: 13.5, color: C.charcoal, margin: 0, lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {visit.doctorNotes}
              </p>
            </div>
          )}
          {visit.prescriptions?.length > 0 && (
            <div style={{ padding: "16px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 2.5, height: 12, background: C.gold, borderRadius: 2 }} />
                <span style={{ fontSize: 9, letterSpacing: "0.18em", fontWeight: 900, color: C.muted, textTransform: "uppercase" }}>
                  Prescription
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {visit.prescriptions.map((rx, i) => (
                  <div
                    key={i}
                    className="visit-rx-grid"
                    style={{
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: 9,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 9, letterSpacing: "0.1em", fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>
                        Medicine
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.charcoal }}>{rx.medicineName}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, letterSpacing: "0.1em", fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>
                        Frequency
                      </div>
                      <div style={{ fontSize: 13, color: C.charcoal }}>{rx.frequency}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, letterSpacing: "0.1em", fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>
                        Duration
                      </div>
                      <div style={{ fontSize: 13, color: C.charcoal }}>{rx.duration}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, letterSpacing: "0.1em", fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>
                        Instructions
                      </div>
                      <div style={{ fontSize: 13, color: C.charcoal }}>{rx.instructions || "—"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
