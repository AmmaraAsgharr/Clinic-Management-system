import Visit from '../models/Visit.js';
import Patient from '../models/Patient.js';

// @desc    Record new clinical visit with prescriptions
// @route   POST /api/visits
export async function createVisit(req, res, next) {
  try {
    const { patientId, visitDate, symptoms, diagnosis, doctorNotes, followUpDate, prescriptions } = req.body;

    if (!patientId || !visitDate) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and visit date are required.',
      });
    }

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patientId} not found.`,
      });
    }

    const visitCount = await Visit.countDocuments();
    const visitId = `V-${String(visitCount + 1).padStart(3, '0')}`;

    const combinedNotes = diagnosis
      ? `Diagnosis: ${diagnosis}\n\n${doctorNotes || ''}`.trim()
      : doctorNotes || '';

    const visit = await Visit.create({
      visitId,
      patientId,
      visitDate: visitDate || new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      symptoms: symptoms || '',
      doctorNotes: combinedNotes,
      followUpDate: followUpDate || '',
      prescriptions: Array.isArray(prescriptions) ? prescriptions : [],
    });

    // Update patient's last visit date and status if follow-up exists
    patient.lastVisitDate = visit.visitDate;
    if (followUpDate) {
      patient.status = 'Follow-up';
    }
    await patient.save();

    res.status(201).json({
      success: true,
      visit,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get all visits for a patient
// @route   GET /api/visits/patient/:patientId
export async function getPatientVisits(req, res, next) {
  try {
    const { patientId } = req.params;
    const visits = await Visit.find({ patientId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: visits.length,
      visits,
    });
  } catch (error) {
    next(error);
  }
}
