import express from 'express';
import {
  getPatientFiles,
  uploadMedicalFile,
  viewFile,
  getPresignedUrl,
  deleteMedicalFile,
  createFileRecord,
} from '../controllers/fileController.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadMedicalFile);
router.post('/', createFileRecord);
router.get('/patient/:patientId', getPatientFiles);
router.get('/:fileId/view', viewFile);                    // Direct GridFS stream
router.get('/:fileId/presigned-url', getPresignedUrl);    // Returns view URL
router.delete('/:fileId', deleteMedicalFile);

export default router;
