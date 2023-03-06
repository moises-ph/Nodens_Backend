using MS_Users_Auth.Validations;
using System.ComponentModel.DataAnnotations;

namespace MS_Users_Auth.Models
{
    public class ReadUser
    {

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
        public string Lastname { get; set; }

        [Required]
        [StringLength(9)]
        [CustomValidationRol("Musician", "Organizer", ErrorMessage = "Rol no válido")]
        public string Rol { get; set; }

        public bool? Verified { get; set; }
    }
}
