namespace NodensAuth.Models
{
    public class ReadAuthUser
    {
        public string password { get; set; }
        public bool Verified { get; set; }
        public int Id { get; set; }
        public string Role { get; set; }
        public string userName { get; set; }
    }
}
 