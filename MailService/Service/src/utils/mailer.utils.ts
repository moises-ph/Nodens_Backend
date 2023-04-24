import nodemailer from 'nodemailer';
import {EMAIL, PASSWORD} from '../config/config'
import { templateForApplication } from '../templates/templates';

export type MailerApplicantType = {
  applicant_email: string,
  applicant_name: string,
  offer_id: string,
  title: string,
  organizer_id: string,
  organizer_name?: string
  enterprise_name?: string
}

export const mailerForApplication = async ({applicant_email, applicant_name, offer_id, title, organizer_id, enterprise_name = '', organizer_name= ''}:MailerApplicantType) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    auth: {
      user: EMAIL,
      pass: PASSWORD
    }
  });

  let info = await transporter.sendMail({
    from: EMAIL,
    to: applicant_email,
    subject: "Aplicacion a oferta",
    text: "Aplicado correctamente",
    html: templateForApplication({applicant_name, enterprise_name, organizer_name, title})
  })

  console.log(info.messageId);
  
}