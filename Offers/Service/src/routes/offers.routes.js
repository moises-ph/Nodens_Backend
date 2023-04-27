"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffersRoutes = void 0;
const offers_handler_1 = require("../handlers/offers.handler");
const tokenValidator_1 = require("../utils/tokenValidator");
const offers_validation_1 = require("../validations/offers.validation");
const routes = {
    getAllOffers: {
        handler: offers_handler_1.getAllOffers,
    },
    getOffersByTag: {
        handler: offers_handler_1.getOffersByTag,
        schema: {
            body: offers_validation_1.IBodyQueryTags
        }
    },
    getSingleOffer: {
        handler: offers_handler_1.getSingleOffer,
        schema: {
            params: offers_validation_1.IParams,
        }
    },
    postOffer: {
        handler: offers_handler_1.postOffer,
        preHandler: tokenValidator_1.validateToken,
        schema: {
            body: offers_validation_1.OfferSchema,
        },
    },
    postulateMusician: {
        handler: offers_handler_1.postulateMusician,
        preHandler: tokenValidator_1.validateToken,
        schema: {
            body: offers_validation_1.IPostulateMusician,
            params: offers_validation_1.IParams,
        },
    },
    deleteOffer: {
        handler: offers_handler_1.deleteOffer,
        preHandler: tokenValidator_1.validateToken,
        schema: {
            params: offers_validation_1.IParams,
        },
    },
    disableOffer: {
        handler: offers_handler_1.disableOffer,
        preHandler: tokenValidator_1.validateToken,
        schema: {
            params: offers_validation_1.IParams,
        },
    },
    ChangePostulationStatus: {
        handler: offers_handler_1.changePostulationStatus,
        preHandler: tokenValidator_1.validateToken,
        schema: {
            body: offers_validation_1.IBodyPostulationStatus,
        },
    },
};
const OffersRoutes = (fastify, options, done) => {
    //This is a Plugin that configures all the routes in Fastify
    // Route for Get All Offers
    fastify.get(options.url, routes.getAllOffers);
    // Route for get All Offers that match with request body tags
    fastify.get(options.url, routes.getOffersByTag);
    // Route for Get Single Offer
    fastify.get(`${options.url}/:id`, routes.getSingleOffer);
    // Route for Post a new Offer
    fastify.post(options.url, routes.postOffer);
    // Route for postulate a Musician to an Offer
    fastify.put(`${options.url}/:id`, routes.postulateMusician);
    // Route for delete an Offer
    fastify.delete(`${options.url}/:id`, routes.deleteOffer);
    // Route for disable an Offer
    fastify.patch(`${options.url}/:id`, routes.disableOffer);
    // Route for change Postulation Status
    fastify.patch(`${options.url}/changestatus`, routes.ChangePostulationStatus);
    // Plugin Done
    done();
};
exports.OffersRoutes = OffersRoutes;
