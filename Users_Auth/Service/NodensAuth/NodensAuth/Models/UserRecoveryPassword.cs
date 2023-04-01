using System.ComponentModel.DataAnnotations;

namespace NodensAuth.Models
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
