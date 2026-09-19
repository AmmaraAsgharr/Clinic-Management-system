import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';

export async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'clinic_secret_key_super_secure_2026'
    );
    const doctor = await Doctor.findById(decoded.id).select('-password');

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'The doctor belonging to this token no longer exists.',
      });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid or expired token.',
    });
  }
}
