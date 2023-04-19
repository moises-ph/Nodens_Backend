"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IParams = exports.OfferSchema = void 0;
exports.OfferSchema = {
    type: "object",
    properties: {
        Title: { type: "string" },
        Description: { type: "string" },
        Creation_Date: { type: "string", format: "date" },
        Event_Date: { type: "string", format: "date" },
        Payment: { type: "integer" },
        OrganizerId: { type: "integer" },
        Event_Ubication: {
            type: "object",
            properties: {
                Career: { type: "string" },
                Street: { type: "string" },
                City: { type: "string" },
                SiteNumber: { type: "string" },
                Town: { type: "string" }
            },
            required: ["City", "Town", "SiteNumber"]
        },
        Applicants: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    ApplicantId: { type: "string" },
                    PostulationDate: { type: "string" }
                },
                required: ["ApplicantId", "PostulationDate"]
            },
            minItems: 0
        },
        Img: { type: "string" },
        Requeriments: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    Description: { type: "string" }
                },
                required: ["Description"]
            },
            minItems: 1
        },
        Vacants: { type: "integer" },
        isAvailable: { type: "boolean" }
    },
    required: ["Title", "Description", "Vacants", "isAvailable", "Creation_Date", "Event_Date", "Payment", "Event_Ubication", "Requeriments"]
};
exports.IParams = {
    type: "object",
    properties: {
        id: { type: "string" }
    },
    required: ["id"]
};
