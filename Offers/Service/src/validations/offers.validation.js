"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBodyQueryTags = exports.IBodyPostulationStatus = exports.IPostulateMusician = exports.IParams = exports.OfferSchema = void 0;
exports.OfferSchema = {
    type: "object",
    properties: {
        Title: { type: "string" },
        Description: { type: "string" },
        Creation_Date: { type: "string", format: "date-time" },
        Event_Date: { type: "string", format: "date-time" },
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
                    PostulationDate: { type: "string", format: "date" },
                    PostulationFullName: { type: "string", format: "date" },
                    PostulationStatus: { type: "string", enum: ["aplied", "evaluated", "acepted"] }
                },
                required: ["ApplicantId", "PostulationDate", "PostulationFullName", "PostulationStatus"]
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
        isAvailable: { type: "boolean" },
        tags: { type: "array", items: { type: "string" } }
    },
    required: ["Title", "Description", "Vacants", "isAvailable", "Event_Date", "Payment", "Event_Ubication", "Requeriments", "tags"]
};
exports.IParams = {
    type: "object",
    properties: {
        id: { type: "string" }
    },
    required: ["id"]
};
exports.IPostulateMusician = {
    type: "object",
    properties: {
        ApplicantId: { type: "integer" },
        PostulationDate: { type: "string", format: "date" },
        PostulationFullName: { type: "string" },
        PostulationStatus: { type: "string", enum: ["aplied", "evaluated", "acepted"] }
    },
    required: ["PostulationDate", "PostulationFullName"]
};
exports.IBodyPostulationStatus = {
    type: "object",
    properties: {
        OfferId: { type: "string" },
        ApplicantId: { type: "string" },
        Action: { type: "string", enum: ["aplied", "evaluated", "acepted"] }
    },
    required: ["OfferId", "Action"]
};
// Tags
exports.IBodyQueryTags = {
    type: "object",
    properties: {
        Tags: { type: "array", items: { type: "string" } }
    },
    required: ["Tags"]
};
