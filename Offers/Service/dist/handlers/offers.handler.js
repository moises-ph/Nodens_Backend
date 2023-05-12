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
const config_1 = require("../configuration/config");
const getPostulatedOffersMusician = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const Offers = yield offers_model_1.Offer.find({
        "Applicants.ApplicantId": req.params.Id
    });
    return reply.code(200).send(Offers);
});
exports.getPostulatedOffersMusician = getPostulatedOffersMusician;
const getOfferByOrganizer = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const Offers = yield offers_model_1.Offer.find({
        OrganizerId: req.params.Id
    }, { Applicants: 0 });
    return reply.code(200).send(Offers);
});
exports.getOfferByOrganizer = getOfferByOrganizer;
// No token
const getSingleOffer = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const offer = yield offers_model_1.Offer.findById(req.params.id, {
        Applicants: 0
    });
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
        const idOrganizer = yield offers_model_1.Offer.findById(req.params.id, {
            OrganizerId: 1
        });
        if (!idOrganizer)
            throw new Error("The organizer doesn't exists");
        const emailOrganizer = yield fetch(`${config_1._URL_AUTH}/api/user/${idOrganizer === null || idOrganizer === void 0 ? void 0 : idOrganizer.OrganizerId}`)
            .then(res => res.json())
            .then((data) => {
            return data;
        })
            .catch(err => { throw new Error(err); });
        console.log(emailOrganizer);
        const updatedOffer = yield offers_model_1.Offer.findByIdAndUpdate(req.params.id, {
            $push: {
                Applicants: req.body
            }
        });
        if (!updatedOffer)
            throw new Error("Oferta no existe");
        const body = {
            ReceiverEmail: emailOrganizer.email,
            ReceiverName: req.body.PostulationFullName,
            OfferID: req.params.id,
            OfferTitle: updatedOffer === null || updatedOffer === void 0 ? void 0 : updatedOffer.Title,
            OrganizerName: emailOrganizer.userName,
            OrganizerId: idOrganizer.OrganizerId,
            EntrepriseName: null
        };
        console.log(body);
        console.log(config_1._URL_MAILER);
        fetch(`${config_1._URL_MAILER}/mailer`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
            console.log(data);
        })
            .catch(err => new Error(err));
        return reply.code(200).send({ message: `Musico ${req.body.ApplicantId} Postulado Correctamente`, emailOrganizer });
    }
    catch (err) {
        return reply.code(500).send(err);
    }
});
exports.postulateMusician = postulateMusician;
const deleteOffer = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
