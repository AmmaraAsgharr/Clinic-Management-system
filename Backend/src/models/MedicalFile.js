import mongoose from 'mongoose';

const medicalFileSchema = new mongoose.Schema(
  {
    fileId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    patientId: {
      type: String,
      ref: 'Patient',
      required: true,
      index: true,
      trim: true,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    storageKey: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      enum: ['lab', 'ecg', 'imaging', 'other'],
      default: 'other',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    uploadedBy: {
      type: String,
      default: 'Dr. Ahmed',
    },
    date: {
      type: String,
      default: () =>
        new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
  },
  {
    timestamps: true,
  }
);

const MedicalFile = mongoose.model('MedicalFile', medicalFileSchema);
export default MedicalFile;
