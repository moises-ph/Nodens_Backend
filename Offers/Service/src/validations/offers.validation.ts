import { Static, Type } from "@sinclair/typebox";
import { IApplicant, IEventUbication, IOffer, IRequeriments } from "../models/offers.model";


export const OfferSchema = Type.Object({
    Title : Type.Optional(Type.String()),
    Description : Type.Optional(Type.String()),
    Creation_Date : Type.Object(Type.Date()),
    Event_Date : Type.Object(Type.Date()),
    Payment : Type.Optional(Type.Number()),
    OrganizerId : Type.Optional(Type.Any()), // Any because the typebox doesn't have a Mongo ObjectID property for validation
    Event_Ubication : Type.Optional(Type.Object({
        Career : Type.Optional(Type.String()),
        Street : Type.Optional(Type.String()),
        City : Type.Optional(Type.String()),
        SiteNumber : Type.Optional(Type.String()),
        Town : Type.Optional(Type.String())
    })),
    Applicants : Type.Optional(Type.Array(Type.Object({
        ApplicantId :Type.Optional(Type.Any()), // No ObjectId validation in typebox package
        PostulationDate : Type.Optional(Type.Date())
    }))),
    Img : Type.Optional(Type.String()),
    Requeriments : Type.Optional(Type.Array(Type.Object({
        Description : Type.Optional(Type.String())
    }))),
    Vacants : Type.Optional(Type.Number())
});

export type OfferType = Static<typeof OfferSchema>;