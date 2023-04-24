import { FastifyRequest, FastifyReply } from 'fastify'
import { ApplicantType } from '../validations/schemas'
import { MailerApplicantType, mailerForApplication } from '../utils/mailer.utils'

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
    return res.code(200).send({message: "Aplicacion correcta"})
  } 
  catch(err) {
    return res.code(500).send(err);
  }
}