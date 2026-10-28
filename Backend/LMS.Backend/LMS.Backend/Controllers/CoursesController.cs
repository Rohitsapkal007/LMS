using FluentValidation;
using FluentValidation.TestHelper;
using LMS.Backend.Data;
using LMS.Backend.DTOs.Domain.Course;
using LMS.Backend.Models.Audit;
using LMS.Backend.Models.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Connections.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Routing.Constraints;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Identity.Client;
using System.Net.NetworkInformation;
using System.Security.Claims;
using System.Text.Json;
using LMS.Backend.Helpers;

namespace LMS.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : Controller
    {
        private readonly LmsDbContext _context;
        private readonly IWebHostEnvironment _env;
        List<string> statuses = new List<string> { "Draft", "Pending", "Approved", "Rejected", "Deactivated" };
        public CoursesController(LmsDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetCourses()
        {
            var courses = await _context.courses.ToListAsync();

            if (courses == null)
            {
                return NotFound();
            }

            return Ok(courses);
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpGet("courses")]
        public async Task<IActionResult> GetCoursesByStatus([FromQuery] string? status)
        {
            if (!statuses.Contains(status))
                return BadRequest(status + " is not a valid Status");

            var courses = await _context.courses.Where(c => (c.Status == status))
                .Select(c => new
                {
                    c.CourseId,
                    c.Title,
                    c.Description,
                    c.Syllabus,
                    InstructorUserName = c.Instructor.UserName,
                    InstructorEmail = c.Instructor.Email,
                    c.InstructorId,
                    c.Status,
                    c.Credits,
                    c.EnrollmentLimit,
                    c.Visibility,
                    c.Category,
                    c.Level,
                    c.Duration,
                    c.Language,
                    c.ThumbnailUrl,
                    c.Prerequisites,
                    c.LearningObjectives,
                    c.TargetAudience,
                    c.CreatedAt,
                    c.UpdatedAt
                })
                .ToListAsync();

            return Ok(courses);
        }

        [Authorize(Roles = "Instructor")]
        [HttpGet("instructor-courses")]
        public async Task<IActionResult> GetInstructorCourseByStatus([FromQuery] string? status)
        {
            if (!statuses.Contains(status))
                return BadRequest(status + " is not a valid status");

            string user = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(user))
                return BadRequest("Invalid User");
            int userId = int.Parse(user);

            var courses = await _context.courses.Where(c => (c.InstructorId == userId && c.Status == status)).
                Select(c => new
                {
                    c.CourseId,
                    c.Title,
                    c.Description,
                    c.Syllabus,
                    InstructorUserName = c.Instructor.UserName,
                    InstructorEmail = c.Instructor.Email,
                    c.InstructorId,
                    c.Status,
                    c.Credits,
                    c.EnrollmentLimit,
                    c.Visibility,
                    c.Category,
                    c.Level,
                    c.Duration,
                    c.Language,
                    c.ThumbnailUrl,
                    c.Prerequisites,
                    c.LearningObjectives,
                    c.TargetAudience,
                    c.CreatedAt,
                    c.UpdatedAt
                }).ToListAsync();

            return Ok(courses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourse(int id)
        {
            var course = await _context.courses.FindAsync(id);

            if (course == null)
            {
                return NotFound();
            }

            return Ok(course);
        }

        [Authorize(Roles = "Instructor,Admin,SuperAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, [FromForm] CourseDto updatedCourse, IFormFile thumbnail)
        {
            string thumbnailUrl = string.Empty;

            object ChangedData = new { };
            if (id != updatedCourse.courseId)
                return BadRequest("Course id is Mismatched");

            var user = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            if (string.IsNullOrEmpty(user))
                return Unauthorized("User ID not found in token. Please relogin");
            if (string.IsNullOrEmpty(userRole))
                return Unauthorized("Role not found in token. Please relogin");

            int userId = int.Parse(user);

            if (userRole == "Instructor" && userId != updatedCourse.instructorId)
                return Forbid("You cannot edit another instructor's course.");

            var course = await _context.courses.FindAsync(id);

            if (course == null)
                return NotFound();

            if (thumbnail != null && thumbnail.Length > 0)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "courses", "thumbnails");
                Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(thumbnail.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await thumbnail.CopyToAsync(stream);
                }

                thumbnailUrl = $"/images/courses/thumbnails/{fileName}";
            }



            if (statuses.Contains(course.Status))
            {
                if (course.Status == "Pending")
                {
                    if (StringHelper.Normalize(course.Title) != StringHelper.Normalize(updatedCourse.title)
                        || StringHelper.Normalize(course.Syllabus) != StringHelper.Normalize(updatedCourse.syllabus)
                        || course.EnrollmentLimit != updatedCourse.enrollmentLimit
                        || course.Visibility != updatedCourse.visibility
                        || StringHelper.Normalize(course.Category) != StringHelper.Normalize(updatedCourse.category)
                        || StringHelper.Normalize(course.Level) != StringHelper.Normalize(updatedCourse.level))

                        return BadRequest("Editing Title, Syllabus, EnrollmentLimit, Visibility, Category and Level is not allowed in Pending phase");

                    course.Description = updatedCourse.description;
                    course.Duration = updatedCourse.duration;
                    course.Language = updatedCourse.language;
                    course.ThumbnailUrl = thumbnailUrl;
                    course.Prerequisites = updatedCourse.prerequisites;
                    course.LearningObjectives = updatedCourse.learningObjectives;
                    course.TargetAudience = updatedCourse.targetAudience;
                    course.UpdatedAt = DateTime.UtcNow;

                    ChangedData = new
                    {
                        Description = updatedCourse.description,
                        Duration = updatedCourse.duration,
                        Language = updatedCourse.language,
                        ThumbnailUrl = thumbnailUrl,
                        Prerequisites = updatedCourse.prerequisites,
                        LearningObjectives = updatedCourse.learningObjectives,
                        TargetAudience = updatedCourse.targetAudience,
                        UpdatedAt = DateTime.UtcNow
                    };


                }
                else if (course.Status == "Approved")
                {
                    if (StringHelper.Normalize(course.Title) != StringHelper.Normalize(updatedCourse.title)
                        || StringHelper.Normalize(course.Syllabus) != StringHelper.Normalize(updatedCourse.syllabus)
                        || course.EnrollmentLimit != updatedCourse.enrollmentLimit
                        || course.Visibility != updatedCourse.visibility
                        || StringHelper.Normalize(course.Category) != StringHelper.Normalize(updatedCourse.category)
                        || StringHelper.Normalize(course.Level) != StringHelper.Normalize(updatedCourse.level)
                        || course.Duration != updatedCourse.duration
                        || StringHelper.Normalize(course.Prerequisites) != StringHelper.Normalize(updatedCourse.prerequisites)
                        || StringHelper.Normalize(course.LearningObjectives) != StringHelper.Normalize(updatedCourse.learningObjectives)
                        || StringHelper.Normalize(course.TargetAudience) != StringHelper.Normalize(updatedCourse.targetAudience))
                        return BadRequest("Editing Title, Syllabus, EnrollmentLimit, Visibility, Category, Level, Duration, Prerequisites, LearningObjectives and TargetAudience is not allowed in Approved Phase.");

                    course.Description = updatedCourse.description;
                    course.Language = updatedCourse.language;
                    course.ThumbnailUrl = thumbnailUrl;
                    course.UpdatedAt = DateTime.UtcNow;

                    ChangedData = new
                    {
                        Description = updatedCourse.description,
                        Language = updatedCourse.language,
                        ThumbnailUrl = thumbnailUrl,
                        UpdatedAt = DateTime.UtcNow
                    };

                }
                else if (course.Status == "Draft" || course.Status == "Pending")
                {
                    course.Title = updatedCourse.title;
                    course.Description = updatedCourse.description;
                    course.Syllabus = updatedCourse.syllabus;
                    course.EnrollmentLimit = updatedCourse.enrollmentLimit;
                    course.Visibility = updatedCourse.visibility;
                    course.Category = updatedCourse.category;
                    course.Level = updatedCourse.level;
                    course.Duration = updatedCourse.duration;
                    course.Language = updatedCourse.language;
                    course.ThumbnailUrl = thumbnailUrl;
                    course.Prerequisites = updatedCourse.prerequisites;
                    course.LearningObjectives = updatedCourse.learningObjectives;
                    course.TargetAudience = updatedCourse.targetAudience;
                    course.UpdatedAt = DateTime.UtcNow;

                    ChangedData = new
                    {
                        Title = updatedCourse.title,
                        Description = updatedCourse.description,
                        Syllabus = updatedCourse.syllabus,
                        EnrollmentLimit = updatedCourse.enrollmentLimit,
                        Visibility = updatedCourse.visibility,
                        Category = updatedCourse.category,
                        Level = updatedCourse.level,
                        Duration = updatedCourse.duration,
                        Language = updatedCourse.language,
                        ThumbnailUrl = thumbnailUrl,
                        Prerequisites = updatedCourse.prerequisites,
                        LearningObjectives = updatedCourse.learningObjectives,
                        TargetAudience = updatedCourse.targetAudience,
                        UpdatedAt = DateTime.UtcNow
                    };
                }
            }
            else
            {
                return BadRequest($"Recieved Status is not valid: {course.Status}");
            }

            var audit = new GeneralAudit
            {
                EntityName = "Course",
                EntityId = course.CourseId,
                Action = "Update",
                ChangedData = JsonSerializer.Serialize(ChangedData),
                ModifiedBy = userId,
                ModifiedAt = DateTime.UtcNow
            };
            _context.generalAudit.Add(audit);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.courses.Any(u => u.CourseId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [Authorize(Roles = "Instructor")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.courses.FindAsync(id);

            if (course == null) { return NotFound(); }

            _context.courses.Remove(course);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Instructor")]
        [HttpPost]
        public async Task<IActionResult> AddCourse([FromForm] CourseDto course, IFormFile thumbnail, [FromServices] IValidator<CourseDto> validator)
        {
            string thumbnailUrl = string.Empty;
            var result = validator.Validate(course);

            if (!result.IsValid)
            {
                var errValidator = result.Errors.Select(e => e.ErrorMessage).ToList();
                if (errValidator.Any())
                {
                    return BadRequest(string.Join(", ", errValidator));
                }
            }

            if (!statuses.Contains(course.status))
                return BadRequest("Status is not valid");
            else if (course.status != "Draft" && course.status != "Pending")
                return BadRequest("only draft and pending status courses are allowed to create");

            var user = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(user))
            {
                return Unauthorized("User ID not found in token.");
            }
            var userId = int.Parse(user);

            if (thumbnail != null && thumbnail.Length > 0)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "courses", "thumbnails");
                Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(thumbnail.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await thumbnail.CopyToAsync(stream);
                }

                thumbnailUrl = $"/images/courses/thumbnails/{fileName}";
            }

            var entity = new Course
            {
                Title = course.title,
                Description = course.description,
                Syllabus = course.syllabus,
                InstructorId = userId,
                Status = course.status,
                Credits = 0,
                EnrollmentLimit = course.enrollmentLimit,
                Visibility = course.visibility,
                Category = course.category,
                Level = course.level,
                Duration = course.duration,
                Language = course.language,
                ThumbnailUrl = thumbnailUrl,
                Prerequisites = course.prerequisites,
                LearningObjectives = course.learningObjectives,
                TargetAudience = course.targetAudience,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.courses.Add(entity);

            var audit = new GeneralAudit
            {
                EntityName = "Course",
                EntityId = course.courseId,
                Action = "Create",
                ChangedData = JsonSerializer.Serialize(entity),
                ModifiedBy = userId,
                ModifiedAt = DateTime.UtcNow
            };

            _context.generalAudit.Add(audit);


            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCourse), new { id = entity.CourseId }, entity);
        }

        [Authorize(Roles = "Instructor")]
        [HttpPatch("{id}/draft")]
        public async Task<IActionResult> UpdateCourseStatustoDraft(int id)
        {
            string status = "Draft";
            var course = await _context.courses.FindAsync(id);
            if (course == null)
                return NotFound();

            course.Status = status;
            course.UpdatedAt = DateTime.UtcNow;

            var audit = new GeneralAudit
            {
                EntityName = "Course",
                EntityId = course.CourseId,
                Action = $"Status changed to {status}",
                ChangedData = $"OldStatus={course.Status}, NewStatus={status}",
                ModifiedBy = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0"),
                ModifiedAt = DateTime.UtcNow
            };
            _context.generalAudit.Add(audit);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Instructor")]
        [HttpPatch("{id}/pending")]
        public async Task<IActionResult> UpdateCourseStatustoPending(int id)
        {
            string status = "Pending";
            var course = await _context.courses.FindAsync(id);
            if (course == null)
                return NotFound();

            course.Status = status;
            course.UpdatedAt = DateTime.UtcNow;

            var audit = new GeneralAudit
            {
                EntityName = "Course",
                EntityId = course.CourseId,
                Action = $"Status changed to {status}",
                ChangedData = $"OldStatus={course.Status}, NewStatus={status}",
                ModifiedBy = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0"),
                ModifiedAt = DateTime.UtcNow
            };
            _context.generalAudit.Add(audit);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin,SuperAdmin,Instructor")]
        [HttpPatch("{id}/approve")]
        public async Task<IActionResult> UpdateCourseStatustoApproved(int id)
        {
            string status = "Approved";
            var course = await _context.courses.FindAsync(id);
            if (course == null)
                return NotFound();

            var user = User.FindFirstValue(ClaimTypes.Role);

            if (string.IsNullOrEmpty(user))
            {
                return Unauthorized("User ID not found in token.");
            }
            else if (user == "Instructor" && course.Status != "Deactivated")
            {
                return Unauthorized("User has no permission to change the status to Approved");
            }

            course.Status = status;
            course.UpdatedAt = DateTime.UtcNow;

            var audit = new GeneralAudit
            {
                EntityName = "Course",
                EntityId = course.CourseId,
                Action = $"Status changed to {status}",
                ChangedData = $"OldStatus={course.Status}, NewStatus={status}",
                ModifiedBy = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0"),
                ModifiedAt = DateTime.UtcNow
            };
            _context.generalAudit.Add(audit);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPatch("{id}/reject")]
        public async Task<IActionResult> UpdateCourseStatustoReject(int id)
        {
            string status = "Rejected";
            var course = await _context.courses.FindAsync(id);
            if (course == null)
                return NotFound();

            course.Status = status;
            course.UpdatedAt = DateTime.UtcNow;

            var audit = new GeneralAudit
            {
                EntityName = "Course",
                EntityId = course.CourseId,
                Action = $"Status changed to {status}",
                ChangedData = $"OldStatus={course.Status}, NewStatus={status}",
                ModifiedBy = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0"),
                ModifiedAt = DateTime.UtcNow
            };
            _context.generalAudit.Add(audit);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin,SuperAdmin,Instructor")]
        [HttpPatch("{id}/deactive")]
        public async Task<IActionResult> UpdateCourseStatustoDeactivate(int id)
        {
            string status = "Deactivated";
            var course = await _context.courses.FindAsync(id);
            if (course == null)
                return NotFound();

            course.Status = status;
            course.UpdatedAt = DateTime.UtcNow;

            var audit = new GeneralAudit
            {
                EntityName = "Course",
                EntityId = course.CourseId,
                Action = $"Status changed to {status}",
                ChangedData = $"OldStatus={course.Status}, NewStatus={status}",
                ModifiedBy = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0"),
                ModifiedAt = DateTime.UtcNow
            };
            _context.generalAudit.Add(audit);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Instructor")]
        [HttpPost("{courseid}/videos")]
        public async Task<IActionResult> UploadVideo(int courseid, [FromForm] string title, [FromForm] IFormFile video)
        {
            return Ok();
        }
    }
}
