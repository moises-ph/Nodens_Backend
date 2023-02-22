using System.ComponentModel.DataAnnotations;

namespace MS_Users_Auth.Models
{
    public class Auth_User
    {
        [EmailAddress(ErrorMessage = "Ingrese un email válido")]
        [Required]
        public string? Email { get; set; }


        [Required]
        [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 carácteres")]
        public string? Password { get; set; }
    }
}