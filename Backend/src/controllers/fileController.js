import MedicalFile from '../models/MedicalFile.js';
import Patient from '../models/Patient.js';
import { uploadToGridFS, streamFileFromGridFS, deleteFromGridFS } from '../services/gridfsService.js';

// @desc    Get all medical files for a patient
// @route   GET /api/files/patient/:patientId
export async function getPatientFiles(req, res, next) {
  try {
    const { patientId } = req.params;
    const files = await MedicalFile.find({ patientId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: files.length,
      files,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Upload binary file to MongoDB GridFS & record metadata
// @route   POST /api/files/upload
export async function uploadMedicalFile(req, res, next) {
  try {
    const { patientId, fileType, uploadedBy } = req.body;
    const uploadedFile = req.file;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required.',
      });
    }

    if (!uploadedFile) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please attach a file.',
      });
    }

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patientId} not found.`,
      });
    }

    // Sanitize filename
    const sanitizedName = uploadedFile.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueName = `${Date.now()}-${sanitizedName}`;

    // Upload to GridFS (MongoDB)
    const gridfsResult = await uploadToGridFS(
      uploadedFile.buffer,
      uniqueName,
      uploadedFile.mimetype
    );

    // Auto-generate file ID
    const fileCount = await MedicalFile.countDocuments();
    const fileId = `F-${String(fileCount + 1).padStart(3, '0')}`;

    const file = await MedicalFile.create({
      fileId,
      patientId,
      filename: sanitizedName,
      fileType: fileType || 'other',
      storageKey: gridfsResult.gridfsId,  // Store GridFS ObjectId here
      fileUrl: `/api/files/${fileId}/view`,
      uploadedBy: uploadedBy || (req.doctor ? req.doctor.name : 'Doctor'),
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });

    res.status(201).json({
      success: true,
      file,
      storage: 'mongodb-gridfs',
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Stream/view a file directly from GridFS
// @route   GET /api/files/:fileId/view
export async function viewFile(req, res, next) {
  try {
    const { fileId } = req.params;
    const file = await MedicalFile.findOne({ fileId });

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found.' });
    }

    await streamFileFromGridFS(file.storageKey, res);
  } catch (error) {
    if (!res.headersSent) {
      next(error);
    }
  }
}

// @desc    Get file view URL (for frontend compatibility)
// @route   GET /api/files/:fileId/presigned-url
export async function getPresignedUrl(req, res, next) {
  try {
    const { fileId } = req.params;
    const file = await MedicalFile.findOne({ fileId });

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found.' });
    }

    // Return direct view URL (no presigning needed with GridFS)
    res.json({
      success: true,
      viewUrl: `/api/files/${fileId}/view`,
      fileId: file.fileId,
      filename: file.filename,
      fileType: file.fileType,
      storage: 'mongodb-gridfs',
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Delete medical file from GridFS + DB record
// @route   DELETE /api/files/:fileId
export async function deleteMedicalFile(req, res, next) {
  try {
    const { fileId } = req.params;
    const file = await MedicalFile.findOne({ fileId });

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found.' });
    }

    // Delete from GridFS
    if (file.storageKey) {
      try {
        await deleteFromGridFS(file.storageKey);
      } catch (err) {
        console.warn('[GridFS] Could not delete file from GridFS:', err.message);
      }
    }

    // Delete DB record
    await MedicalFile.findOneAndDelete({ fileId });

    res.json({
      success: true,
      message: 'Medical file deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Record file metadata only (legacy support)
// @route   POST /api/files
export async function createFileRecord(req, res, next) {
  try {
    const { patientId, filename, fileType, storageKey, fileUrl, uploadedBy } = req.body;

    if (!patientId || !filename) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and filename are required.',
      });
    }

    const fileCount = await MedicalFile.countDocuments();
    const fileId = `F-${String(fileCount + 1).padStart(3, '0')}`;

    const file = await MedicalFile.create({
      fileId,
      patientId,
      filename,
      fileType: fileType || 'other',
      storageKey: storageKey || '',
      fileUrl: fileUrl || '',
      uploadedBy: uploadedBy || (req.doctor ? req.doctor.name : 'Doctor'),
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });

    res.status(201).json({ success: true, file });
  } catch (error) {
    next(error);
  }
}
