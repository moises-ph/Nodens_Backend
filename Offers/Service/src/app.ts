import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
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
    
    app.register(OffersRoutes, { url : "/offers" });
    
    app.get("/ping", async (request : FastifyRequest, reply : FastifyReply) => {
        return reply.send("pong");
    });
    
    return app;
}