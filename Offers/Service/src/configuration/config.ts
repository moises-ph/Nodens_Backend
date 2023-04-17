import * as dotenv from "dotenv";

dotenv.config()

export const _SECRET = process.env.SECRET
export const _MONGODB_URI = process.env.MONGODB_URI