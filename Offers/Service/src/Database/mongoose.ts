import mongoose from "mongoose";
import { _MONGODB_URI } from "../configuration/config";

// mongodb://Nodens:secret@localhost:27018/Nodens_Offers

mongoose
    .connect(_MONGODB_URI)
    .then(()=> {console.log("DB Connected")})
    .catch(err => {
        console.log(_MONGODB_URI);
        console.error(err); 
        process.exit(1)
    });