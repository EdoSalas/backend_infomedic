import dotenv from 'dotenv';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  PG_URI: process.env.POSTGRESQL_URI,
  BACKEND_PORT: process.env.BACKEND_PORT
}