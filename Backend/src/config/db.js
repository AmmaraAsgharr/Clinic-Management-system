import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic_management';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`Warning: Could not connect to MongoDB at ${uri}.`);
    console.warn(`Reason: ${error.message}`);
    console.warn(`The server will continue running in hybrid/mock fallback mode.`);
    return null;
  }
}
