import { useState } from "react";
import { patients, visits } from "../data/store";
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
};
const SERIF = "'Fraunces', Georgia, serif";

function GoldRule() {
  return <div style={{ height: 1, background: `linear-gradient(90deg,${C.gold},rgba(183,154,99,0.12))` }} />;
}

export default function DashboardPage({ onOpenPatient, onAddPatient, onLogout }) {
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState(null);

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q);
  });

  return (
    <div style={{ minHeight: "100vh", background: C.ivory, display: "flex", flexDirection: "column", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <AppHeader onLogout={onLogout} />

      <main style={{ flex: 1, maxWidth: 1360, width: "100%", margin: "0 auto", padding: "52px 44px 100px" }}>
        {/* ── Top Hero: Greeting (Left) + Stats Cards (Right) ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, marginBottom: 36, flexWrap: "wrap" }}>
          {/* Greeting Left */}
          <div style={{ maxWidth: 460 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.16em", fontWeight: 700, color: C.gold, textTransform: "uppercase", marginBottom: 8 }}>
              Saturday · 12 September 2026
            </p>
            <h1 style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 400, color: C.charcoal, margin: 0, lineHeight: 1.15, letterSpacing: "-0.02em", fontStyle: "italic" }}>
              Good morning, <span style={{ color: C.wine }}>Dr. Ahmed.</span>
            </h1>
            <p style={{ marginTop: 8, fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>
              You have <strong style={{ color: C.charcoal }}>{patients.length}</strong> patients registered in your practice.
            </p>
          </div>

          {/* Stat Cards Right (Opposite free space) */}
          <div style={{ display: "flex", gap: 16, flex: 1, justifyContent: "flex-end", minWidth: 320, maxWidth: 640 }}>
            {/* Total Patients Card */}
            <div
              style={{
                flex: 1,
                background: C.wine,
                borderRadius: 14,
                padding: "20px 24px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(122,21,40,0.18)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 110,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, letterSpacing: "0.14em", fontWeight: 800, color: "rgba(255,255,255,0.65)", textTransform: "uppercase" }}>
                  Total Patients
                </span>
                <span style={{ fontSize: 16, opacity: 0.8 }}>👥</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 10 }}>
                <span style={{ fontFamily: SERIF, fontSize: 38, color: C.white, lineHeight: 1, fontStyle: "italic" }}>
                  {patients.length}
                </span>
                <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>registered</span>
              </div>
            </div>

            {/* Total Visits Card */}
            <div
              style={{
                flex: 1,
                background: C.white,
                borderRadius: 14,
                padding: "20px 24px",
                border: `1.5px solid ${C.border}`,
                boxShadow: "0 2px 10px rgba(36,33,36,0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 110,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, letterSpacing: "0.14em", fontWeight: 800, color: C.muted, textTransform: "uppercase" }}>
                  Total Visits
                </span>
                <span style={{ fontSize: 16, opacity: 0.8 }}>📋</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 10 }}>
                <span style={{ fontFamily: SERIF, fontSize: 38, color: C.wine, lineHeight: 1, fontStyle: "italic" }}>
                  {visits.length}
                </span>
                <span style={{ fontSize: 11.5, color: C.muted }}>across {patients.length} patients</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}><GoldRule /></div>

        {/* ── Search & Filter ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 36 }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: C.white,
              border: `1.5px solid ${C.border}`,
              borderRadius: 12,
              padding: "0 20px",
              boxShadow: "0 1px 6px rgba(36,33,36,0.04)",
            }}
          >
            <svg width="16" height="16" fill="none" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or patient ID…"
              style={{ flex: 1, fontSize: 14, border: "none", background: "transparent", color: C.charcoal, padding: "15px 0" }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, lineHeight: 1, cursor: "pointer" }}>
                ×
              </button>
            )}
          </div>

          <button
            onClick={onAddPatient}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 24px",
              borderRadius: 12,
              fontSize: 13.5,
              fontWeight: 700,
              background: C.wine,
              color: C.white,
              border: "none",
              boxShadow: `0 3px 14px rgba(122,21,40,0.24)`,
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1, fontWeight: 300 }}>+</span>
            New Patient
          </button>
        </div>

        {/* ── Patient List ── */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 18 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.charcoal, letterSpacing: "-0.02em", margin: 0 }}>Patients</h2>
            <span style={{ fontSize: 13, color: C.muted }}>{filtered.length} records</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 11.5, color: C.muted, fontStyle: "italic" }}>Click to open clinical profile</span>
          </div>

          <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(36,33,36,0.05)", overflow: "hidden" }}>
            {/* Table Header */}
            <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.4fr 1.6fr 1fr 36px", padding: "11px 24px", background: C.ivoryLight, borderBottom: `1px solid ${C.border}` }}>
              {["Patient", "Contact", "Condition", "Since", ""].map((h, i) => (
                <span key={i} style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.13em", color: C.muted, textTransform: "uppercase" }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Table Rows */}
            {filtered.map((p, ri) => {
              const hot = hovered === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => onOpenPatient(p.id)}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2.2fr 1.4fr 1.6fr 1fr 36px",
                    padding: "16px 24px",
                    borderBottom: ri < filtered.length - 1 ? `1px solid ${C.border}` : "none",
                    alignItems: "center",
                    cursor: "pointer",
                    background: hot ? C.white : "transparent",
                    boxShadow: hot ? "0 2px 16px rgba(36,33,36,0.07)" : "none",
                    transition: "all 0.14s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 11,
                        flexShrink: 0,
                        background: hot ? C.champagne : "#EEEAE5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: SERIF,
                        fontSize: 17,
                        color: hot ? C.wine : C.muted,
                        fontStyle: "italic",
                        transition: "all 0.14s ease",
                      }}
                    >
                      {p.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.charcoal, letterSpacing: "-0.01em" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: "0.04em", marginTop: 2 }}>{p.id}</div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 13, color: C.charcoal, fontWeight: 500 }}>{p.phone}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{p.email}</div>
                  </div>

                  <div>
                    {p.disease?.split(",").map((d) => (
                      <span
                        key={d}
                        style={{
                          display: "inline-block",
                          fontSize: 11,
                          color: C.muted,
                          border: `1px solid ${C.border}`,
                          padding: "2px 8px",
                          borderRadius: 5,
                          background: C.ivoryLight,
                          fontWeight: 500,
                          marginRight: 4,
                          marginBottom: 2,
                        }}
                      >
                        {d.trim()}
                      </span>
                    ))}
                  </div>

                  <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{p.createdOn}</div>

                  <div style={{ opacity: hot ? 1 : 0, transition: "opacity 0.14s", display: "flex", justifyContent: "center" }}>
                    <svg width="14" height="14" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ padding: "64px 24px", textAlign: "center" }}>
                <div style={{ fontFamily: SERIF, fontSize: 40, color: C.border, marginBottom: 12, fontStyle: "italic" }}>∅</div>
                <div style={{ fontSize: 14, color: C.muted }}>No patients match your search</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
