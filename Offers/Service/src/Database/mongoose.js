"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default
    .connect('mongodb://Nodens:secret@localhost:27018/Nodens_Offers')
    .then(() => console.log("DB Connected"))
    .catch(err => console.error(err));
