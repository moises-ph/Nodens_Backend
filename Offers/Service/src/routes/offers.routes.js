"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffersRoutes = void 0;
const offers_handler_1 = require("../handlers/offers.handler");
const tokenValidator_1 = require("../utils/tokenValidator");
const offers_validation_1 = require("../validations/offers.validation");
const routes = {
    getAllOffers: {
        handler: offers_handler_1.getAllOffers
    },
    postOffer: {
        handler: offers_handler_1.postOffer,
        preHandler: tokenValidator_1.validateToken,
        schema: {
            body: offers_validation_1.OfferSchema
        }
    }
};
const OffersRoutes = (fastify, options, done) => {
    fastify.get(options.url, routes.getAllOffers);
    fastify.post(options.url, routes.postOffer);
    done();
};
exports.OffersRoutes = OffersRoutes;
