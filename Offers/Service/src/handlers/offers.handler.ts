import { Offer } from "../models/offers.model";
import { setNotAvailable } from "../utils/offerNotAbailable";

export const getAllOffers = async (req : any, reply : any) => {
    const Offers = await Offer.find();
    Offers.map(async offer => {
        offer.Event_Date.getDate > Date.now ? null : await setNotAvailable(offer.id);
    });
    return reply.code(200).send(Offers);
}

export const postOffer = async (req : any, reply : any) => {
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

export const getSingleOffer = async (req: any, reply : any) => {
    const offer = await Offer.findById(req.params.id);
    return reply.code(200).send(offer);
}

export const postulateMusician = async (req: any, reply : any) =>{
    try{
        console.log(req.body);
        console.log(req.params);
        await Offer.findByIdAndUpdate(req.params.id,{
            $push :{
                Applicants : req.body
            }
        });
        return reply.code(200).send({message : `Musico ${req.body.ApplicantId} Postulado Correctamente`});
    }catch(err){
        return reply.code(500).send(err)
    }
}