"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../configuration/config");
// mongodb://Nodens:secret@localhost:27018/Nodens_Offers
mongoose_1.default
    .connect(config_1._MONGODB_URI)
    .then(() => console.log("DB Connected"))
    .catch(err => {
    console.error(err);
    process.exit(1);
});
