using System.ComponentModel.DataAnnotations;

namespace MS_Users_Auth.Models
{
    public class UserRecoveryPassword
    {
        [Required]
        [EmailAddress]
        public string EmailUser { get; set; }

        [Required]
        public int VerifyCode { get; set; }
    }
}
