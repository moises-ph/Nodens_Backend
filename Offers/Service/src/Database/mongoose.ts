import mongoose from "mongoose";

mongoose
    .connect('mongodb://Nodens:secret@localhost:27018/Nodens_Offers')
    .then(()=> console.log("DB Connected"))
    .catch(err => console.error(err));