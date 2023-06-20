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
            body: offers_validation_1.IBodyQueryTags,
        },
    },
    getSingleOffer: {
        handler: offers_handler_1.getSingleOffer,
        schema: {
            params: offers_validation_1.IParams,
        },
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
    changeOfferStatus: {
        handler: offers_handler_1.changeOfferStatus,
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
    getPostulatedOffersMusician: {
        handler: offers_handler_1.getPostulatedOffersMusician,
        preHandler: tokenValidator_1.validateToken,
    },
    getOfferByOrganizer: {
        handler: offers_handler_1.getOfferByOrganizer,
        preHandler: tokenValidator_1.validateToken,
    },
    addSaveOffer: {
        handler: offers_handler_1.addSaveOffer,
        preHandler: tokenValidator_1.validateToken
    },
    getSavedOffer: {
        handler: offers_handler_1.getSavedOfferMusician,
        preHandler: tokenValidator_1.validateToken
    }
};
const OffersRoutes = (fastify, options, done) => {
    //This is a Plugin that configures all the routes in Fastify
    fastify.get(`${options.url}/musician/saved`, routes.getSavedOffer);
    // Route for Musician save an offer
    fastify.patch(`${options.url}/save/:id`, routes.addSaveOffer);
    // Route for Get All the Offers created by an Organizer, using Auth Token
    fastify.get(`${options.url}/organizer`, routes.getOfferByOrganizer);
    // Route for Get All the Offers that a Musician get postulated
    fastify.get(`${options.url}/musician`, routes.getPostulatedOffersMusician);
    // Route for Get All Offers
    fastify.get(options.url, routes.getAllOffers);
    // Route for get All Offers that match with request body tags
    fastify.put(options.url, routes.getOffersByTag);
    // Route for Get Single Offer
    fastify.get(`${options.url}/:id`, routes.getSingleOffer);
    // Route for Post a new Offer
    fastify.post(options.url, routes.postOffer);
    // Route for postulate a Musician to an Offer
    fastify.put(`${options.url}/:id`, routes.postulateMusician);
    // Route for delete an Offer
    fastify.delete(`${options.url}/:id`, routes.deleteOffer);
    // Route for disable an Offer
    fastify.patch(`${options.url}/:id`, routes.changeOfferStatus);
    // Route for change Postulation Status
    fastify.patch(`${options.url}/changestatus`, routes.ChangePostulationStatus);
    // Plugin Done
    done();
};
exports.OffersRoutes = OffersRoutes;
