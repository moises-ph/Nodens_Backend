import { FastifyInstance } from "fastify";
import { sendMailInApplication, sendMailToOrganizer } from "../handlers/mailer";
import {ApplicantType, OrganizerType, RequestSchemaForApplication, RequestSchemaForOrganizer} from '../validations/schemas'

const routes = {
  sendApplicant: {
    handler: sendMailInApplication,
    schema: {
      body: RequestSchemaForApplication
    }
  },
  sendOrganizer: {
    handler: sendMailToOrganizer,
    schema: {
      body: RequestSchemaForOrganizer
    }
  },
  verifyEmail: {

  },
  recoveryPassword: {

  }
}

export const MailerRoutes = (fastify: FastifyInstance, options: any, done: any) => {
  fastify.post<{Body: ApplicantType}>(options.url, routes.sendApplicant);
  fastify.post<{Body: OrganizerType}>(`${options.url}/organizer`, routes.sendOrganizer);
  done()
}