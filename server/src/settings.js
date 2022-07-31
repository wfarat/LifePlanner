import dotenv from 'dotenv';

dotenv.config();
export const connectionString = process.env.CONNECTION_STRING;
export const production = process.env.PRODUCTION;
