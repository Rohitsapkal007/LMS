namespace LMS.Backend.DTOs.Domain.Course
{
    public class CourseEnrollmentDto
    {
        public int courseId { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string syllabus { get; set; }
        public int instructorId { get; set; }
        public string status { get; set; }
        public int? enrollmentLimit { get; set; }
        public string visibility { get; set; }
        public string? category { get; set; }
        public string? level { get; set; }
        public int? duration { get; set; }
        public string? language { get; set; }
        public string? prerequisites { get; set; }
        public string? learningObjectives { get; set; }
        public string? targetAudience { get; set; }
    }
}
