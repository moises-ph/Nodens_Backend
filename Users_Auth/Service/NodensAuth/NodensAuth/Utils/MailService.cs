using NodensAuth.Validations;
using System.Reflection;

namespace NodensAuth.Utils
{
    public class MailService
    {
        private readonly string MailURL;
        private static readonly HttpClient client = new HttpClient();
        public MailService(string mailurl) 
        {
            MailURL = mailurl;
        }

        public async Task<HttpResponseMessage> SendRecoveryPassword(MailValidations emailObject)
        {
            try
            {
                Dictionary<string, string> dic = emailObject.GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public).ToDictionary(prop => prop.Name, prop => (string)prop.GetValue(emailObject, null));
                FormUrlEncodedContent body = new FormUrlEncodedContent(dic);

                HttpResponseMessage response = await client.PostAsync(MailURL, body);
                return response;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
