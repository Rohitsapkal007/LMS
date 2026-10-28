using LMS.Backend.Data;
using LMS.Backend.Models.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS.Backend.DTOs.Auth;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Identity.Client;
using Microsoft.AspNetCore.Mvc.DataAnnotations;

namespace LMS.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        public readonly LmsDbContext _context;
        public readonly UserManager<User> _userManager;
        public readonly IConfiguration _config;

        public AuthController(LmsDbContext context, UserManager<User> userManager, IConfiguration config)
        {
            _context = context;
            _userManager = userManager;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> AddUser(RegisterDto userDto)
        {
            var allowedRoles = new[] { "Student", "Instructor" };

            if (userDto == null)
                return BadRequest("user data is required");
            else if (!allowedRoles.Contains(userDto.Role))
                return BadRequest("Invalid role Selection");

            var user = new User
            {
                UserName = userDto.Username,
                Email = userDto.Email,
                Role = userDto.Role,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, userDto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e=>e.Description));

            await _userManager.AddToRoleAsync(user, userDto.Role);

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            var passwordCheck = await _userManager.CheckPasswordAsync(user, model.Password);
            if (user != null && passwordCheck)
            {
                var authclaims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

                var token = new JwtSecurityToken(
                    issuer: _config["Jwt:Issuer"],
                    audience: _config["Jwt:Audience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authclaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });
            }
            return Unauthorized(); 
        }
    }
}
