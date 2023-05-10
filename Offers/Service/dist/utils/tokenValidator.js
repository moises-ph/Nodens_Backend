"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jose = __importStar(require("jose"));
const config_1 = require("../configuration/config");
function validateToken(request, reply, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(request.headers);
            let requestToken = request.headers.authorization;
            if (requestToken) {
                requestToken = requestToken.replace("Bearer ", "");
                const { payload } = yield jose.jwtVerify(requestToken, new TextEncoder().encode(config_1._SECRET));
                if (request.method === "POST" || request.method === "PATCH" || request.method === "DELETE") {
                    payload.Role === "Organizer" ? request.body.OrganizerId = payload.Id : () => { throw new Error("Solo los organizadores pueden crear ofertas"); };
                }
                else if (request.method === "PUT") {
                    payload.Role === "Musician" ? request.body.ApplicantId = payload.Id : () => { throw new Error("Solo los músicos pueden postularse"); };
                }
                else if (request.method === "GET") {
                    payload.Role === "Musician" || payload.Role === "Organizer" ? request.params.Id = payload.Id : () => { throw new Error("Rol inválido"); };
                }
            }
            else {
                return reply.code(401).send({ message: "Must send Authorization Token" });
            }
        }
        catch (err) {
            return reply.code(401).send(err);
        }
    });
}
exports.validateToken = validateToken;
