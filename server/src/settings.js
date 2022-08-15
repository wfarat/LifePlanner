import dotenv from 'dotenv';

dotenv.config();
export const connectionString = process.env.CONNECTION_STRING;
export const production = process.env.PRODUCTION;
export const jwtSecret = process.env.JWT_SECRET;
export const googleClientID = process.env.GOOGLE_CLIENT_ID;
export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
export const adminEmail = process.env.ADMIN_EMAIL;