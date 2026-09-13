/* In-memory data store with realistic initial data matching Figma designs */

export const patients = [
  {
    id: "P-1001",
    name: "Ahmed Khan",
    age: "45y",
    gender: "Male",
    phone: "0300-1234567",
    email: "ahmed.khan@example.com",
    disease: "Diabetes, Hypertension",
    address: "House 12, Street 4, F-7/2, Islamabad",
    createdOn: "10 Sep 2026",
    status: "Follow-up",
  },
  {
    id: "P-1002",
    name: "Sara Ali",
    age: "32y",
    gender: "Female",
    phone: "0321-9876543",
    email: "sara.ali@example.com",
    disease: "Asthma",
    address: "Apartment 4B, Gulberg III, Lahore",
    createdOn: "08 Sep 2026",
    status: "Active",
  },
];

export const medicalHistories = [
  {
    id: "MH-001",
    patientId: "P-1001",
    diseases: ["Diabetes", "Hypertension"],
    allergies: ["Penicillin", "Dust"],
    previousDescription: "Diagnosed with Type 2 Diabetes in 2020. Mild hypertension managed with medication. No previous surgeries.",
    diagnosedDate: "2020-05-14",
    createdOn: "10 Sep 2026",
  },
  {
    id: "MH-002",
    patientId: "P-1002",
    diseases: ["Asthma"],
    allergies: ["Pollen", "Aspirin"],
    previousDescription: "Childhood asthma. Regular inhaler user during seasonal changes.",
    diagnosedDate: "2015-11-20",
    createdOn: "08 Sep 2026",
  },
];

export const visits = [
  {
    id: "V-001",
    patientId: "P-1001",
    visitDate: "10 Sep 2026",
    symptoms: "Blood sugar fluctuations and mild morning headache.",
    doctorNotes: "Blood sugar elevated — HbA1c 8.2%. Hypertension stable.\nPatient advised low-carb diet. Schedule follow-up in 4 weeks.",
    followUpDate: "2026-10-08",
    prescriptions: [
      {
        id: "RX-001",
        visitId: "V-001",
        medicineName: "Metformin 500mg",
        frequency: "Twice daily",
        duration: "3 months",
        instructions: "Take with meals",
      },
      {
        id: "RX-002",
        visitId: "V-001",
        medicineName: "Amlodipine 5mg",
        frequency: "Once daily",
        duration: "1 month",
        instructions: "Take in the morning",
      },
    ],
  },
  {
    id: "V-002",
    patientId: "P-1001",
    visitDate: "05 Aug 2026",
    symptoms: "Routine checkup and blood pressure assessment.",
    doctorNotes: "Blood pressure 130/85. Advised light 30-min walking daily.",
    followUpDate: "2026-09-10",
    prescriptions: [
      {
        id: "RX-003",
        visitId: "V-002",
        medicineName: "Amlodipine 5mg",
        frequency: "Once daily",
        duration: "1 month",
        instructions: "Take in the morning",
      },
    ],
  },
  {
    id: "V-003",
    patientId: "P-1001",
    visitDate: "12 Jun 2026",
    symptoms: "Initial consultation for general fatigue.",
    doctorNotes: "Ordered comprehensive metabolic panel, HbA1c, and ECG.",
    followUpDate: "2026-08-05",
    prescriptions: [],
  },
];

export const medicalFiles = [
  {
    id: "F-001",
    patientId: "P-1001",
    filename: "Blood Test Report",
    storageKey: "uploads/P-1001/blood_test_report.pdf",
    fileType: "lab",
    date: "10 Sep 2026",
    uploadedBy: "Dr. Ahmed",
  },
  {
    id: "F-002",
    patientId: "P-1001",
    filename: "ECG Report",
    storageKey: "uploads/P-1001/ecg_report.pdf",
    fileType: "ecg",
    date: "05 Aug 2026",
    uploadedBy: "Dr. Ahmed",
  },
  {
    id: "F-003",
    patientId: "P-1001",
    filename: "Chest X-Ray",
    storageKey: "uploads/P-1001/chest_xray.png",
    fileType: "imaging",
    date: "12 Jun 2026",
    uploadedBy: "Dr. Ahmed",
  },
];

let _patientNum = 1003;
let _visitNum = 4;
let _rxNum = 4;
let _histNum = 3;

export function addPatient(data) {
  const p = {
    ...data,
    id: `P-${String(_patientNum++)}`,
    age: data.age || "—",
    gender: data.gender || "—",
    status: data.status || "Active",
    createdOn: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
  };
  patients.push(p);
  return p;
}

export function addMedicalHistory(data) {
  const mh = {
    ...data,
    id: `MH-${String(_histNum++).padStart(3, "0")}`,
    createdOn: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
  };
  medicalHistories.push(mh);
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
  visits.push(v);
  return v;
}

export function getPatientVisits(patientId) {
  return visits.filter((v) => v.patientId === patientId).reverse();
}

export function getPatientHistory(patientId) {
  return medicalHistories.find((h) => h.patientId === patientId);
}

export function getPatientFiles(patientId) {
  return medicalFiles.filter((f) => f.patientId === patientId);
}
