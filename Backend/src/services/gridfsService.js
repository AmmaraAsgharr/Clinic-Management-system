import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';

/**
 * Get GridFSBucket instance
 */
function getBucket() {
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB not connected yet');
  return new GridFSBucket(db, { bucketName: 'medicalFiles' });
}

/**
 * Upload a file buffer to MongoDB GridFS
 * @returns {Promise<{gridfsId: string, filename: string}>}
 */
export async function uploadToGridFS(fileBuffer, filename, mimeType) {
  const bucket = getBucket();

  return new Promise((resolve, reject) => {
    const readableStream = Readable.from(fileBuffer);

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: mimeType || 'application/octet-stream',
      metadata: { uploadedAt: new Date() },
    });

    readableStream.pipe(uploadStream);

    uploadStream.on('finish', () => {
      resolve({
        gridfsId: uploadStream.id.toString(),
        filename,
      });
    });

    uploadStream.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Stream a file from GridFS to the response
 * @param {string} gridfsId - The GridFS file ObjectId string
 * @param {object} res - Express response object
 */
export async function streamFileFromGridFS(gridfsId, res) {
  const bucket = getBucket();
  const { ObjectId } = mongoose.Types;

  let objectId;
  try {
    objectId = new ObjectId(gridfsId);
  } catch {
    throw new Error('Invalid file ID format');
  }

  // Get file info first (for content-type)
  const files = await bucket.find({ _id: objectId }).toArray();
  if (!files || files.length === 0) {
    throw new Error('File not found in storage');
  }

  const fileInfo = files[0];
  res.set('Content-Type', fileInfo.contentType || 'application/octet-stream');
  res.set('Content-Disposition', `inline; filename="${fileInfo.filename}"`);

  const downloadStream = bucket.openDownloadStream(objectId);
  downloadStream.pipe(res);

  downloadStream.on('error', () => {
    res.status(404).json({ success: false, message: 'File stream error' });
  });
}

/**
 * Delete a file from GridFS by its ObjectId string
 */
export async function deleteFromGridFS(gridfsId) {
  const bucket = getBucket();
  const { ObjectId } = mongoose.Types;

  let objectId;
  try {
    objectId = new ObjectId(gridfsId);
  } catch {
    throw new Error('Invalid file ID format');
  }

  await bucket.delete(objectId);
  return { success: true };
}
