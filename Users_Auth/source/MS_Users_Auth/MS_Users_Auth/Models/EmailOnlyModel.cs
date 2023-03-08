using System.ComponentModel.DataAnnotations;

namespace MS_Users_Auth.Models
{
    public class EmailOnlyModel
    {
        [Required]
        [EmailAddress]
        public string email { get; set; }
    }
}
