import { FromSchema } from "json-schema-to-ts";

export const RequestSchemaForApplication = {
  type: "object",
  properties: {
    ReceiverEmail: {type: "string", format: "email"},
    ReceiverName: {type: "string"}, 
    OfferID: {type: "string"},
    OfferTitle: {type: "string"},
    OrganizerName: {type: "string"},
    OrganizerId: {type: "string"},
    EntrepriseName: {type: "string"}
  },
  required: ["ReceiverEmail", "ReceiverName","OfferID", "OfferTitle", "OrganizerId"]
} as const;

export type ApplicantType = FromSchema<typeof RequestSchemaForApplication>;

export const RequestSchemaForOrganizer = {
  type: "object",
  properties: {
    ReceiverEmail: {type: "string", format: "email"},
    OfferID: {type: "string"},
    OfferTitle: {type: "string"},
    ApplicantId: {type: "string"},
    ApplicantName: {type: "string"},
    ApplicantEmail: {type: "string"},

  },
  required: ["ReceiverEmail", "OfferID", "OfferTitle", "ApplicantId", "ApplicantName", "ApplicantEmail"]
} as const;

export type OrganizerType = FromSchema<typeof RequestSchemaForOrganizer>;