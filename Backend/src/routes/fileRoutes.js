import express from 'express';
import {
  getPatientFiles,
  createFileRecord,
  getPresignedUrl,
} from '../controllers/fileController.js';

const router = express.Router();

router.post('/', createFileRecord);
router.get('/patient/:patientId', getPatientFiles);
router.get('/:fileId/presigned-url', getPresignedUrl);

export default router;
