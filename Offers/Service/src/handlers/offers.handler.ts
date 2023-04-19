import { Offer } from "../models/offers.model";

export const getAllOffers = async (req : any, reply : any) => {
    const Offers = await Offer.find();
    return reply.code(200).send(Offers);
}

export const postOffer = async (req : any, reply : any) => {
    try{
        const newOffer = new Offer(req.body);
        console.log(newOffer.isNew);
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