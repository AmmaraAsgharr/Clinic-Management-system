import mongoose from 'mongoose';

const prescriptionItemSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: true,
    trim: true,
  },
  frequency: {
    type: String,
    default: 'Once daily',
    trim: true,
  },
  duration: {
    type: String,
    default: '1 month',
    trim: true,
  },
  instructions: {
    type: String,
    default: '',
    trim: true,
  },
});

const visitSchema = new mongoose.Schema(
  {
    visitId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    patientId: {
      type: String,
      ref: 'Patient',
      required: true,
      index: true,
      trim: true,
    },
    visitDate: {
      type: String,
      required: true,
      index: true,
    },
    symptoms: {
      type: String,
      default: '',
      trim: true,
    },
    doctorNotes: {
      type: String,
      default: '',
      trim: true,
    },
    followUpDate: {
      type: String,
      default: '',
    },
    prescriptions: [prescriptionItemSchema],
  },
  {
    timestamps: true,
  }
);

const Visit = mongoose.model('Visit', visitSchema);
export default Visit;
