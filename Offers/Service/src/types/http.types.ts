import { FastifyReply, FastifyRequest } from "fastify";
import { ParamsTypeIdOnly, IHeadersAuth, OfferType, PostulateMusicianType, BodyPostulationStatusType, TBodyQueryTags } from "../validations/offers.validation";


export type RequestParams = FastifyRequest<{ Params : ParamsTypeIdOnly }>;

export type RequestParamsAuth = FastifyRequest<{ Params : ParamsTypeIdOnly, Headers : IHeadersAuth }>

export type RequestBody = FastifyRequest<{ Body : OfferType, Headers : IHeadersAuth }>;

export type PostulateMusicianRequest = FastifyRequest<{Params : ParamsTypeIdOnly, Body : PostulateMusicianType, Headers : IHeadersAuth}>;

export type ChangeAplicationStatus = FastifyRequest<{Body : BodyPostulationStatusType , Headers : IHeadersAuth}>;

export type ByTagsRequest = FastifyRequest<{ Body : TBodyQueryTags }>;