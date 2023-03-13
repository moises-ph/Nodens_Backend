import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";

const server = Fastify({
    logger: true
}).withTypeProvider<TypeBoxTypeProvider>();



server.get("/ping", async (request : any, reply : any) => {
    return reply.send("pong");
});

server.listen({ port: 8000 }, (err, address) => {
    if(err){
        console.error(err);
        process.exit(1);
    }
});