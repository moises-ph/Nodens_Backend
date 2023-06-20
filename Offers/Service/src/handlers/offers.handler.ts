import { FastifyRequest, FastifyReply } from "fastify";
import { IApplicant, Offer } from "../models/offers.model";
import { setOfferStatus } from "../utils/offerNotAbailable";
import { RequestParamsAuth, RequestParams, ByTagsRequest, RequestBody, PostulateMusicianRequest, ChangeAplicationStatus } from "../types/http.types";
import { _URL_AUTH, _URL_MAILER } from "../configuration/config";
import { fetchOrganizer } from "../utils/authService";
import { ApplicantType, OrganizerType } from "../types/mail.types";
import { IAuthUserSchema } from '../types/auth.types';
import { sendOrganizer, sendPostulated } from "../utils/mailService";
import { getJWTPayload } from "../helpers/getPayload";

export const addSaveOffer = async (req: RequestParamsAuth, reply: FastifyReply) => {
    try {
        const payload: any = await getJWTPayload(
        req.headers.authorization.replace("Bearer ", "")
        );
        const actualOffer = await Offer.findById(req.params.id);
        if (!actualOffer) throw new Error("The offer doesn't exists");
        actualOffer.saves.push(payload.Id);
        await actualOffer.save();
        return reply.code(200).send({ message: "Oferta guardada correctamente" });
    }catch (err) {
        return reply.code(500).send(err);
    }
};

export const getSavedOfferMusician = async (req: RequestParamsAuth, reply : FastifyReply) => {
    const payload: any = await getJWTPayload(
      req.headers.authorization.replace("Bearer ", "")
    );
    const Offers = await Offer.find({
      "saves" : {
        $all : [payload.Id]        
      }
    });
    return reply.code(200).send(Offers);
}

export const getPostulatedOffersMusician = async (req: RequestParamsAuth, reply : FastifyReply) => {
    const payload: any = await getJWTPayload(
      req.headers.authorization.replace("Bearer ", "")
    );
    const Offers = await Offer.find({
      "Applicants" : {
        $elemMatch : {
            "ApplicantId" : payload.Id
        }        
      }
    });
    return reply.code(200).send(Offers);
}

export const getOfferByOrganizer = async (req: RequestParamsAuth, reply : FastifyReply) => {
    const Offers = await Offer.find({
        OrganizerId : req.params.Id
    });
    return reply.code(200).send(Offers);
}

// No token
export const getSingleOffer = async (req: RequestParams, reply : FastifyReply) => {
    let payload : any;
    if(req.headers.authorization) payload = await getJWTPayload(req.headers.authorization!.replace("Bearer ", ""));
    console.log(payload && payload.Role === 'Organizer' ? 1 : 0);
    const offer = await Offer.findById(req.params.id,payload && payload.Role === 'Organizer' ? {} : {Applicants : 0});
    return reply.code(200).send(offer);
}

// No token
export const getAllOffers = async (req : FastifyRequest, reply : FastifyReply) => {
    const Offers = await Offer.find({},{ Applicants : 0 });
    Offers.map(async offer => {
        offer.Event_Date.getDate > Date.now ? null : await setOfferStatus(offer.id);
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

        req.body.PostulationStatus = "aplied";
        const actualOffer = await Offer.findById(req.params.id);
        if(!actualOffer) throw new Error("The offer doesn't exists");
        const emailOrganizer : IAuthUserSchema | any = await fetchOrganizer(actualOffer?.OrganizerId.toString());
        console.log(emailOrganizer);
        
        if(emailOrganizer.message)throw new Error("El organizador no existe")

        const payload : any = await getJWTPayload(req.headers.authorization.replace("Bearer ", ""));

        req.body.ApplicantId = req.body.ApplicantId == null ? payload.Id : req.body.ApplicantId

        console.log(actualOffer.Applicants.map(element => element.ApplicantId).includes(req.body.ApplicantId as number));

        if(actualOffer.Applicants.find(element => element.ApplicantId === req.body.ApplicantId)) throw new Error("El músico ya se postuló a esta oferta")

        const applicantData : ApplicantType = {
            ReceiverEmail : payload.Email,
            ReceiverName : req.body.PostulationFullName,
            OfferID : payload.Id,
            OfferTitle : actualOffer!.Title,
            OrganizerName : emailOrganizer.userName,
            OrganizerId : actualOffer.OrganizerId.toString()
        }

        const organizerData : OrganizerType = {
            ReceiverEmail : emailOrganizer.email,
            ApplicantName : req.body.PostulationFullName,
            ApplicantId : payload.Id,
            ApplicantEmail : payload.Email,
            OfferID : payload.Id,
            OfferTitle : actualOffer.Title
        }

        const postulatedEmailresult = await sendPostulated(applicantData);

        const organizerEmailResult = await sendOrganizer(organizerData);     

        if(postulatedEmailresult.hasOwnProperty("statusCode") && postulatedEmailresult.statusCode != 200) new Error(postulatedEmailresult.message);

        if(organizerEmailResult.hasOwnProperty("statusCode") && organizerEmailResult.statusCode != 200) new Error(organizerEmailResult.message);

        await actualOffer.updateOne({
            $push :{
                Applicants : req.body
            }
        });

        return reply.code(200).send({message : `Musico ${req.body.ApplicantId} Postulado Correctamente`, emailOrganizer});
    }catch(err){
        return reply.code(500).send(err);
    }
}

export const deleteOffer = async (req : RequestParamsAuth, reply : FastifyReply)  => {
    try{
        const offer = await Offer.findById(req.params.id);
        const payload = await getJWTPayload(req.headers.authorization.replace("Bearer ", ""));
        if(offer?.OrganizerId != payload.Id)throw new Error("Esta oferta no es tuya");
        await Offer.findByIdAndDelete(req.params.id);
        return reply.code(200).send({message : "Oferta eliminada correctamente"});
    }catch(err){
        return reply.code(500).send(err);
    }
};

export const changeOfferStatus = async (req: RequestParamsAuth, reply : FastifyReply) => {
    try{
        await setOfferStatus(req.params.id);
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