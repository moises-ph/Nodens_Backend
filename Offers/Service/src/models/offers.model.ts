import { Schema, model, ObjectId } from "mongoose";

export interface IRequeriments{
    Description : string
}

export interface IApplicant{
    ApplicantId : ObjectId,
    PostulationDate : Date
}

export interface IEventUbication{
    City : string,
    Street : string,
    Career : string,
    SiteNumber : string,
    Town : string
}

export interface IOffer {
    Title : string,
    Description : string,
    Creation_Date : Date,
    Event_Date : Date,
    Payment : number,
    OrganizerId : number,
    Event_Ubication : IEventUbication,
    Applicants : IApplicant[] | null,
    Img : string,
    Requeriments : IRequeriments[] | null,
    Vacants : number,
    isAvailable : boolean
}

const RequerimentsSchema = new Schema<IRequeriments>({
    Description : { type : Schema.Types.String, required : true }
});

const ApplicantSchema = new Schema<IApplicant>({
    ApplicantId : { type : Schema.Types.ObjectId }
});

const SchemaEventUbication = new Schema<IEventUbication>({
    City : { type : Schema.Types.String, required : true },
    Street : { type : Schema.Types.String, required : false },
    Career : { type : Schema.Types.String, required : false },
    SiteNumber : { type : Schema.Types.String, required : true },
    Town : { type : Schema.Types.String, required : true },
});

const OfferSchema = new Schema<IOffer>({
    Title : { type : Schema.Types.String, required : true },
    Description : { type : Schema.Types.String, required : true },
    Creation_Date : { type : Schema.Types.Date, required : true },
    Event_Date : { type : Schema.Types.Date, required : true },
    Payment : { type : Schema.Types.Number, required : true },
    OrganizerId : { type : Schema.Types.Number, required : true },
    Event_Ubication : { type : SchemaEventUbication, required : true },
    Applicants : { type : [ApplicantSchema], required : false, default : [] },
    Img : { type : Schema.Types.String, required : false },
    Requeriments : { type : [RequerimentsSchema], required : true },
    Vacants : { type : Schema.Types.Number, required : true },
    isAvailable : { type : Schema.Types.Boolean, required : true }
});

export const Offer = model<IOffer>("Offers", OfferSchema);
