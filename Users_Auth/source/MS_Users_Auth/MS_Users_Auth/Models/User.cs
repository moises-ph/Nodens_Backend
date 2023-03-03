using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace MS_Users_Auth.Models
{
    public class User
    {
        public int? Id { get; set; }

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
        public string Rol { get; set; }

        [Required] 
        [StringLength(50)]
        public string Password { get; set; }
    }
} 
