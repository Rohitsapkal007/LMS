using FluentValidation;

namespace LMS.Backend.DTOs.Domain.Course
{
    public class CourseDto
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

    public class CourseValidator : AbstractValidator<CourseDto>
    {
        public CourseValidator()
        {
            RuleFor(c => c.title)
                .NotEmpty().WithMessage("Title is required.")
            .MinimumLength(3).WithMessage("Title must be at least 3 characters.")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");

            RuleFor(c => c.description)
                .NotEmpty().WithMessage("Description is required.")
            .MinimumLength(20).WithMessage("Description must be at least 20 characters.")
            .MaximumLength(10000).WithMessage("Description cannot exceed 10,000 characters.");

            RuleFor(c => c.syllabus)
            .NotEmpty().WithMessage("Syllabus is required.")
            .MinimumLength(50).WithMessage("Syllabus must be at least 50 characters.")
            .MaximumLength(5000).WithMessage("Syllabus cannot exceed 5,000 characters.");

            RuleFor(c => c.enrollmentLimit)
                .NotEmpty().WithMessage("Enrollment limit is required.")
                .GreaterThan(0).WithMessage("Enrollment limit must be a positive integer.");

            RuleFor(c => c.category)
                .NotEmpty().WithMessage("Category is required.");

            RuleFor(c => c.visibility)
                .NotEmpty().WithMessage("Visibility is required.");

            RuleFor(c => c.level)
                .NotEmpty().WithMessage("Level is required.");

            RuleFor(c => c.duration)
                .NotEmpty().WithMessage("Duration is required.")
                .GreaterThan(1).WithMessage("Duration must be greater than 1.");

            RuleFor(c => c.language)
                .NotEmpty().WithMessage("Language is required.");

            RuleFor(c => c.prerequisites)
                .MaximumLength(500).WithMessage("Prerequisites cannot exceed 500 characters.");

            RuleFor(c => c.learningObjectives)
                .MaximumLength(5000).WithMessage("Learning objectives cannot exceed 5,000 characters.");

            RuleFor(c => c.targetAudience)
                .NotEmpty().WithMessage("Target audience is required.");
        }
    }
}
