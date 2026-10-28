using ClosedXML.Excel;
using LMS.Backend.Data;
using LMS.Backend.DTOs.Domain.Course;
using LMS.Backend.Models.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace LMS.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentController: Controller
    {
        private readonly LmsDbContext _context;
        private readonly IWebHostEnvironment _env;
        public EnrollmentController(LmsDbContext context, IWebHostEnvironment env) {
            this._context = context;
            this._env = env;
        }

        [Authorize(Roles ="Student")]
        [HttpGet("student")]
        public async Task<IActionResult> GetEnrolledCourses()
        {
            var user = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int userId = 0;
            if(string.IsNullOrEmpty(user))
             return BadRequest("Unable to validate the user. please login and retry");

            if (!int.TryParse(user, out userId))
                return BadRequest("Invalid user identifier");

            var Courses =  await this._context.enrollments.Where(e => (e.UserId == userId && e.Course.Status == "Approved"))
                    .Select(e => new
                    {
                        e.Course.CourseId,
                        e.Course.Title,
                        e.Course.Description,
                        e.Course.Syllabus,
                        e.Course.Duration,
                        e.Status,
                        e.PurchaseDate,
                        e.Progress
                    }).ToListAsync();

            return Ok(Courses);
        }

        [Authorize(Roles = "Instructor")]
        [HttpGet("instructor")]
        public async Task<IActionResult> GetEnrollmentData()
        {
            var user = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int userId = 0;
            if (string.IsNullOrEmpty(user))
                return BadRequest("Unable to validate the user. please login and retry");

            if (!int.TryParse(user, out userId))
                return BadRequest("Invalid user identifier");

            var Courses = await this._context.courses.Where(e => (e.Status == "Approved" && e.InstructorId == userId))
                    .Select(e => new
                    {
                        CourseId = e.CourseId,
                        Title = e.Title,
                        totalEnrollment = e.Enrollment.Count()
                    }).ToListAsync();

            return Ok(Courses);
        }

        [Authorize(Roles = "Instructor")]
        [HttpGet("view-students/{courseId}")]
        public async Task<IActionResult> GetEnrolledStudentData(int courseId)
        {
            var user = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int userId = 0;
            if (string.IsNullOrEmpty(user))
                return BadRequest("Unable to validate the user. please login and retry");

            if (!int.TryParse(user, out userId))
                return BadRequest("Invalid user identifier");

            var course = await _context.courses.AnyAsync(e => (e.CourseId == courseId));
            if (!course)
                return BadRequest("Selcted course is invalid"); 

            var Courses = await this._context.enrollments.Where(e => (e.Course.Status == "Approved" && e.Course.InstructorId == userId && e.CourseId == courseId))
                    .Select(e => new
                    {   enrollmentId = e.EnrollmentId,
                        userName = e.User.UserName,
                        email = e.User.Email,
                        purchaseDate = e.PurchaseDate,
                        title = e.Course.Title,
                        progress = e.Progress,
                        status = e.Status
                    }).ToListAsync();

            return Ok(Courses);
        }

        [Authorize(Roles = "Student")]
        [HttpPost]
        public async Task<IActionResult> EnrollInCourse([FromBody] int courseId)
        {
            var user = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int userId = 0;
            if (string.IsNullOrEmpty(user))
                return BadRequest("Unable to validate the user. please login and retry");

            if (!int.TryParse(user, out userId))
                return BadRequest("Invalid user identifier");

            var alreadyEnrolled = await this._context.enrollments.AnyAsync(e => (e.UserId == userId && e.CourseId == courseId));

            if (alreadyEnrolled)
                return Conflict("You are already enrolled in this course.");

            var enrollment = new Enrollment
            {
                UserId = userId,
                CourseId = courseId,
                PurchaseDate = DateTime.UtcNow,
                Status = "Active",
                Progress = 0,
                PaymentStatus = "Paid"
            };

            _context.enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Enrollment successful",
                CourseId = courseId,
                UserId = userId,
                EnrollmentId = enrollment.EnrollmentId
            });
        }


        [HttpGet("export-excel/{courseId}")]
        public async Task<IActionResult> ExportExcel(int courseId)
        {
            var user = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int userId = 0;
            if (string.IsNullOrEmpty(user))
                return BadRequest("Unable to validate the user. please login and retry");

            if (!int.TryParse(user, out userId))
                return BadRequest("Invalid user identifier");

            var course = await _context.courses.AnyAsync(e => (e.CourseId == courseId));
            if (!course)
                return BadRequest("Selcted course is invalid");

            var EnrolledData = await this._context.enrollments.Where(e => (e.Course.Status == "Approved" && e.Course.InstructorId == userId && e.CourseId == courseId))
                    .Select(e => new
                    {
                        userName = e.User.UserName,
                        email = e.User.Email,
                        purchaseDate = e.PurchaseDate,
                        title = e.Course.Title,
                        progress = e.Progress,
                        status = e.Status
                    }).ToListAsync();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Enrolled Students");

            worksheet.Cell(1, 1).Value = "User Name";
            worksheet.Cell(1, 2).Value = "Email";
            worksheet.Cell(1, 3).Value = "Purchase Date";
            worksheet.Cell(1, 4).Value = "Title";
            worksheet.Cell(1, 5).Value = "Progress";
            worksheet.Cell(1, 6).Value = "Status";

            for(int i=0; i< EnrolledData.Count; i++)
            {
                worksheet.Cell(i + 2, 1).Value = EnrolledData[i].userName;
                worksheet.Cell(i + 2, 2).Value = EnrolledData[i].email;
                worksheet.Cell(i + 2, 3).Value = EnrolledData[i].purchaseDate.ToString("yyyy-MM-dd");
                worksheet.Cell(i + 2, 4).Value = EnrolledData[i].title;
                worksheet.Cell(i + 2, 5).Value = EnrolledData[i].progress;
                worksheet.Cell(i + 2, 6).Value = EnrolledData[i].status;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);

            return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Enrollments.xlsx");
        }
    }
}
