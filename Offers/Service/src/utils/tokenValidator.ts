import * as jose from "jose";
import { _SECRET } from "../configuration/config";

export async function validateToken (request : any, reply : any, done : any) {
    try{
        let requestToken : string = request.headers.authorization || null;
        if(requestToken){
            requestToken = requestToken.replace("Bearer ", "");
            return jose.jwtVerify(requestToken, new TextEncoder().encode(_SECRET)).then(data => {
                request.body.OrganizerId = data.payload.Id;
                return done();
            }).catch(err => reply.code(401).send({ message : "Token is Invalid or Expired" }));
        }
        else{
            return reply.code(401).send({ message : "Must send Authorization Token" })
        }
    }catch(err){
        return reply.code(401).send(err)
    }
}
