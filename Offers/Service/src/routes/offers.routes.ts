import { getAllOffers, getSingleOffer, postOffer, postulateMusician } from "../handlers/offers.handler";
import { validateToken } from "../utils/tokenValidator";
import { IParams, IPostulateMusician, OfferSchema, OfferType, ParamsType, PostulateMusicianType } from "../validations/offers.validation";
import { FastifyInstance } from "fastify";

const routes = {
    getAllOffers : {
        handler : getAllOffers
    },
    getSingleOffer :{
        handler : getSingleOffer,
        schema : {
            params : IParams
        }
    },
    postOffer : {
        handler : postOffer,
        preHandler : validateToken,
        schema : {
            body : OfferSchema
        }
    },
    postulateMusician :{
        handler : postulateMusician,
        preHandler : validateToken,
        schema : {
            body : IPostulateMusician,
            params : IParams
        }
    }
}

export const OffersRoutes = (fastify : FastifyInstance, options : any, done : any) => {
    //This is a Plugin that configures all the routes in Fastify

    // Route for Get All Offers
    fastify.get(options.url, routes.getAllOffers);

    // Route for Get Single Offer
    fastify.get<{ Params : ParamsType }>(`${options.url}/:id`, routes.getSingleOffer);

    // Route for Post a new Offer
    fastify.post<{ Body : OfferType }>(options.url, routes.postOffer);

    // Route for postulate a Musician to an Offer
    fastify.put<{ Params : ParamsType, Body : PostulateMusicianType }>(`${options.url}/:id`, routes.postulateMusician);

    // Plugin Done
    done();
}