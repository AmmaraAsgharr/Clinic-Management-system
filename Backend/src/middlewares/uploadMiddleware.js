import multer from 'multer';

// Use memory storage so file is buffered in RAM and can be piped/uploaded directly to S3
const storage = multer.memoryStorage();

// File filter for clinical documents (PDF, JPG, PNG, WEBP, DICOM, etc.)
function fileFilter(req, file, cb) {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/dicom',
    'application/octet-stream',
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.originalname.match(/\.(pdf|jpe?g|png|webp|dcm)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Supported formats: PDF, JPG, PNG, WEBP, DICOM.'));
  }
}

// 25MB max limit per document
export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter,
});
