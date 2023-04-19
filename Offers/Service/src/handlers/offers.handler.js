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
exports.postulateMusician = exports.getSingleOffer = exports.postOffer = exports.getAllOffers = void 0;
const offers_model_1 = require("../models/offers.model");
const offerNotAbailable_1 = require("../utils/offerNotAbailable");
const getAllOffers = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const Offers = yield offers_model_1.Offer.find();
    Offers.map((offer) => __awaiter(void 0, void 0, void 0, function* () {
        offer.Event_Date.getDate > Date.now ? null : yield (0, offerNotAbailable_1.setNotAvailable)(offer.id);
    }));
    return reply.code(200).send(Offers);
});
exports.getAllOffers = getAllOffers;
const postOffer = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newOffer = new offers_model_1.Offer(req.body);
        if (newOffer.Event_Date.getDate < Date.now)
            return reply.code(400).send({ message: "La fecha del evento debe ser mayor a la fecha actual" });
        if (newOffer.Creation_Date.getDate != Date.now)
            return reply.code(400).send({ message: "La fecha de creación de la oferta no coincide con la fecha actual" });
        yield newOffer.save();
        return reply.code(200).send({ message: "Oferta creada correctamente", id: newOffer.id });
    }
    catch (err) {
        return reply.code(500).send(err);
    }
});
exports.postOffer = postOffer;
const getSingleOffer = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const offer = yield offers_model_1.Offer.findById(req.params.id);
    return reply.code(200).send(offer);
});
exports.getSingleOffer = getSingleOffer;
const postulateMusician = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        console.log(req.params);
        yield offers_model_1.Offer.findByIdAndUpdate(req.params.id, {
            $push: {
                Applicants: req.body
            }
        });
        return reply.code(200).send({ message: `Musico ${req.body.ApplicantId} Postulado Correctamente` });
    }
    catch (err) {
        return reply.code(500).send(err);
    }
});
exports.postulateMusician = postulateMusician;
