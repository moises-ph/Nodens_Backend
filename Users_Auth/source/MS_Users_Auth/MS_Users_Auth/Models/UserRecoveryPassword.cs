namespace MS_Users_Auth.Models
{
    public class UserRecoveryPassword
    {
        public string EmailUser { get; set; }
        public int VerifyCode { get; set; }
    }
}
