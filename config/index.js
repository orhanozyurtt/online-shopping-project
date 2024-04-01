import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const config = {
  CONNECTION_STRING: process.env.CONNECTION_STRING,
  PORT: process.env.PORT || 3000,
};

const cloudinaryConfigOptions = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
};

cloudinary.config(cloudinaryConfigOptions); // Burada cloudinary.config() fonksiyonunu kullanın

export { config, cloudinary };
