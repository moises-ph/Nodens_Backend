using System.ComponentModel.DataAnnotations;

namespace MS_Users_Auth.Models
{
    public class VerifyReqModel
    {
        [Required]
        [EmailAddress]
        public string Result { get; set; }
    }
}
