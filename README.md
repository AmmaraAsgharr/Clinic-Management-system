# 🏥 Clinic Management System (Doc-App)

A full-stack web application designed for doctors and clinics to manage patient dossiers, medical histories, clinical visits, prescriptions, and medical file attachments (X-Rays, Lab Reports, ECGs) seamlessly.

---

## 🚀 Architecture & Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Modular CSS & Modern Responsive Components
- **HTTP Client:** Fetch API with JWT Bearer Token Injection
- **Port:** `3000` (Default Vite dev server with proxy to backend)

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Cloud Database)
- **File Storage:** MongoDB GridFS (Binary storage for images, PDFs, reports)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **File Uploads:** Multer (Memory storage)
- **Port:** `5000`

---

## 📁 Project Structure

```text
Doc-App/
├── Backend/
│   ├── src/
│   │   ├── config/          # MongoDB Atlas connection (db.js)
│   │   ├── controllers/     # Auth, Patient, Visit, File controllers
│   │   ├── middlewares/     # JWT Auth, Multer upload, Error handling
│   │   ├── models/          # Mongoose models (Doctor, Patient, Visit, MedicalFile, etc.)
│   │   ├── routes/          # Modular API route definitions
│   │   ├── services/        # GridFS bucket streaming & deletion services
│   │   └── app.js           # Express app setup & route mounting
│   ├── server.js            # Server entry point
│   ├── .env.example         # Environment template
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components & dialogs
│   │   ├── pages/           # Dashboard, PatientProfile, AddPatient, NewVisit, Auth pages
│   │   ├── services/        # Centralized API service layer
│   │   └── App.jsx          # Root component & routing
│   ├── vite.config.js       # Vite config with API proxy setup
│   └── package.json
│
└── README.md
```

---

## ✨ Features

- 🔐 **Doctor Authentication:** Secure sign-up, login, and session persistence via JWT.
- 📋 **Patient Management:** Create, view, update, and search patient profiles with demographics and medical history.
- 🩺 **Visit & Prescription Tracking:** Record visit notes, diagnoses, vital signs, and itemized prescriptions.
- 📂 **GridFS Medical File Storage:** Upload, preview, and download patient documents (lab reports, X-rays, ECGs) stored directly in MongoDB Atlas without external cloud dependencies.
- 📊 **Dashboard & Metrics:** Real-time patient count, visit statistics, and recent activity monitoring.

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB Atlas account (free M0 cluster)

---

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `Backend/` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   Backend will run on: `http://localhost:5000`

---

### 2. Frontend Setup

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   Frontend will run on: `http://localhost:3000`

---


- Output Directory: `dist`
