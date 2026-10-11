import Patient from '../models/Patient.js';
import MedicalHistory from '../models/MedicalHistory.js';
import Visit from '../models/Visit.js';
import MedicalFile from '../models/MedicalFile.js';

// @desc    Get all patients with high-speed search & filter
// @route   GET /api/patients
export async function getPatients(req, res, next) {
  try {
    const { search, status } = req.query;
    let query = {};

    if (status && status !== 'All' && status !== 'All Status') {
      query.status = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      const regex = new RegExp(q, 'i');
      query.$or = [
        { name: regex },
        { phone: regex },
        { patientId: regex },
        { disease: regex },
      ];
    }

    const patients = await Patient.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get dashboard statistics (Total patients, total visits, follow-ups)
// @route   GET /api/patients/stats
export async function getDashboardStats(req, res, next) {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalVisits = await Visit.countDocuments();
    const followUps = await Patient.countDocuments({ status: 'Follow-up' });

    res.json({
      success: true,
      stats: {
        totalPatients,
        totalVisits,
        followUps,
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get full patient clinical dossier by patientId
// @route   GET /api/patients/:patientId
export async function getPatientById(req, res, next) {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patientId} not found.`,
      });
    }

    const [history, visits, files] = await Promise.all([
      MedicalHistory.findOne({ patientId }),
      Visit.find({ patientId }).sort({ createdAt: -1 }),
      MedicalFile.find({ patientId }).sort({ createdAt: -1 }),
    ]);

    res.json({
      success: true,
      patient,
      history: history || null,
      visits: visits || [],
      files: files || [],
    });
  } catch (error) {
    next(error);
  }
}

export function isValidPhone(phone) {
  if (!phone) return false;
  const cleaned = String(phone).replace(/[\s\-()]/g, '');
  return /^(\+?[0-9]{10,15}|03[0-9]{9})$/.test(cleaned);
}

// @desc    Create new patient
// @route   POST /api/patients
export async function createPatient(req, res, next) {
  try {
    const {
      name,
      phone,
      email,
      age,
      gender,
      disease,
      address,
      status,
      // Optional initial medical history
      diseases,
      allergies,
      previousDescription,
      diagnosedDate,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Patient name and phone number are required.',
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number (e.g. 03001234567 or +923001234567).',
      });
    }

    // Generate auto-incremented patient ID
    const count = await Patient.countDocuments();
    const patientId = `P-${String(1001 + count)}`;

    const patient = await Patient.create({
      patientId,
      name,
      phone,
      email: email || '',
      age: age || '—',
      gender: gender || '—',
      disease: disease || '',
      address: address || '',
      status: status || 'Active',
      lastVisitDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });

    // Create medical history record if history data was provided
    let history = null;
    if (diseases || allergies || previousDescription || diagnosedDate) {
      history = await MedicalHistory.create({
        historyId: `MH-${String(Date.now()).slice(-4)}`,
        patientId,
        diseases: Array.isArray(diseases)
          ? diseases
          : (diseases || '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
        allergies: Array.isArray(allergies)
          ? allergies
          : (allergies || '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
        previousDescription: previousDescription || '',
        diagnosedDate: diagnosedDate || '',
      });
    }

    res.status(201).json({
      success: true,
      patient,
      history,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Update patient profile & medical history
// @route   PUT /api/patients/:patientId
export async function updatePatient(req, res, next) {
  try {
    const { patientId } = req.params;
    const {
      name,
      phone,
      email,
      age,
      gender,
      disease,
      address,
      status,
      diseases,
      allergies,
      previousDescription,
      diagnosedDate,
    } = req.body;

    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number (e.g. 03001234567 or +923001234567).',
      });
    }

    const patient = await Patient.findOneAndUpdate(
      { patientId },
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email !== undefined && { email }),
        ...(age && { age }),
        ...(gender && { gender }),
        ...(disease !== undefined && { disease }),
        ...(address !== undefined && { address }),
        ...(status && { status }),
      },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patientId} not found.`,
      });
    }

    // Update or upsert medical history
    let history = null;
    if (diseases !== undefined || allergies !== undefined || previousDescription !== undefined || diagnosedDate !== undefined) {
      const historyData = {
        ...(diseases && {
          diseases: Array.isArray(diseases)
            ? diseases
            : diseases.split(',').map((s) => s.trim()).filter(Boolean),
        }),
        ...(allergies && {
          allergies: Array.isArray(allergies)
            ? allergies
            : allergies.split(',').map((s) => s.trim()).filter(Boolean),
        }),
        ...(previousDescription !== undefined && { previousDescription }),
        ...(diagnosedDate !== undefined && { diagnosedDate }),
      };

      history = await MedicalHistory.findOneAndUpdate(
        { patientId },
        { ...historyData, patientId, historyId: `MH-${Date.now()}` },
        { new: true, upsert: true }
      );
    }

    res.json({
      success: true,
      patient,
      history,
    });
  } catch (error) {
    next(error);
  }
}
