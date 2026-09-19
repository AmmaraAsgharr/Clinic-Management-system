import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';

function signToken(id) {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'clinic_secret_key_super_secure_2026',
    { expiresIn: '30d' }
  );
}

// @desc    Register a doctor
// @route   POST /api/auth/register
export async function registerDoctor(req, res, next) {
  try {
    const { name, email, password, specialty } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    const existingDoctor = await Doctor.findOne({ email: email.toLowerCase() });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'A doctor with this email is already registered.',
      });
    }

    const doctor = await Doctor.create({
      name,
      email,
      password,
      specialty: specialty || 'General Physician',
    });

    const token = signToken(doctor._id);

    res.status(201).json({
      success: true,
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
        role: doctor.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Login doctor
// @route   POST /api/auth/login
export async function loginDoctor(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const doctor = await Doctor.findOne({ email: email.toLowerCase() });
    if (!doctor || !(await doctor.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = signToken(doctor._id);

    res.json({
      success: true,
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
        role: doctor.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get current doctor
// @route   GET /api/auth/me
export async function getMe(req, res) {
  res.json({
    success: true,
    doctor: req.doctor,
  });
}
