using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Backend.Models.Audit
{
    public class GeneralAudit
    {
        [Key]
        public int AuditId { get; set; }
        public string EntityName { get; set; }
        [ForeignKey("Course")]
        public int EntityId { get; set; }
        public string Action { get; set; }
        public string ChangedData { get; set; }
        [ForeignKey("User")]
        public int ModifiedBy { get; set; }
        public DateTime ModifiedAt { get; set; } = DateTime.Now;
    }
}
