using System.ComponentModel.DataAnnotations;

namespace NodensAuth.Models
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

    public class Reset_Pass
    {
        [Required]
        [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 carácteres")]
        public string? Password { get; set; }
    }
}
