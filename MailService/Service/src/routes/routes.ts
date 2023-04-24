import { FastifyInstance } from "fastify";
import { sendMailInApplication } from "../handlers/mailer";
import {ApplicantType, RequestSchemaForApplication} from '../validations/schemas'

const routes = {
  sendApplicant: {
    handler: sendMailInApplication,
    schema: {
      body: RequestSchemaForApplication
    }
  },
  sendOrganizer: {

  },
  verifyEmail: {

  },
  recoveryPassword: {

  }
}

export const MailerRoutes = (fastify: FastifyInstance, options: any, done: any) => {
  fastify.post<{Body: ApplicantType}>(options.url, routes.sendApplicant);
  done()
}