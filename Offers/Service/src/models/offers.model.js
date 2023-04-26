"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Offer = void 0;
const mongoose_1 = require("mongoose");
const RequerimentsSchema = new mongoose_1.Schema({
    Description: { type: mongoose_1.Schema.Types.String, required: true }
}, {
    _id: false,
    versionKey: false
});
const ApplicantSchema = new mongoose_1.Schema({
    PostulationDate: { type: mongoose_1.Schema.Types.Date, required: true },
    ApplicantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    PostulationFullName: { type: mongoose_1.Schema.Types.String, required: true },
    PostulationStatus: { type: mongoose_1.Schema.Types.String, required: true }
}, {
    _id: false,
    versionKey: false
});
const SchemaEventUbication = new mongoose_1.Schema({
    City: { type: mongoose_1.Schema.Types.String, required: true },
    Street: { type: mongoose_1.Schema.Types.String, required: false },
    Career: { type: mongoose_1.Schema.Types.String, required: false },
    SiteNumber: { type: mongoose_1.Schema.Types.String, required: true },
    Town: { type: mongoose_1.Schema.Types.String, required: true },
}, {
    _id: false,
    versionKey: false
});
const OfferSchema = new mongoose_1.Schema({
    Title: { type: mongoose_1.Schema.Types.String, required: true },
    Description: { type: mongoose_1.Schema.Types.String, required: true },
    Creation_Date: { type: mongoose_1.Schema.Types.Date, required: true },
    Event_Date: { type: mongoose_1.Schema.Types.Date, required: true },
    Payment: { type: mongoose_1.Schema.Types.Number, required: true },
    OrganizerId: { type: mongoose_1.Schema.Types.Number, required: true },
    Event_Ubication: { type: SchemaEventUbication, required: true },
    Applicants: { type: [], required: false, default: [] },
    Img: { type: mongoose_1.Schema.Types.String, required: false },
    Requeriments: { type: [RequerimentsSchema], required: true },
    Vacants: { type: mongoose_1.Schema.Types.Number, required: true },
    isAvailable: { type: mongoose_1.Schema.Types.Boolean, required: true }
}, {
    versionKey: false
});
exports.Offer = (0, mongoose_1.model)("Offers", OfferSchema);
