import { FastifyInstance } from "fastify";
import { sendMailForRecovery, sendMailForVerifying, sendMailInApplication, sendMailToOrganizer } from "../handlers/mailer";
import {ApplicantType, EmailOrPassType, OrganizerType, RequestSchemaForApplication, RequestSchemaForEmailVerificationAndChangePassWord, RequestSchemaForOrganizer} from '../validations/schemas'

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
    handler: sendMailForVerifying,
    schema: {
      body: RequestSchemaForEmailVerificationAndChangePassWord
    }

  },
  recoveryPassword: {
    handler: sendMailForRecovery,
    schema: {
      body: RequestSchemaForEmailVerificationAndChangePassWord
    }
  }
}

export const MailerRoutes = (fastify: FastifyInstance, options: any, done: any) => {
  fastify.post<{Body: ApplicantType}>(options.url, routes.sendApplicant);
  fastify.post<{Body: OrganizerType}>(`${options.url}/organizer`, routes.sendOrganizer);
  fastify.post<{Body: EmailOrPassType}>(`${options.url}/verify`, routes.verifyEmail);
  fastify.post<{Body: EmailOrPassType}>(`${options.url}/recovery`, routes.recoveryPassword)
  done()
}