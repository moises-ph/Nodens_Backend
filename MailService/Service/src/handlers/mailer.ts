import { FastifyRequest, FastifyReply } from 'fastify'
import { ApplicantType, OrganizerType } from '../validations/schemas'
import { MailerApplicantType, MailerOrganizerType, mailerForApplication, mailerForOrganizer } from '../utils/mailer.utils'

type ApplicationRequest = FastifyRequest<{Body: ApplicantType}>

export const sendMailInApplication = async (req: ApplicationRequest, res: FastifyReply) => {
  try {
    const { OfferID, ReceiverName,OfferTitle, OrganizerId, ReceiverEmail, EntrepriseName, OrganizerName } = req.body;
    const args: MailerApplicantType = {
      applicant_email: ReceiverEmail,
      applicant_name: ReceiverName,
      offer_id: OfferID, 
      organizer_id: OrganizerId,
      title: OfferTitle,
      enterprise_name: EntrepriseName || '',
      organizer_name: OrganizerName || ''
    }
    mailerForApplication(args);
    return res.code(200).send({message: "Aplicacion correcta"});
  } 
  catch(err) {
    return res.code(500).send(err);
  }
}

type OrganizerRequest = FastifyRequest<{Body: OrganizerType}>

export const sendMailToOrganizer = async (req: OrganizerRequest, res: FastifyReply) => {
  try {
    const { ApplicantEmail, ApplicantId, ApplicantName, OfferID, OfferTitle, ReceiverEmail } = req.body;
    const args:MailerOrganizerType = {
      applicant_email: ApplicantEmail,
      applicant_id: ApplicantId,
      applicant_name: ApplicantName,
      offer_id: OfferID,
      organizer_mail: ReceiverEmail,
      title: OfferTitle
    };
    mailerForOrganizer(args);
    return res.code(200).send({message: "Alguien a aplicado a tu oferta de empleo"});
  }
  catch (err) {
    return res.code(500).send(err);
  }
}