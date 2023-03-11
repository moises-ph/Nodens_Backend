import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify/types/instance";

const server : FastifyInstance = Fastify({
    logger : true,
}).withTypeProvider<TypeBoxTypeProvider>();


server.get("/ping", async ( request, reply ) => {
    return "pong\n";
});

// Start up the server
server.listen({ port : 8080 }, (err, address) => {
    if(err){
        console.log(err);
        process.exit(1);
    }
});