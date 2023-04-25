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

export type MailerOrganizerType = {
  organizer_mail: string,
  offer_id: string,
  title: string,
  applicant_id: string,
  applicant_name: string,
  applicant_email: string
}

export const mailerForOrganizer = async ({applicant_email, applicant_id, applicant_name, offer_id, organizer_mail, title}:MailerOrganizerType) => {
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
    to: organizer_mail,
    subject: "Aplicacion a oferta",
    text: "Alguien a aplicado a tu oferta",
    html: `<h1>${applicant_email}, ${applicant_name}, ${offer_id}</h1>`
  })
  console.log(info.messageId); 
}

export type MailerForVerifyingType = {
  user_mail: string,
  url: string
}

export const mailerForVerifying = async ({url, user_mail}:MailerForVerifyingType) => {
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
    to: user_mail,
    subject: "Verificar email",
    text: "Verifica el email con el que te registraste",
    html: `<a href="${url}">verify</a>`
  })
  console.log(info.messageId); 
}