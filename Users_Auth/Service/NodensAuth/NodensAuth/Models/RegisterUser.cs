using NodensAuth.Validations;
using System.ComponentModel.DataAnnotations;

namespace NodensAuth.Models
{
    public class RegisterUser
    {

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [StringLength(50)]
        public string userName { get; set; }

        [Required]
        [StringLength(9)]
        [CustomValidationRol("Musician", "Organizer", ErrorMessage = "Rol no válido")]
        public string Rol { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "La contraseña debe ser de al menos ocho carácteres")]
        [StringLength(50)]
        public string Password { get; set; }
    }
}
