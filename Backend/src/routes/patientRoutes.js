import express from 'express';
import {
  getPatients,
  getDashboardStats,
  getPatientById,
  createPatient,
  updatePatient,
} from '../controllers/patientController.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/', getPatients);
router.post('/', createPatient);
router.get('/:patientId', getPatientById);
router.put('/:patientId', updatePatient);

export default router;
