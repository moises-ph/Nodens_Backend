import { Static, Type } from "@sinclair/typebox";

export const OfferSchema = Type.Object({
    Title : Type.String(),
    Description : Type.String(),
    Creation_Date : Type.Date(),
    Event_Date : Type.Date(),
    Payment : Type.Number(),
    OrganizerId : Type.Optional(Type.Number({default : 0})), // The Id for the Organizer is the Auth Id, not mongo Id. 
    Event_Ubication : Type.Optional(Type.Array(Type.Object({
        Career : Type.String(),
        Street : Type.String(),
        City : Type.String(),
        SiteNumber : Type.String(),
        Town : Type.String()
    }))),
    Applicants : Type.Optional(Type.Array(Type.Object({
        ApplicantId : Type.Number(), // The Id for the Applicants is the Auth Id, not mongo Id. 
        PostulationDate : Type.Date()
    }))),
    Img : (Type.String()),
    Requeriments : Type.Array(Type.Object({
        Description : (Type.String())
    })),
    Vacants : Type.Number(),
    isAvailable : Type.Boolean()
});

export type OfferType = Static<typeof OfferSchema>;