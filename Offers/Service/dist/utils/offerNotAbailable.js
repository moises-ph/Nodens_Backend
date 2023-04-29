"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNotAvailable = void 0;
const offers_model_1 = require("../models/offers.model");
const setNotAvailable = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield offers_model_1.Offer.findByIdAndUpdate(id, {
                $set: {
                    isAvailable: false
                }
            });
            return {
                code: 200
            };
        }
        catch (err) {
            return rej(err);
        }
    }));
});
exports.setNotAvailable = setNotAvailable;
