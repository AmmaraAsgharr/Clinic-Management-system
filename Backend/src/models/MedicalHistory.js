import mongoose from 'mongoose';

const medicalHistorySchema = new mongoose.Schema(
  {
    historyId: {
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
    diseases: {
      type: [String],
      default: [],
    },
    allergies: {
      type: [String],
      default: [],
    },
    previousDescription: {
      type: String,
      default: '',
      trim: true,
    },
    diagnosedDate: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const MedicalHistory = mongoose.model('MedicalHistory', medicalHistorySchema);
export default MedicalHistory;
