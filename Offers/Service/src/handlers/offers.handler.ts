import { FastifyRequest, FastifyReply } from "fastify";
import { Offer } from "../models/offers.model";
import { setNotAvailable } from "../utils/offerNotAbailable";
import { OfferType, ParamsTypeIdOnly, PostulateMusicianType, TBodyAuth ,BodyPostulationStatusType, IHeadersAuth, TBodyQueryTags } from "../validations/offers.validation";
import { RequestParamsAuth, RequestParams, ByTagsRequest, RequestBody, PostulateMusicianRequest, ChangeAplicationStatus } from "../types/http.types";
import { _URL_AUTH, _URL_MAILER } from "../configuration/config";
import { fetchOrganizer } from "../utils/authService";
import { ApplicantType, OrganizerType } from "../types/mail.types";
import { IAuthUserSchema } from '../types/auth.types';
import { sendOrganizer, sendPostulated } from "../utils/mailService";
import { getJWTPayload } from "../helpers/getPayload";



export const getPostulatedOffersMusician = async (req: RequestParamsAuth, reply : FastifyReply) => {
    const Offers = await Offer.find({
        "Applicants.ApplicantId" : req.params.Id
    });
    return reply.code(200).send(Offers);
}

export const getOfferByOrganizer = async (req: RequestParamsAuth, reply : FastifyReply) => {
    const Offers = await Offer.find({
        OrganizerId : req.params.Id
    }, { Applicants : 0 });
    return reply.code(200).send(Offers);
}

// No token
export const getSingleOffer = async (req: RequestParams, reply : FastifyReply) => {
    const offer = await Offer.findById(req.params.id,{
        Applicants : 0
    });
    return reply.code(200).send(offer);
}

// No token
export const getAllOffers = async (req : FastifyRequest, reply : FastifyReply) => {
    const Offers = await Offer.find({},{ Applicants : 0 });
    Offers.map(async offer => {
        offer.Event_Date.getDate > Date.now ? null : await setNotAvailable(offer.id);
    });
    return reply.code(200).send(Offers);
}

// No token
export const getOffersByTag = async (req : ByTagsRequest, reply : FastifyReply) => {
    try{
        const tags : string[] = req.body.Tags;
        const tagsFounded = await Offer.find({
            tags : {
                $in : tags
            }
        }, { Applicants : 0 });
        return reply.code(200).send(tagsFounded);
    }
    catch(err){
        return reply.code(500).send(err);
    }
}


export const postOffer = async (req : RequestBody, reply : FastifyReply) => {
    try{
        const newOffer = new Offer(req.body);
        newOffer.Creation_Date = new Date();
        if (newOffer.Event_Date < newOffer.Creation_Date) return reply.code(400).send({ message : "La fecha del evento debe ser mayor a la fecha actual" })
        await newOffer.save();
        return reply.code(200).send({message : "Oferta creada correctamente", id : newOffer.id});
    }
    catch(err){
        return reply.code(500).send(err);
    }
}

export const postulateMusician = async (req: PostulateMusicianRequest, reply : FastifyReply) =>{
    try{
        console.log(req.params)
        req.body.PostulationStatus = "aplied";
        const actualOffer = await Offer.findById(req.params.id);
        if(!actualOffer) throw new Error("The offer doesn't exists")
        const emailOrganizer : IAuthUserSchema = await fetchOrganizer(actualOffer?.OrganizerId.toString());
        
        if(emailOrganizer !satisfies IAuthUserSchema) new Error("El organizador no existe")

        const payload = getJWTPayload(req.headers.authorization);

        const applicantData : ApplicantType = {
            ReceiverEmail : payload.Email,
            ReceiverName : req.body.PostulationFullName,
            OfferID : req.params.Payload!.Id,
            OfferTitle : actualOffer!.Title,
            OrganizerName : emailOrganizer.userName,
            OrganizerId : actualOffer.OrganizerId.toString()
        }

        const organizerData : OrganizerType = {
            ReceiverEmail : emailOrganizer.Email,
            ApplicantName : req.body.PostulationFullName,
            ApplicantId : req.params.Payload!.Id,
            ApplicantEmail : req.params.Payload!.Email,
            OfferID : req.params.Payload!.Id,
            OfferTitle : actualOffer.Title
        }
        console.log(applicantData);

        console.log(_URL_MAILER);

        console.log(req.params);

        // await sendPostulated(applicantData);

        // await sendOrganizer(organizerData);

        // await actualOffer.update({
        //     $push :{
        //         Applicants : req.body
        //     }
        // });

        return reply.code(200).send({message : `Musico ${req.body.ApplicantId} Postulado Correctamente`, emailOrganizer});
    }catch(err){
        return reply.code(500).send(err);
    }
}

export const deleteOffer = async (req : RequestParamsAuth, reply : FastifyReply)  => {
    try{
        console.log(req.params.id);
        await Offer.findByIdAndDelete(req.params.id);
        return reply.code(200).send({message : "Oferta eliminada correctamente"});
    }catch(err){
        return reply.code(500).send(err);
    }
};

export const disableOffer = async (req: RequestParamsAuth, reply : FastifyReply) => {
    try{
        await setNotAvailable(req.params.id);
        return reply.code(200).send({message : "Oferta deshabilidata exitosamente"});
    }catch(err){
        return reply.code(500).send(err);
    }
}

export const changePostulationStatus = async (req : ChangeAplicationStatus, reply : FastifyReply) => {
    try{
        await Offer.findByIdAndUpdate(req.body.OfferId, {
             $set: {
                "Applicants.$[element].PostulationStatus" : req.body.Action 
            }
        },{
            arrayFilters : [{
                "element.ApplicantId" : req.body.ApplicantId
            }]
        });
        return reply.code(200).send({ message : "Estado de postulación cambiado correctamente" });
    }
    catch(err){
        return reply.code(500).send(err);
    }
}