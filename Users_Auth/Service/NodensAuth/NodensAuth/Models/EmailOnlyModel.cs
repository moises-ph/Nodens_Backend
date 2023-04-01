using System.ComponentModel.DataAnnotations;

namespace NodensAuth.Models
{
    public class EmailOnlyModel
    {
        [Required]
        [EmailAddress]
        public string email { get; set; }

    }
}