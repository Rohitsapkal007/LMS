using LMS.Backend.Models.Audit;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace LMS.Backend.Models.Domain
{
    public class User : IdentityUser<int>
    {
        [MaxLength(150)]
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool IsActive { get; set; }
        ICollection<Course> Course { get; set; }
        ICollection<GeneralAudit> GeneralAudit { get; set; }
        public ICollection<Enrollment> Enrollment { get; set; }
    }
}
