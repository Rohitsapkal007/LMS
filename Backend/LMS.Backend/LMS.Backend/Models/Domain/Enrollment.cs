using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Backend.Models.Domain
{
    public class Enrollment
    {
        public int EnrollmentId { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("Course")]
        public int CourseId { get; set; }
        public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Active";
        public decimal? Progress { get; set; }
        public DateTime? CompletionDate { get; set; }
        public string PaymentStatus { get; set; } = "Paid";
        public User User { get; set; }
        public Course Course { get; set; }
    }
}
