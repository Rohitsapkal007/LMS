using LMS.Backend.Models.Audit;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Identity.Client;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Backend.Models.Domain
{
    public class Course
    {
        public int CourseId { get; set; }

        [MaxLength(200)]
        public string Title { get; set; }

        [MaxLength(10000)]
        public string Description { get; set; }

        [MaxLength(5000)]
        public string Syllabus { get; set; }

        [ForeignKey("Instructor")]
        public int InstructorId { get; set; }
        public User Instructor {  get; set; }
        [MaxLength(20)]
        public string Status {  get; set; }

        public int? Credits { get; set; }
        public int? EnrollmentLimit { get; set; }
        public string Visibility { get; set; } = "Public";

        [MaxLength(100)]
        public string? Category { get; set; }
        [MaxLength(50)]
        public string? Level { get; set; }
        public int? Duration { get; set; }
        [MaxLength(50)]
        public string? Language { get; set; }

        [MaxLength(250)]
        public string? ThumbnailUrl { get; set; }
        [MaxLength(500)]
        public string? Prerequisites { get; set; }
        [MaxLength(5000)]
        public string? LearningObjectives { get; set; }
        [MaxLength(100)]
        public string? TargetAudience { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public ICollection<GeneralAudit> GeneralAudit { get; set; }
        public ICollection<Enrollment> Enrollment { get; set; }
    }
}
