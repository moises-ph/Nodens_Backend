import { deleteOffer, disableOffer, getAllOffers, getSingleOffer, postOffer, postulateMusician, changePostulationStatus, getOffersByTag, getPostulatedOffersMusician, getOfferByOrganizer } from '../handlers/offers.handler';
import { validateToken } from "../utils/tokenValidator";
import { IParams, IPostulateMusician, OfferSchema, OfferType, ParamsTypeIdOnly, PostulateMusicianType, BodyPostulationStatusType, IBodyPostulationStatus, IHeadersAuth, IBodyQueryTags, TBodyQueryTags, IParamsAuth, TBodyAuth,  } from '../validations/offers.validation';
import { FastifyInstance, FastifyReply } from "fastify";

const routes = {
  getAllOffers: {
    handler: getAllOffers,
  },
  getOffersByTag : {
    handler : getOffersByTag,
    schema : {
        body : IBodyQueryTags
    }
  },
  getSingleOffer: {
    handler: getSingleOffer,
    schema: {
      params: IParams,
    }
  },
  postOffer: {
    handler: postOffer,
    preHandler: validateToken,
    schema: {
      body: OfferSchema,
    },
  },
  postulateMusician: {
    handler: postulateMusician,
    preHandler: validateToken,
    schema: {
      body: IPostulateMusician,
      params: IParams,
    },
  },
  deleteOffer: {
    handler: deleteOffer,
    preHandler: validateToken,
    schema: {
      params: IParams,
    },
  },
  disableOffer: {
    handler: disableOffer,
    preHandler: validateToken,
    schema: {
      params: IParams,
    },
  },
  ChangePostulationStatus: {
    handler: changePostulationStatus,
    preHandler: validateToken,
    schema: {
      body: IBodyPostulationStatus,
    },
  },
  getPostulatedOffersMusician :{
    handler : getPostulatedOffersMusician,
    preHandler : validateToken
  },
  getOfferByOrganizer : {
    handler : getOfferByOrganizer,
    preHandler : validateToken
  }
};

export const OffersRoutes = (
  fastify: FastifyInstance,
  options: any,
  done: any
) => {
  //This is a Plugin that configures all the routes in Fastify

  // Route for Get All the Offers created by an Organizer, using Auth Token
  fastify.get<{ Params : ParamsTypeIdOnly; Headers : IHeadersAuth }>(`${options.url}/organizer`, routes.getOfferByOrganizer);

  // Route for Get All the Offers that a Musician get postulated
  fastify.get<{ Params : ParamsTypeIdOnly; Headers : IHeadersAuth }>(`${options.url}/musician`, routes.getPostulatedOffersMusician);

  // Route for Get All Offers
  fastify.get(options.url, routes.getAllOffers);

  // Route for get All Offers that match with request body tags
  fastify.put<{ Body : TBodyQueryTags }>(options.url, routes.getOffersByTag);

  // Route for Get Single Offer
  fastify.get<{ Params: ParamsTypeIdOnly }>(`${options.url}/:id`, routes.getSingleOffer );

  // Route for Post a new Offer
  fastify.post<{ Body: OfferType; Headers: IHeadersAuth }>( options.url, routes.postOffer);

  // Route for postulate a Musician to an Offer
  fastify.put<{ Params: ParamsTypeIdOnly; Body: PostulateMusicianType; Headers: IHeadersAuth; }>(`${options.url}/:id`, routes.postulateMusician);

  // Route for delete an Offer
  fastify.delete<{ Params: ParamsTypeIdOnly; Headers: IHeadersAuth }>( `${options.url}/:id`, routes.deleteOffer);

  // Route for disable an Offer
  fastify.patch<{ Params: ParamsTypeIdOnly; Headers: IHeadersAuth }>( `${options.url}/:id`, routes.disableOffer );

  // Route for change Postulation Status
  fastify.patch<{ Body: BodyPostulationStatusType; Headers: IHeadersAuth }>( `${options.url}/changestatus`, routes.ChangePostulationStatus);

  // Plugin Done
  done();
};
