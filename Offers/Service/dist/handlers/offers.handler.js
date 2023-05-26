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
exports.changePostulationStatus = exports.disableOffer = exports.deleteOffer = exports.postulateMusician = exports.postOffer = exports.getOffersByTag = exports.getAllOffers = exports.getSingleOffer = exports.getOfferByOrganizer = exports.getPostulatedOffersMusician = void 0;
const offers_model_1 = require("../models/offers.model");
const offerNotAbailable_1 = require("../utils/offerNotAbailable");
const authService_1 = require("../utils/authService");
const mailService_1 = require("../utils/mailService");
const getPayload_1 = require("../helpers/getPayload");
const getPostulatedOffersMusician = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const Offers = yield offers_model_1.Offer.find({
        "Applicants.ApplicantId": req.params.Id
    }, { Applicants: 0 });
    return reply.code(200).send(Offers);
});
exports.getPostulatedOffersMusician = getPostulatedOffersMusician;
const getOfferByOrganizer = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const Offers = yield offers_model_1.Offer.find({
        OrganizerId: req.params.Id
    });
    return reply.code(200).send(Offers);
});
exports.getOfferByOrganizer = getOfferByOrganizer;
// No token
const getSingleOffer = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    let payload;
    if (req.headers.authorization)
        payload = yield (0, getPayload_1.getJWTPayload)(req.headers.authorization.replace("Bearer ", ""));
    console.log(payload && payload.Role === 'Organizer' ? 1 : 0);
    const offer = yield offers_model_1.Offer.findById(req.params.id, payload && payload.Role === 'Organizer' ? {} : { Applicants: 0 });
    return reply.code(200).send(offer);
});
exports.getSingleOffer = getSingleOffer;
// No token
const getAllOffers = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const Offers = yield offers_model_1.Offer.find({}, { Applicants: 0 });
    Offers.map((offer) => __awaiter(void 0, void 0, void 0, function* () {
        offer.Event_Date.getDate > Date.now ? null : yield (0, offerNotAbailable_1.setNotAvailable)(offer.id);
    }));
    return reply.code(200).send(Offers);
});
exports.getAllOffers = getAllOffers;
// No token
const getOffersByTag = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = req.body.Tags;
        const tagsFounded = yield offers_model_1.Offer.find({
            tags: {
                $in: tags
            }
        }, { Applicants: 0 });
        return reply.code(200).send(tagsFounded);
    }
    catch (err) {
        return reply.code(500).send(err);
    }
});
exports.getOffersByTag = getOffersByTag;
const postOffer = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newOffer = new offers_model_1.Offer(req.body);
        newOffer.Creation_Date = new Date();
        if (newOffer.Event_Date < newOffer.Creation_Date)
            return reply.code(400).send({ message: "La fecha del evento debe ser mayor a la fecha actual" });
        yield newOffer.save();
        return reply.code(200).send({ message: "Oferta creada correctamente", id: newOffer.id });
    }
    catch (err) {
        return reply.code(500).send(err);
    }
});
exports.postOffer = postOffer;
const postulateMusician = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.PostulationStatus = "aplied";
        const actualOffer = yield offers_model_1.Offer.findById(req.params.id);
        if (!actualOffer)
            throw new Error("The offer doesn't exists");
        const emailOrganizer = yield (0, authService_1.fetchOrganizer)(actualOffer === null || actualOffer === void 0 ? void 0 : actualOffer.OrganizerId.toString());
        if (emailOrganizer)
            new Error("El organizador no existe");
        const payload = yield (0, getPayload_1.getJWTPayload)(req.headers.authorization.replace("Bearer ", ""));
        const applicantData = {
            ReceiverEmail: payload.Email,
            ReceiverName: req.body.PostulationFullName,
            OfferID: payload.Id,
            OfferTitle: actualOffer.Title,
            OrganizerName: emailOrganizer.userName,
            OrganizerId: actualOffer.OrganizerId.toString()
        };
        const organizerData = {
            ReceiverEmail: emailOrganizer.email,
            ApplicantName: req.body.PostulationFullName,
            ApplicantId: payload.Id,
            ApplicantEmail: payload.Email,
            OfferID: payload.Id,
            OfferTitle: actualOffer.Title
        };
        const postulatedEmailresult = yield (0, mailService_1.sendPostulated)(applicantData);
        const organizerEmailResult = yield (0, mailService_1.sendOrganizer)(organizerData);
        if (postulatedEmailresult.hasOwnProperty("statusCode") && postulatedEmailresult.statusCode != 200)
            new Error(postulatedEmailresult.message);
        if (organizerEmailResult.hasOwnProperty("statusCode") && organizerEmailResult.statusCode != 200)
            new Error(organizerEmailResult.message);
        yield actualOffer.updateOne({
            $push: {
                Applicants: req.body
            }
        });
        return reply.code(200).send({ message: `Musico ${req.body.ApplicantId} Postulado Correctamente`, emailOrganizer });
    }
    catch (err) {
        return reply.code(500).send(err);
    }
});
exports.postulateMusician = postulateMusician;
const deleteOffer = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offer = yield offers_model_1.Offer.findById(req.params.id);
        const payload = yield (0, getPayload_1.getJWTPayload)(req.headers.authorization.replace("Bearer ", ""));
        if ((offer === null || offer === void 0 ? void 0 : offer.OrganizerId) != payload.Id)
            throw new Error("Esta oferta no es tuya");
        yield offers_model_1.Offer.findByIdAndDelete(req.params.id);
        return reply.code(200).send({ message: "Oferta eliminada correctamente" });
    }
    catch (err) {
        return reply.code(500).send(err);
    }
});
exports.deleteOffer = deleteOffer;
const disableOffer = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, offerNotAbailable_1.setNotAvailable)(req.params.id);
        return reply.code(200).send({ message: "Oferta deshabilidata exitosamente" });
    }
    catch (err) {
        return reply.code(500).send(err);
    }
});
exports.disableOffer = disableOffer;
const changePostulationStatus = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield offers_model_1.Offer.findByIdAndUpdate(req.body.OfferId, {
            $set: {
                "Applicants.$[element].PostulationStatus": req.body.Action
            }
        }, {
            arrayFilters: [{
                    "element.ApplicantId": req.body.ApplicantId
                }]
        });
        return reply.code(200).send({ message: "Estado de postulación cambiado correctamente" });
    }
    catch (err) {
        return reply.code(500).send(err);
    }
});
exports.changePostulationStatus = changePostulationStatus;
