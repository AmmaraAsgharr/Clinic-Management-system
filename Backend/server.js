import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`Clinic Management Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=========================================`);
  });
}

startServer();
