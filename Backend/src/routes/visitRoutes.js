import express from 'express';
import { createVisit, getPatientVisits } from '../controllers/visitController.js';

const router = express.Router();

router.post('/', createVisit);
router.get('/patient/:patientId', getPatientVisits);

export default router;
