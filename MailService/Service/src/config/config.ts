import { config } from "dotenv";
config();
export const EMAIL = process.env.EMAIL;
export const PASSWORD = process.env.PASSWORD;
export const HOST = process.env.HOST || "0.0.0.0"
export const PORT = process.env.PORT || "8000"
export const _FRONTEND_URL = process.env.FRONTEND_URL || "http://nodens.com"