using Microsoft.AspNetCore.Identity;

namespace LMS.Backend.Data
{
    public class RoleSeeder
    {
        public static async Task SeedRoles(RoleManager<IdentityRole<int>> roleManager)
        {
            string[] roles = { "Student", "Instructor", "Admin", "SuperAdmin"};

            foreach(var role in roles)
            {
                if(!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole<int>(role));
                }
            }
        }
    }
}
