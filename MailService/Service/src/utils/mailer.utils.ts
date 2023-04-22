import nodemailer from 'nodemailer';

export const mailer = async () => {
  let transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    auth: {
      user: "nodems@outlook.es",
      pass: "eufycabpdtlvntas"
    }
  });

  let info = await transporter.sendMail({
    from: 'nodems@outlook.es',
    to: "ethiemalex03@gmail.com",
    subject: "test",
    text: "some testing shit",
    html: "<h1>some testing shieeeettttt</h1>"
  })

  console.log(info.messageId);
  
}