import { useState, useEffect } from "react";
import { authService } from "./services/api";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AddPatientPage from "./pages/AddPatientPage";
import PatientProfilePage from "./pages/PatientProfilePage";
import NewVisitPage from "./pages/NewVisitPage";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [doctor, setDoctor] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [visitPatientId, setVisitPatientId] = useState("");

  useEffect(() => {
    const savedDoc = localStorage.getItem("clinic_doctor");
    const token = localStorage.getItem("clinic_token");
    if (savedDoc && token) {
      try {
        const parsed = JSON.parse(savedDoc);
        setDoctor(parsed);
        setScreen("dashboard");
      } catch (_) {}
    }
  }, []);

  function handleLoginSuccess(doc) {
    setDoctor(doc);
    setScreen("dashboard");
  }

  function handleLogout() {
    authService.logout();
    setDoctor(null);
    setScreen("login");
  }

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
          onSuccess={handleLoginSuccess}
          onSignup={() => setScreen("signup")}
        />
      )}

      {screen === "signup" && (
        <SignupPage
          onSuccess={handleLoginSuccess}
          onLogin={() => setScreen("login")}
        />
      )}

      {screen === "dashboard" && (
        <DashboardPage
          doctor={doctor}
          onOpenPatient={openPatient}
          onAddPatient={() => setScreen("add-patient")}
          onLogout={handleLogout}
        />
      )}

      {screen === "add-patient" && (
        <AddPatientPage
          doctor={doctor}
          onBack={() => setScreen("dashboard")}
          onSaved={(id) => openPatient(id)}
        />
      )}

      {screen === "patient-profile" && (
        <PatientProfilePage
          doctor={doctor}
          patientId={patientId}
          onBack={() => setScreen("dashboard")}
          onNewVisit={() => openNewVisit(patientId)}
          onLogout={handleLogout}
        />
      )}

      {screen === "new-visit" && (
        <NewVisitPage
          doctor={doctor}
          patientId={visitPatientId}
          onBack={() => openPatient(visitPatientId)}
          onSaved={() => openPatient(visitPatientId)}
        />
      )}
    </>
  );
}
