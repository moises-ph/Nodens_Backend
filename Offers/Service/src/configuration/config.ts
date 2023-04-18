import * as dotenv from "dotenv";

dotenv.config()

export const _SECRET = process.env.SECRET
export const _MONGODB_URI : string = process.env.MONGODB_URI || "mongodb://localhost:27017/Nodens_Offers"