import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from '@fastify/cors';
import { OffersRoutes } from "./routes/offers.routes";
import "./Database/mongoose";

// const app = Fastify({
//     logger: true
// }).withTypeProvider<TypeBoxTypeProvider>();

// app.register(OffersRoutes, { url : "/offers" });

// app.get("/ping", async (request : FastifyRequest, reply : FastifyReply) => {
//     return reply.send("pong");
// });

export const build = (opts : Object) => {
    const app = Fastify(opts).withTypeProvider<TypeBoxTypeProvider>();
    
    app.register(cors,{
        methods : ['GET', 'PUT', 'DELETE', 'PATCH', 'POST', 'OPTIONS'],
        allowedHeaders : ['Content-Type', 'Authorization'],
        origin : "*",
        preflight : true,
        strictPreflight : true
    });

    app.addHook('onSend', async (req : any, reply : FastifyReply)=>{
        reply.headers({
          'access-control-allow-origin' : '*',
          'access-control-allow-methods' : 'GET, PUT, DELETE, PATCH, POST, OPTIONS',
          'access-control-allow-headers' : 'Content-Type, Authorization'
        });
    });

    app.register(OffersRoutes, { url : "/offers" });
    
    app.get("/ping", async (request : FastifyRequest, reply : FastifyReply) => {
        return reply.send("pong");
    });
    
    return app;
}