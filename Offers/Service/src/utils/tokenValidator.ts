import * as jose from "jose";
import { _SECRET } from "../configuration/config";
import { FastifyReply } from "fastify";

export async function validateToken (request : any, reply : FastifyReply, done : any) {
    try{
        console.log(request.headers);
        let requestToken : string = request.headers.authorization;
        if(requestToken){
            requestToken = requestToken.replace("Bearer ", "");
            const { payload } = await jose.jwtVerify(requestToken, new TextEncoder().encode(_SECRET));
            if(request.method === "POST" || request.method === "PATCH" || request.method === "DELETE"){
                payload.Role === "Organizer" ? request.body.OrganizerId = payload.Id : ()=>{throw new Error("Solo los organizadores pueden crear ofertas")};
            }
            else if(request.method === "PUT"){
                payload.Role === "Musician" ? request.body.ApplicantId = payload.Id : ()=>{throw new Error("Solo los músicos pueden postularse")};
            }
            else if(request.method === "GET"){
                payload.Role === "Musician" || payload.Role === "Organizer" ? request.params.Id = payload.Id : ()=>{throw new Error("Rol inválido")};
            }
        }
        else{
            return reply.code(401).send({ message : "Must send Authorization Token" });
        }
    }catch(err){
        return reply.code(401).send(err);
    }
}