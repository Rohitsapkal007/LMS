namespace LMS.Backend.Helpers
{
    public class StringHelper
    {
        public static string? Normalize(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ||
                   value.Equals("null", StringComparison.OrdinalIgnoreCase)
                ? null
                : value.Replace("\r\n", "\n").Replace("\r", "\n").Trim();
        }
    }
}
