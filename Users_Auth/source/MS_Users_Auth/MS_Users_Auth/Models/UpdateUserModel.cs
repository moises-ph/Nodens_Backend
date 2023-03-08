using MS_Users_Auth.Validations;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;


namespace MS_Users_Auth.Models
{
    public class UpdateUserModel
    {
        [Required]
        [AllowNull]
        public string Name { get; set;}

        [Required]
        [AllowNull]
        public string Lastname { get; set;}
        
        [Required]
        [AllowNull]
        [EmailAddress]
        public string OldEmail { get; set;}

        [AllowNull]
        [EmailAddress]
        public string? NewEmail { get; set;}

    }
}
