/* In-memory and local-persistent clean data store (starts empty for new doctors) */

function loadFromStorage(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// Collections initialized cleanly from localStorage (empty array by default)
export let patients = loadFromStorage("clinic_patients", []);
export let medicalHistories = loadFromStorage("clinic_histories", []);
export let visits = loadFromStorage("clinic_visits", []);
export let medicalFiles = loadFromStorage("clinic_files", []);

let _patientNum = patients.length > 0 ? 1001 + patients.length : 1001;
let _visitNum = visits.length + 1;
let _rxNum = 1;
let _histNum = medicalHistories.length + 1;

export function addPatient(data) {
  const p = {
    ...data,
    id: `P-${String(_patientNum++)}`,
    age: data.age || "—",
    gender: data.gender || "—",
    status: data.status || "Active",
    createdOn: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
  patients.unshift(p); // Put newest patient first
  saveToStorage("clinic_patients", patients);
  return p;
}

export function addMedicalHistory(data) {
  const mh = {
    ...data,
    id: `MH-${String(_histNum++).padStart(3, "0")}`,
    createdOn: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
  medicalHistories.push(mh);
  saveToStorage("clinic_histories", medicalHistories);
  return mh;
}

export function addVisit(patientId, data, rxRows) {
  const visitId = `V-${String(_visitNum++).padStart(3, "0")}`;
  const prescriptions = (rxRows || []).map((r) => ({
    ...r,
    id: `RX-${String(_rxNum++).padStart(3, "0")}`,
    visitId,
  }));
  const v = { id: visitId, patientId, ...data, prescriptions };
  visits.unshift(v);
  saveToStorage("clinic_visits", visits);
  return v;
}

export function addMedicalFile(patientId, fileData) {
  const f = {
    id: `F-${Date.now()}`,
    patientId,
    ...fileData,
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
  medicalFiles.unshift(f);
  saveToStorage("clinic_files", medicalFiles);
  return f;
}

export function getPatientVisits(patientId) {
  return visits.filter((v) => v.patientId === patientId);
}

export function getPatientHistory(patientId) {
  return medicalHistories.find((h) => h.patientId === patientId);
}

export function getPatientFiles(patientId) {
  return medicalFiles.filter((f) => f.patientId === patientId);
}

/** Clear all data for a completely blank restart */
export function clearClinicData() {
  patients = [];
  medicalHistories = [];
  visits = [];
  medicalFiles = [];
  localStorage.removeItem("clinic_patients");
  localStorage.removeItem("clinic_histories");
  localStorage.removeItem("clinic_visits");
  localStorage.removeItem("clinic_files");
}
