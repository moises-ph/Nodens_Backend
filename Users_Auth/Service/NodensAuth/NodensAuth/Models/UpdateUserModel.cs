using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace NodensAuth.Models
{
    public class UpdateUserModel
    {
        [Required]
        [AllowNull]
        public string userName { get; set; }

        [Required]
        [EmailAddress]
        public string OldEmail { get; set; }

        [EmailAddress]
        public string? NewEmail { get; set; }

    }
}
