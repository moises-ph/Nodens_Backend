import { FastifyRequest, FastifyReply } from "fastify";
import { Offer } from "../models/offers.model";
import { setNotAvailable } from "../utils/offerNotAbailable";
import { OfferType, ParamsTypeIdOnly, PostulateMusicianType, BodyPostulationStatusType } from "../validations/offers.validation";

type RequestParams = FastifyRequest<{ Params : ParamsTypeIdOnly }>;

type RequestBody = FastifyRequest<{ Body : OfferType }>;

type PostulateMusicianRequest = FastifyRequest<{Params : ParamsTypeIdOnly, Body : PostulateMusicianType}>;

type ChangeAplicationStatus = FastifyRequest<{Body : BodyPostulationStatusType}>;

export const getAllOffers = async (req : FastifyRequest, reply : FastifyReply) => {
    const Offers = await Offer.find();
    Offers.map(async offer => {
        offer.Event_Date.getDate > Date.now ? null : await setNotAvailable(offer.id);
    });
    return reply.code(200).send(Offers);
}

export const postOffer = async (req : RequestBody, reply : FastifyReply) => {
    try{
        const newOffer = new Offer(req.body);
        if (newOffer.Event_Date.getDate < Date.now) return reply.code(400).send({ message : "La fecha del evento debe ser mayor a la fecha actual" })
        if (newOffer.Creation_Date.getDate != Date.now) return reply.code(400).send({ message : "La fecha de creación de la oferta no coincide con la fecha actual" })
        await newOffer.save();
        return reply.code(200).send({message : "Oferta creada correctamente", id : newOffer.id});
    }
    catch(err){
        return reply.code(500).send(err);
    }
}

export const getSingleOffer = async (req: RequestParams, reply : FastifyReply) => {
    const offer = await Offer.findById(req.params.id);
    return reply.code(200).send(offer);
}

export const postulateMusician = async (req: PostulateMusicianRequest, reply : FastifyReply) =>{
    try{
        await Offer.findByIdAndUpdate(req.params.id,{
            $push :{
                Applicants : req.body
            }
        });
        return reply.code(200).send({message : `Musico ${req.body.ApplicantId} Postulado Correctamente`});
    }catch(err){
        return reply.code(500).send(err);
    }
}

export const deleteOffer = async (req : RequestParams, reply : FastifyReply)  => {
    try{
        await Offer.findByIdAndDelete(req.params.id);
        return reply.code(200).send({message : "Oferta eliminada correctamente"});
    }catch(err){
        return reply.code(500).send(err);
    }
};

export const disableOffer = async (req: RequestParams, reply : FastifyReply) => {
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
        })
    }
    catch(err){
        return reply.code(500).send(err);
    }
}