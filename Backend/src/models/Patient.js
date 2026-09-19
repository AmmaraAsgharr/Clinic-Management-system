import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    age: {
      type: String,
      default: '—',
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', '—'],
      default: '—',
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    disease: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Follow-up', 'Discharged'],
      default: 'Active',
      index: true,
    },
    lastVisitDate: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for ultra-fast full-text searching by name and disease
patientSchema.index({ name: 'text', disease: 'text' });
// Compound index for regular regex lookups
patientSchema.index({ name: 1, phone: 1, status: 1 });

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
