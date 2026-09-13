import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AddPatientPage from "./pages/AddPatientPage";
import PatientProfilePage from "./pages/PatientProfilePage";
import NewVisitPage from "./pages/NewVisitPage";

export default function App() {
  const [screen, setScreen] = useState("dashboard"); // default to dashboard for immediate clinical view
  const [patientId, setPatientId] = useState("P-1001");
  const [visitPatientId, setVisitPatientId] = useState("P-1001");

  function openPatient(id) {
    setPatientId(id);
    setScreen("patient-profile");
  }

  function openNewVisit(id) {
    setVisitPatientId(id);
    setScreen("new-visit");
  }

  return (
    <>
      {screen === "login" && (
        <LoginPage
          onSuccess={() => setScreen("dashboard")}
          onSignup={() => setScreen("signup")}
        />
      )}

      {screen === "signup" && (
        <SignupPage
          onSuccess={() => setScreen("dashboard")}
          onLogin={() => setScreen("login")}
        />
      )}

      {screen === "dashboard" && (
        <DashboardPage
          onOpenPatient={openPatient}
          onAddPatient={() => setScreen("add-patient")}
          onLogout={() => setScreen("login")}
        />
      )}

      {screen === "add-patient" && (
        <AddPatientPage
          onBack={() => setScreen("dashboard")}
          onSaved={(id) => openPatient(id)}
        />
      )}

      {screen === "patient-profile" && (
        <PatientProfilePage
          patientId={patientId}
          onBack={() => setScreen("dashboard")}
          onNewVisit={() => openNewVisit(patientId)}
          onLogout={() => setScreen("login")}
        />
      )}

      {screen === "new-visit" && (
        <NewVisitPage
          patientId={visitPatientId}
          onBack={() => openPatient(visitPatientId)}
          onSaved={() => openPatient(visitPatientId)}
        />
      )}
    </>
  );
}
