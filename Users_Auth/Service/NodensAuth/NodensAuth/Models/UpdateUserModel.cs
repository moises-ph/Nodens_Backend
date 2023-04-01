using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace NodensAuth.Models
{
    public class UpdateUserModel
    {
        [Required]
        [AllowNull]
        public string Name { get; set; }

        [Required]
        [AllowNull]
        public string Lastname { get; set; }

        [Required]
        [AllowNull]
        [EmailAddress]
        public string OldEmail { get; set; }

        [AllowNull]
        [EmailAddress]
        public string? NewEmail { get; set; }

    }
}
