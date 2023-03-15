import { Offer } from "../models/offers.model";

export const getOffers = async (req : any, reply : any) => {
    const Offers = await Offer.find();
    return reply.code(200).send(Offers);
}

export const postOffer = async (req : any, reply : any) => {
    try{
        const newOffer = new Offer(req.body);
        await newOffer.save();
        return reply.code(200).send({message : "Oferta creada correctamente", id : newOffer.id});
    }
    catch(err){
        return reply.code(500).send(err);
    }
}


