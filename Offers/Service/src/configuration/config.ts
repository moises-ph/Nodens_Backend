import * as dotenv from "dotenv";

dotenv.config()

export const _SECRET = process.env.SECRET
export const _MONGODB_URI : string = process.env.MONGODB_URI || "mongodb://localhost:27017/Nodens_Offers"
export const _HOST : string = process.env.HOST || "0.0.0.0"
export const _PORT : string = process.env.PORT || "8000"