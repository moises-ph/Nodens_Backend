﻿using MS_Users_Auth.Validations;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace MS_Users_Auth.Models
{
    public class RegisterUser
    {

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

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

        [Required]
        [MinLength(8, ErrorMessage = "La contraseña debe ser de al menos ocho carácteres")]
        [StringLength(50)]
        public string Password { get; set; }
    }
} 
