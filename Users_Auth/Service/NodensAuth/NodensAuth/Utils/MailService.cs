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
        public MailService(string mailurl) 
        {
            MailURL = mailurl;
        }

        public async Task<HttpResponseMessage> SendRecoveryPassword(MailValidations emailObject)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(MailURL);
                var request = new HttpRequestMessage(HttpMethod.Post, "/mailer/recovery");
                string dic = JsonSerializer.Serialize<MailValidations>(emailObject);
                request.Content = new StringContent(dic, Encoding.UTF8, "application/json");
                var response = await client.SendAsync(request);
                return response;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
