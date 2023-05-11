"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const offers_routes_1 = require("./routes/offers.routes");
require("./Database/mongoose");
// const app = Fastify({
//     logger: true
// }).withTypeProvider<TypeBoxTypeProvider>();
// app.register(OffersRoutes, { url : "/offers" });
// app.get("/ping", async (request : FastifyRequest, reply : FastifyReply) => {
//     return reply.send("pong");
// });
const build = (opts) => {
    const app = (0, fastify_1.default)(opts).withTypeProvider();
    app.register(cors_1.default, {
        methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        origin: "*",
        preflight: true,
        strictPreflight: true
    });
    app.addHook('onSend', (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        reply.headers({
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET, PUT, DELETE, PATCH, POST, OPTIONS',
            'access-control-allow-headers': 'Content-Type, Authorization'
        });
    }));
    app.register(offers_routes_1.OffersRoutes, { url: "/offers" });
    app.get("/ping", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        return reply.send("pong");
    }));
    return app;
};
exports.build = build;
