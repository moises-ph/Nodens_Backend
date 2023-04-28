import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { OffersRoutes } from "./routes/offers.routes";
import "./Database/mongoose";

const server = Fastify({
    logger: true
}).withTypeProvider<TypeBoxTypeProvider>();

server.register(OffersRoutes, { url : "/offers" });

server.get("/ping", async (request : FastifyRequest, reply : FastifyReply) => {
    return reply.send("pong");
});

server.listen({ port: 8000 }, (err : any, address : any) => {
    if(err){
        console.error(err);
        process.exit(1);
    }
});