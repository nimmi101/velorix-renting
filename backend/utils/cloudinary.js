import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const uploadToCloudinary = async (fileBuffer, mimetype, folder = 'velorix') => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured. Please set the Cloudinary environment variables.');
  }

  const base64 = fileBuffer.toString('base64');
  const dataUri = `data:${mimetype};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }]
  });

  return {
    url: result.secure_url,
    publicId: result.public_id
  };
};

export default cloudinary;
