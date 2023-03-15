"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.OfferSchema = typebox_1.Type.Object({
    Title: typebox_1.Type.Optional(typebox_1.Type.String()),
    Description: typebox_1.Type.Optional(typebox_1.Type.String()),
    Creation_Date: typebox_1.Type.Object(typebox_1.Type.Date()),
    Event_Date: typebox_1.Type.Object(typebox_1.Type.Date()),
    Payment: typebox_1.Type.Optional(typebox_1.Type.Number()),
    OrganizerId: typebox_1.Type.Optional(typebox_1.Type.Any()),
    Event_Ubication: typebox_1.Type.Optional(typebox_1.Type.Object({
        Career: typebox_1.Type.Optional(typebox_1.Type.String()),
        Street: typebox_1.Type.Optional(typebox_1.Type.String()),
        City: typebox_1.Type.Optional(typebox_1.Type.String()),
        SiteNumber: typebox_1.Type.Optional(typebox_1.Type.String()),
        Town: typebox_1.Type.Optional(typebox_1.Type.String())
    })),
    Applicants: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Object({
        ApplicantId: typebox_1.Type.Optional(typebox_1.Type.Any()),
        PostulationDate: typebox_1.Type.Optional(typebox_1.Type.Date())
    }))),
    Img: typebox_1.Type.Optional(typebox_1.Type.String()),
    Requeriments: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Object({
        Description: typebox_1.Type.Optional(typebox_1.Type.String())
    }))),
    Vacants: typebox_1.Type.Optional(typebox_1.Type.Number())
});
