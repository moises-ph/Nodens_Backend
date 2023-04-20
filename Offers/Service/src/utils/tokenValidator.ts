import * as jose from "jose";
import { _SECRET } from "../configuration/config";
import { JWTPayload } from "jose";

export async function validateToken (request : any, reply : any, done : any) {
    try{
        let requestToken : string = request.headers.authorization || null;
        if(requestToken){
            requestToken = requestToken.replace("Bearer ", "");
            const { payload } = await jose.jwtVerify(requestToken, new TextEncoder().encode(_SECRET))
            console.log(payload);
            if(request.method === "POST"){
                payload.Role === "Organizer" ? request.body.OrganizerId = payload.Id : ()=>{throw new Error("Solo los organizadores pueden crear ofertas")} ;
            }
            else if(request.method === "PUT"){
                payload.Role === "Musician" ? request.body.ApplicantId = payload.Id : ()=>{throw new Error("Solo los músicos pueden postularse")} ;
            }
        }
        else{
            return reply.code(401).send({ message : "Must send Authorization Token" })
        }
    }catch(err){
        return reply.code(401).send(err)
    }
}
