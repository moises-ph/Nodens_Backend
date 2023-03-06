using MS_Users_Auth.Validations;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;


namespace MS_Users_Auth.Models
{
    public class UpdateUserModel
    {
        [Required]
        public string Name { get; set;}

        [Required]
        public string Lastname { get; set;}
        
        [Required]
        [EmailAddress]
        public string OldEmail { get; set;}

        [AllowNull]
        [EmailAddress]
        public string? NewEmail { get; set;}

    }
}
