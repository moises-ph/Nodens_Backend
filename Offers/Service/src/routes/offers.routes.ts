import { deleteOffer, disableOffer, getAllOffers, getSingleOffer, postOffer, postulateMusician, changePostulationStatus } from "../handlers/offers.handler";
import { validateToken } from "../utils/tokenValidator";
import { IParams, IPostulateMusician, OfferSchema, OfferType, ParamsTypeIdOnly, PostulateMusicianType, BodyPostulationStatusType,IBodyPostulationStatus } from "../validations/offers.validation";
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
    },
    deleteOffer : {
        handler : deleteOffer,
        preHandler : validateToken,
        schema : {
            params : IParams
        }
    },
    disableOffer : {
        handler : disableOffer,
        preHandler : validateToken,
        schema : {
            params : IParams
        }
    },
    ChangePostulationStatus : {
        handler : changePostulationStatus,
        schema : {
            body : IBodyPostulationStatus
        }
    }
}

export const OffersRoutes = (fastify : FastifyInstance, options : any, done : any) => {
    //This is a Plugin that configures all the routes in Fastify

    // Route for Get All Offers
    fastify.get(options.url, routes.getAllOffers);

    // Route for Get Single Offer
    fastify.get<{ Params : ParamsTypeIdOnly }>(`${options.url}/:id`, routes.getSingleOffer);

    // Route for Post a new Offer
    fastify.post<{ Body : OfferType }>(options.url, routes.postOffer);

    // Route for postulate a Musician to an Offer
    fastify.put<{ Params : ParamsTypeIdOnly, Body : PostulateMusicianType }>(`${options.url}/:id`, routes.postulateMusician);

    // Route for delete an Offer
    fastify.delete<{ Params : ParamsTypeIdOnly }>(`${options.url}/:id`, routes.deleteOffer);

    // Route for disable an Offer
    fastify.patch<{ Params : ParamsTypeIdOnly }>(`${options.url}/:id`, routes.disableOffer);


    // Route for change Postulation Status
    fastify.put<{ Body : BodyPostulationStatusType }>(`${options.url}/changestatus`, routes.ChangePostulationStatus);

    // Plugin Done  
    done();
}
