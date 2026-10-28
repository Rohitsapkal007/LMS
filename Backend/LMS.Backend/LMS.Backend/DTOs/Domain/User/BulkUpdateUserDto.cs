namespace LMS.Backend.DTOs.Domain.User
{
    public class BulkUpdateUserDto
    {
        public int id { get; set; }
        public string role { get; set; }
        public bool isActive { get; set; }
    }
}
