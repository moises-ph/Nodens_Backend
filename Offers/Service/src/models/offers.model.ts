import { Schema, model, ObjectId } from "mongoose";

export interface IRequeriments{
    Description : string
}

export interface IApplicant{
    ApplicantId : number,
    PostulationDate : Date,
    PostulationFullName : string,
    PostulationStatus : string
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
    Applicants : IApplicant[],
    Img : string,
    Requeriments : IRequeriments[],
    Vacants : number,
    isAvailable : boolean,
    tags : string[]
}

const RequerimentsSchema = new Schema<IRequeriments>({
    Description : { type : Schema.Types.String, required : true }
},{
    _id : false,
    versionKey : false
});

const ApplicantSchema = new Schema<IApplicant>({
    PostulationDate : { type : Schema.Types.Date, required : true },
    ApplicantId : { type : Schema.Types.Number, required : true },
    PostulationFullName : { type : Schema.Types.String, required : true },
    PostulationStatus : { required : true, type : Schema.Types.String }
},{
    _id : false,
    versionKey : false
});

const SchemaEventUbication = new Schema<IEventUbication>({
    City : { type : Schema.Types.String, required : true },
    Street : { type : Schema.Types.String, required : false },
    Career : { type : Schema.Types.String, required : false },
    SiteNumber : { type : Schema.Types.String, required : true },
    Town : { type : Schema.Types.String, required : true },
},{
    _id : false,
    versionKey : false
});

const OfferSchema = new Schema<IOffer>({
    Title : { type : Schema.Types.String, required : true },
    Description : { type : Schema.Types.String, required : true },
    Creation_Date : { type : Schema.Types.Date, required : true },
    Event_Date : { type : Schema.Types.Date, required : true },
    Payment : { type : Schema.Types.Number, required : true },
    OrganizerId : { type : Schema.Types.Number, required : true },
    Event_Ubication : { type : SchemaEventUbication, required : true },
    Applicants : { type : [], required : false, default : [] },
    Img : { type : Schema.Types.String, required : false },
    Requeriments : { type : [RequerimentsSchema], required : true },
    Vacants : { type : Schema.Types.Number, required : true },
    isAvailable : { type : Schema.Types.Boolean, required : true },
    tags : { type : [Schema.Types.String], required : true }
},{
    versionKey : false
});

export const Offer = model<IOffer>("Offers", OfferSchema);
