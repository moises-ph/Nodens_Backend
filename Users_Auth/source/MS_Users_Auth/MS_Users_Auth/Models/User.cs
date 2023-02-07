namespace MS_Users_Auth.Models
{
    public class User
    {
        public int? Id { get; set; }
        public string Email { get; set; }
        public string First_Name { get; set; }
        public string? Second_Name { get; set; }
        public string First_Lastname { get; set; }
        public string? Second_Lastname { get; set; }
        public string Rol { get; set; }
        public string Department { get; set; }
        public string City { get; set; }
        public DateTime Birthdate { get; set; }
    }
} 
