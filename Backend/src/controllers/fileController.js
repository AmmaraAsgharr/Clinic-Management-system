import MedicalFile from '../models/MedicalFile.js';

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

// @desc    Record uploaded medical file metadata
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
      storageKey: storageKey || `uploads/${patientId}/${filename}`,
      fileUrl: fileUrl || '',
      uploadedBy: uploadedBy || 'Dr. Ahmed',
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });

    res.status(201).json({
      success: true,
      file,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Generate pre-signed S3 download/view URL (or local URL fallback)
// @route   GET /api/files/:fileId/presigned-url
export async function getPresignedUrl(req, res, next) {
  try {
    const { fileId } = req.params;
    const file = await MedicalFile.findOne({ fileId });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found.',
      });
    }

    // In local mode / pending S3 credentials, return file storage key / URL fallback
    const viewUrl = file.fileUrl || `/uploads/${file.storageKey}`;

    res.json({
      success: true,
      viewUrl,
      fileId: file.fileId,
      filename: file.filename,
      expiresIn: 3600, // 1 hour
    });
  } catch (error) {
    next(error);
  }
}
