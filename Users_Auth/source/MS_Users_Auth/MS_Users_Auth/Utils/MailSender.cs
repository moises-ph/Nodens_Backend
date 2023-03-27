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
using RestSharp;
using RestSharp.Authenticators;
using static System.Net.Mime.MediaTypeNames;
using Amazon.Runtime.Internal;

namespace MS_Users_Auth.Utils
{
    public class MailSender
    {
        public class ResModel
        {
            public string? err;
            public RestResponse? response;
        }

        public MailSender()
        {

        }

        public async Task<ResModel> SendEmailAsync(String persona,String receptor, String asunto, String url)
        {
            try
            {
                
                return new ResModel() { response = null };
            }
            catch (Exception ex)
            {
                return new ResModel() { err = ex.Message };
            }
        }
    }
}
