"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestSchemaForOrganizer = exports.RequestSchemaForApplication = void 0;
exports.RequestSchemaForApplication = {
    type: "object",
    properties: {
        ReceiverEmail: { type: "string", format: "email" },
        ReceiverName: { type: "string" },
        OfferID: { type: "string" },
        OfferTitle: { type: "string" },
        OrganizerName: { type: "string" },
        OrganizerId: { type: "string" },
        EntrepriseName: { type: "string" }
    },
    required: ["ReceiverEmail", "ReceiverName", "OfferID", "OfferTitle", "OrganizerId"]
};
exports.RequestSchemaForOrganizer = {
    type: "object",
    properties: {
        ReceiverEmail: { type: "string", format: "email" },
        OfferID: { type: "string" },
        OfferTitle: { type: "string" },
        ApplicantId: { type: "string" },
        ApplicantName: { type: "string" },
        ApplicantEmail: { type: "string" },
    },
    required: ["ReceiverEmail", "OfferID", "OfferTitle", "ApplicantId", "ApplicantName", "ApplicantEmail"]
};
