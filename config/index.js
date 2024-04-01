import dotenv from 'dotenv';
dotenv.config();

const config = {
  CONNECTION_STRING: process.env.CONNECTION_STRING,
  PORT: process.env.PORT || 3000,
};

export default config;
