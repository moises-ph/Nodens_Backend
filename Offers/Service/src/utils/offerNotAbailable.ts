import { Offer } from "../models/offers.model"

type Response = {
    code : number
}

export const setNotAvailable = async (id : string) : Promise<Response> => {
    return new Promise(async (res, rej)=>{
        try{
            await Offer.findByIdAndUpdate(id,{
                $set : {
                    isAvailable : false
                }
            });
            return {
                code : 200
            }
        }catch(err){
            return rej(err)
        }
    })
}