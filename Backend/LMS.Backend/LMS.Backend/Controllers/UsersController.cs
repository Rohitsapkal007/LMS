using LMS.Backend.DTOs.Domain.User;
using LMS.Backend.Models.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly UserManager<User> _userManager;

        public UsersController(UserManager<User> userManager) {
            _userManager = userManager;
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.Where(u => (u.Role != "Admin" && u.Role != "SuperAdmin")).ToListAsync();

            if (users == null)
                return NotFound("No Users Found");

            return Ok(users);
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());

            if(user == null)
                return NotFound("No User Found");

            return Ok(user);
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User updatedUser)
        {
            if (id != updatedUser.Id)
                return BadRequest("User Id Mismatch");

            var user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null) return NotFound();

            user.UserName = updatedUser.UserName;
            user.Email = updatedUser.Email;
            user.Role = updatedUser.Role;
            user.IsActive = updatedUser.IsActive;

            var result = await _userManager.UpdateAsync(user);

            if(!result.Succeeded)
                return BadRequest(result.Errors);

            return NoContent();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());

            if(user == null) return NotFound();

            var result = await _userManager.DeleteAsync(user);
            if(!result.Succeeded)
                return BadRequest(result.Errors);

            return NoContent();
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPut("manage-users")]
        public async Task<IActionResult> ManageUsers(List<BulkUpdateUserDto> bulkUpdateDto)
        {
            var allowedRoles = new[] { "Student", "Instructor" };
            foreach(var update in bulkUpdateDto)
            {
                if(!allowedRoles.Contains(update.role))
                {
                    return BadRequest("Invalid role Selection");
                }

                var user = await _userManager.FindByIdAsync((update.id).ToString());

                if (user == null) continue;

                if (!string.IsNullOrEmpty(update.role)) { user.Role = update.role; }
                if(!string.IsNullOrEmpty(update.isActive.ToString())) user.IsActive = update.isActive;

                await _userManager.UpdateAsync(user);
            }

            return NoContent();
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPut("manage-admin")]
        public async Task<IActionResult> BulkUpdateUser(List<BulkUpdateUserDto> bulkUpdateDto)
        {
            foreach (var update in bulkUpdateDto)
            {
                var user = await _userManager.FindByIdAsync((update.id).ToString());

                if (user == null) continue;

                if (!string.IsNullOrEmpty(update.role)) { user.Role = update.role; }
                if (!string.IsNullOrEmpty(update.isActive.ToString())) user.IsActive = update.isActive;

                await _userManager.UpdateAsync(user);
            }

            return NoContent();
        }
    }
}
