import { FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";

export const OfferSchema = {
    type : "object",
    properties : {
        Title : { type : "string" },
        Description : { type : "string" },
        Creation_Date : { type : "string", format : "date-time" },
        Event_Date : { type : "string", format : "date-time" },
        Payment : { type : "integer" },
        OrganizerId : { type : "integer" },
        Event_Ubication : { 
            type : "object",
            properties : {
                Career : { type : "string" },
                Street : { type : "string" },
                City : { type : "string" },
                SiteNumber : { type : "string" },
                Town : { type : "string" }
            },
            required : ["City", "Town", "SiteNumber"]
        },
        Applicants : {
            type : "array",
            items : {
                type : "object",
                properties : {
                    ApplicantId : { type : "string" },
                    PostulationDate : { type : "string", format : "date" },
                    PostulationFullName : { type : "string", format : "date" },
                    PostulationStatus : { type : "string", enum : ["aplied", "evaluated", "acepted"] }
                },
                required : ["ApplicantId", "PostulationDate", "PostulationFullName", "PostulationStatus"]
            },
            minItems : 0
        },
        Img : { type : "string" },
        Requeriments : {
            type : "array",
            items : {
                type : "object",
                properties : {
                    Description : { type : "string" }
                },
                required : ["Description"]
            },
            minItems : 1
        },
        Vacants : { type : "integer" },
        isAvailable : { type : "boolean" },
        tags : { type : "array", items : { type : "string" } },
        saves : { type : "array", items : { type : "string" } }
    },
    required : ["Title", "Description", "Vacants", "isAvailable", "Event_Date", "Payment", "Event_Ubication", "Requeriments", "tags", "saves"]
} as const;

export type OfferType = FromSchema<typeof OfferSchema>;

export const IParams = {
    type : "object",
    properties : {
        id : { type : "string" }
    },
    required : ["id"]
} as const;

export type ParamsTypeIdOnly = FromSchema<typeof IParams>;


export const IPostulateMusician ={
    type : "object",
    properties : {
        ApplicantId : { type : "integer" },
        PostulationDate : { type : "string", format : "date" },
        PostulationFullName : { type : "string" },
        PostulationStatus : { type : "string", enum : ["aplied", "evaluated", "acepted"] }
    },
    required : [ "PostulationDate", "PostulationFullName"]
} as const;

export type PostulateMusicianType = FromSchema<typeof IPostulateMusician>;

export const IBodyPostulationStatus = {
    type : "object",
    properties : {
        OfferId : { type : "string" },
        ApplicantId  : { type : "string" },
        Action : { type : "string", enum : ["aplied", "evaluated", "acepted"] }
    },
    required : ["OfferId", "Action"]
} as const;

export type BodyPostulationStatusType = FromSchema<typeof IBodyPostulationStatus>;


// Tags
export const IBodyQueryTags = {
    type : "object",
    properties : {
        Tags : { type : "array", items : { type : "string" } }
    },
    required : ["Tags"]
} as const;

export type TBodyQueryTags = FromSchema<typeof IBodyQueryTags>;

export interface IHeadersAuth extends FastifyRequest{
    authorization : string
}

export const IParamsAuth = {
    type : "object",
    properties : {
        Id : { type : "integer" }
    },
    required : ["Id"]
} as const;

export type TBodyAuth = FromSchema<typeof IParamsAuth>;