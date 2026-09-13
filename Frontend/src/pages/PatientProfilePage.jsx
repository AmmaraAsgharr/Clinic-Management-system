import { useState } from "react";
import {
  patients,
  getPatientHistory,
  getPatientVisits,
  getPatientFiles,
} from "../data/store";
import AppHeader from "../components/common/AppHeader";
import VisitRow from "../components/patient-detail/VisitRow";
import UploadDialog from "../components/patient-detail/UploadDialog";
import ViewFileDialog from "../components/patient-detail/ViewFileDialog";
import EditProfileDialog from "../components/patient-detail/EditProfileDialog";

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
};
const SERIF = "'Fraunces', Georgia, serif";

function SectionLabel({ children, accent = C.gold }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18 }}>
      <div style={{ width: 3, height: 15, background: accent, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontSize: 9.5, letterSpacing: "0.18em", fontWeight: 800, color: C.muted, textTransform: "uppercase" }}>
        {children}
      </span>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: C.white,
        borderRadius: 14,
        border: `1px solid ${C.border}`,
        boxShadow: "0 1px 8px rgba(36,33,36,0.05)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const FileIcons = {
  lab: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-4M9 3v18M9 3h6M9 21h6M13 9h2M13 13h2" />
    </svg>
  ),
  ecg: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  imaging: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
  other: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
};

export default function PatientProfilePage({ patientId, onBack, onNewVisit, onLogout }) {
  const patient = patients.find((p) => p.id === patientId);
  const history = getPatientHistory(patientId);
  const visits = getPatientVisits(patientId);

  const [expanded, setExpanded] = useState(0);
  const [fileHover, setFileHover] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [viewFile, setViewFile] = useState(null);
  const [, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);
  const liveFiles = getPatientFiles(patientId);

  if (!patient) {
    return (
      <div style={{ padding: 40, fontFamily: "'Plus Jakarta Sans',sans-serif", color: C.muted }}>
        Patient not found.{" "}
        <button onClick={onBack} style={{ color: C.wine, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.ivory, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      {showUpload && (
        <UploadDialog
          patientId={patientId}
          onClose={() => setShowUpload(false)}
          onUploaded={triggerRefresh}
        />
      )}
      {showEdit && (
        <EditProfileDialog
          patientId={patientId}
          patient={patient}
          onClose={() => setShowEdit(false)}
          onUpdated={triggerRefresh}
        />
      )}
      {viewFile && <ViewFileDialog file={viewFile} onClose={() => setViewFile(null)} />}

      <AppHeader onLogout={onLogout} />

      {/* Dossier Header */}
      <div style={{ background: C.wine, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: -70, right: -70, width: 280, height: 280, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)" }} />
          <div style={{ position: "absolute", bottom: -50, right: 100, width: 180, height: 180, borderRadius: "50%", background: "rgba(183,154,99,0.08)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: "linear-gradient(90deg,transparent,rgba(183,154,99,0.5) 30%,rgba(183,154,99,0.5) 70%,transparent)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(183,154,99,0.2) 50%,transparent)" }} />
        </div>

        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 44px", position: "relative" }}>
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
              Patients
            </button>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
              Clinical Profile
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "32px 0 36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  flexShrink: 0,
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontFamily: SERIF, fontSize: 30, color: C.white, fontStyle: "italic", lineHeight: 1 }}>
                  {patient.name[0]}
                </span>
              </div>
              <div>
                <h1 style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 400, color: C.white, fontStyle: "italic", letterSpacing: "-0.025em", lineHeight: 1.05, margin: 0 }}>
                  {patient.name}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{patient.phone}</span>
                  <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Dr. Ahmed · General Physician</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setShowEdit(true)}
                style={{
                  padding: "9px 18px",
                  borderRadius: 9,
                  fontSize: 12.5,
                  fontWeight: 700,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.65)",
                  cursor: "pointer",
                }}
              >
                Edit Profile
              </button>
              <button
                onClick={onNewVisit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 20px",
                  borderRadius: 9,
                  fontSize: 12.5,
                  fontWeight: 800,
                  background: C.gold,
                  border: "none",
                  color: C.wineDark,
                  boxShadow: `0 3px 12px rgba(183,154,99,0.35)`,
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                }}
              >
                <span style={{ fontSize: 17, lineHeight: 1, fontWeight: 300 }}>+</span>
                New Visit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: 2.5, background: `linear-gradient(90deg,${C.wine},${C.gold},rgba(183,154,99,0.08))` }} />

      {/* Main Content */}
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "44px 44px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 352px", gap: 28, alignItems: "start" }}>
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Personal Information */}
            <Card>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)" }}>
                {[
                  { label: "Name", value: patient.name },
                  { label: "Phone", value: patient.phone },
                  { label: "Email", value: patient.email || "—" },
                  { label: "Address", value: patient.address || "—" },
                  { label: "Since", value: patient.createdOn },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "20px 22px", borderRight: i < 4 ? `1px solid ${C.border}` : "none", position: "relative" }}>
                    {i === 0 && (
                      <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: `linear-gradient(to bottom,${C.gold},transparent)` }} />
                    )}
                    <div style={{ fontSize: 9, letterSpacing: "0.14em", fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: C.charcoal, letterSpacing: "-0.01em", wordBreak: "break-word" }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Visit History Timeline */}
            <Card>
              <div style={{ padding: "18px 26px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <SectionLabel accent={C.wine}>Visit History</SectionLabel>
                <span style={{ fontSize: 11.5, color: C.muted, marginBottom: 18 }}>
                  {visits.length} visit{visits.length !== 1 ? "s" : ""} on record
                </span>
              </div>
              <div style={{ padding: "28px 26px" }}>
                {visits.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <div style={{ fontFamily: SERIF, fontSize: 36, color: C.border, marginBottom: 10, fontStyle: "italic" }}>—</div>
                    <div style={{ fontSize: 13.5, color: C.muted }}>No visits recorded yet.</div>
                    <button
                      onClick={onNewVisit}
                      style={{ marginTop: 16, padding: "9px 20px", borderRadius: 9, fontSize: 13, fontWeight: 700, background: C.wine, color: C.white, border: "none", cursor: "pointer" }}
                    >
                      + Add first visit
                    </button>
                  </div>
                ) : (
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 12, top: 12, bottom: 12, width: 1.5, background: `linear-gradient(to bottom,${C.wine},${C.gold} 55%,transparent)`, pointerEvents: "none" }} />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {visits.map((v, i) => (
                        <VisitRow
                          key={v.id}
                          visit={v}
                          index={i}
                          isOpen={expanded === i}
                          onToggle={() => setExpanded(expanded === i ? -1 : i)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 84 }}>
            {/* Medical History */}
            <Card>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
                <SectionLabel>Medical History</SectionLabel>
              </div>
              <div style={{ padding: "18px 20px" }}>
                {history ? (
                  <>
                    {history.diseases?.length > 0 && (
                      <>
                        <p style={{ fontSize: 9, letterSpacing: "0.14em", fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 10 }}>Conditions</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 18 }}>
                          {history.diseases.map((d) => (
                            <div key={d} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 13px", borderRadius: 9, border: `1px solid ${C.border}`, background: C.ivoryLight }}>
                              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.wine, flexShrink: 0 }} />
                              <span style={{ fontSize: 13.5, fontWeight: 600, color: C.charcoal }}>{d}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {history.allergies?.length > 0 && (
                      <>
                        <div style={{ height: 1, background: `linear-gradient(90deg,${C.gold},transparent)`, opacity: 0.35, marginBottom: 16 }} />
                        <p style={{ fontSize: 9, letterSpacing: "0.14em", fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 10 }}>Allergies</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
                          {history.allergies.map((a) => (
                            <span key={a} style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12.5, fontWeight: 700, border: "1px solid rgba(220,38,38,0.22)", color: "#991B1B", background: "rgba(220,38,38,0.05)" }}>
                              {a}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                    {history.previousDescription && (
                      <>
                        <div style={{ height: 1, background: `linear-gradient(90deg,${C.gold},transparent)`, opacity: 0.35, marginBottom: 16 }} />
                        <p style={{ fontSize: 9, letterSpacing: "0.14em", fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 10 }}>Previous History</p>
                        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>{history.previousDescription}</p>
                      </>
                    )}
                  </>
                ) : (
                  <p style={{ fontSize: 13, color: C.muted, textAlign: "center", padding: "20px 0" }}>No medical history recorded.</p>
                )}
              </div>
            </Card>

            {/* Medical Files */}
            <Card>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 3, height: 15, background: C.wine, borderRadius: 2 }} />
                  <span style={{ fontSize: 9.5, letterSpacing: "0.18em", fontWeight: 800, color: C.muted, textTransform: "uppercase" }}>Medical Files</span>
                </div>
                <button
                  onClick={() => setShowUpload(true)}
                  style={{ padding: "5px 12px", borderRadius: 7, fontSize: 11, fontWeight: 700, border: `1px solid rgba(122,21,40,0.2)`, background: "rgba(122,21,40,0.06)", color: C.wine, cursor: "pointer" }}
                >
                  + Upload
                </button>
              </div>
              <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 3 }}>
                {liveFiles.length === 0 ? (
                  <p style={{ fontSize: 13, color: C.muted, padding: "20px 6px" }}>No files uploaded yet.</p>
                ) : (
                  liveFiles.map((f, i) => {
                    const hot = fileHover === i;
                    return (
                      <div
                        key={i}
                        onMouseEnter={() => setFileHover(i)}
                        onMouseLeave={() => setFileHover(null)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "11px 10px",
                          borderRadius: 10,
                          border: `1px solid ${hot ? C.border : "transparent"}`,
                          background: hot ? C.ivoryLight : "transparent",
                          transition: "all 0.14s ease",
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 9,
                            flexShrink: 0,
                            background: hot ? C.champagne : "#EEEAE5",
                            color: hot ? C.wine : C.muted,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.14s ease",
                          }}
                        >
                          {FileIcons[f.fileType] ?? FileIcons.other}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.charcoal, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {f.filename}
                          </div>
                          <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{f.date}</div>
                        </div>
                        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                          <button
                            onClick={() => setViewFile(f)}
                            style={{
                              padding: "5px 11px",
                              borderRadius: 7,
                              fontSize: 11.5,
                              fontWeight: 700,
                              border: `1px solid ${C.border}`,
                              background: hot ? C.wine : C.white,
                              color: hot ? C.white : C.muted,
                              cursor: "pointer",
                              transition: "all 0.14s ease",
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => alert(`Downloading ${f.filename}...`)}
                            style={{
                              width: 30,
                              height: 28,
                              borderRadius: 7,
                              border: `1px solid ${C.border}`,
                              background: C.white,
                              color: C.muted,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
