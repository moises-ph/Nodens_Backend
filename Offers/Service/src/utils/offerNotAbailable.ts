import { Offer } from "../models/offers.model"

type Response = {
    code : number
}

export const setOfferStatus = async (id : string) : Promise<Response> => {
    return new Promise(async (res, rej)=>{
        try{
            await Offer.findByIdAndUpdate(id,[{
                $set : {
                    isAvailable : { 
                        $eq: [
                            false,
                            "$isAvailable"
                        ] 
                    }
                }
            }]);
            console.log("XD");
            return res({
                code : 200
            })
        }catch(err){
            return rej(err)
        }
    })
}