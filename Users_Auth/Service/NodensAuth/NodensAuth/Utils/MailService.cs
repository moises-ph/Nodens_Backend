using NodensAuth.Validations;
using System.Net.Http.Headers;
using System.Reflection;
using System.Text;
using System.Text.Json;

namespace NodensAuth.Utils
{
    public class MailService
    {
        private readonly string MailURL;
        private readonly HttpClient httpClient = new HttpClient();
        public MailService(string mailurl) 
        {
            MailURL = mailurl;
            httpClient.BaseAddress = new Uri(MailURL);
        }

        private StringContent getJsonContent(MailValidations Object) 
        {
            return new StringContent(JsonSerializer.Serialize<MailValidations>(Object), Encoding.UTF8, "application/json");
        }

        public async Task<HttpResponseMessage> SendRecoveryPassword(MailValidations emailObject)
        {
            try
            {
                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "/mailer/recovery") { Content = getJsonContent(emailObject)};
                HttpResponseMessage response = await httpClient.SendAsync(request);
                return response;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<HttpResponseMessage> SendVerifyEmail(MailValidations mailObject)
        {
            try
            {
                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "/mailer/verify") { Content = getJsonContent(mailObject)};
                HttpResponseMessage response = await httpClient.SendAsync(request);
                return response;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
