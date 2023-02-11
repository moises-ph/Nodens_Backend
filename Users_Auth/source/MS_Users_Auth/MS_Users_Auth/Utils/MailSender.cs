using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using MS_Users_Auth.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Any;

namespace MS_Users_Auth.Utils
{
    public class MailSender
    {

        IConfiguration configuration;
        public MailSender(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public async Task<ErrorModel> SendEmailGmailAsync(string receptor, string asunto, string mensaje)
        {
            try
            {
                MailMessage mail = new MailMessage();

                string usermail = configuration["usuariogmail"];    
                string passwordmail = configuration["passwordgmail"];

                mail.From = new MailAddress(usermail);
                mail.To.Add(new MailAddress(receptor));
                mail.Subject = asunto;
                mail.Body = mensaje;
                mail.IsBodyHtml = true;
                mail.Priority = MailPriority.High;

                string smtpserver = configuration["hostGmail"];
                int port = Convert.ToInt32(configuration["portGmail"]);
                bool ssl = Convert.ToBoolean(configuration["sslGmail"]);
                bool defaultcredentials = Convert.ToBoolean(configuration["defaultcredentialsGmail"]);

                SmtpClient smtpClient = new SmtpClient();
                smtpClient.Host = smtpserver;
                smtpClient.Port = port;
                smtpClient.EnableSsl = ssl;
                smtpClient.UseDefaultCredentials = false;

                NetworkCredential usercredential = new NetworkCredential(usermail, passwordmail);
                smtpClient.Credentials = usercredential;
                await smtpClient.SendMailAsync(mail);
                return new ErrorModel() {Message = "Correo enviado con exito", Result = true};
            }
            catch(Exception ex)
            {
                return new ErrorModel() { Message = ex.Message, Result = false };
            }
        }

        public void SendEmailOutlook(String receptor, String asunto, String mensaje)
        {
            MailMessage mail = new MailMessage();

            String usermail = this.configuration["usuariooutlook"];
            String passwordmail = this.configuration["passwordoutlook"];

            mail.From = new MailAddress(usermail);
            mail.To.Add(new MailAddress(receptor));
            mail.Subject = asunto;
            mail.Body = mensaje;
            mail.IsBodyHtml = true;
            mail.Priority = MailPriority.Normal;

            String smtpserver = this.configuration["hostoutlook"];
            int port = int.Parse(this.configuration["portoutlook"]);
            bool ssl = bool.Parse(this.configuration["ssloutlook"]);
            bool defaultcreadentials = bool.Parse(this.configuration["defaultcredentialsoutlook"]);

            SmtpClient smtpClient = new SmtpClient();

            smtpClient.Host = smtpserver;
            smtpClient.Port = port;
            smtpClient.EnableSsl = ssl;
            smtpClient.UseDefaultCredentials = defaultcreadentials;


            NetworkCredential usercredential = new NetworkCredential(usermail, passwordmail);

            smtpClient.Credentials = usercredential;
            smtpClient.Send(mail);
        }
    }
}
