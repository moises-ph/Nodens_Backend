import { getAllOffers, postOffer } from "../handlers/offers.handler";
import { validateToken } from "../utils/tokenValidator";
import { OfferSchema, OfferType } from "../validations/offers.validation";
import { FastifyInstance } from "fastify";

const routes = {
    getAllOffers : {
        handler : getAllOffers
    },
    postOffer : {
        handler : postOffer,
        preHandler : validateToken,
        schema : {
            body : OfferSchema
        }
    }
}

export const OffersRoutes = (fastify : FastifyInstance, options : any, done : any) => {
    //This is a Plugin that configures all the routes in Fastify

    // Route for Get All Offers
    fastify.get(options.url, routes.getAllOffers);

    // Route for Post a new Offer
    fastify.post<{ Body : OfferType }>(options.url, routes.postOffer);

    // Plugin Done
    done();
}