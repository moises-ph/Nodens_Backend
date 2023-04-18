import * as jose from "jose";
import { _SECRET } from "../configuration/config";

export async function validateToken (request : any, reply : any, next : any) {
    let requestToken : string = request.headers.authorization || null;
    console.log(request.headers);
    
    if(requestToken){
        try{
            requestToken = requestToken.replace("Bearer ", "");
            const { payload }  = await jose.jwtVerify(requestToken, new TextEncoder().encode(_SECRET));
            console.log(payload);
            request.body.OrganizerId = payload.Id;
            // next();
            reply.code(200).send({ ok : "Validated" })
        }catch(err){
            reply.code(401).send(err)
        }
    }
    else{
        reply.code(401).send({ message : "Must send Authorization Token" })
    }
}
