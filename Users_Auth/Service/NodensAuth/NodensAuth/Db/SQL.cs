using NodensAuth.Models;
using System.Data.SqlClient;
using System.Data;
using BC = BCrypt.Net.BCrypt;

namespace NodensAuth.Db
{
    public class SQL
    {
        private readonly string connectionString;
        public class SQLResult
        {
            public string Message;
            public bool Error;
        }

        public SQL(string conString)
        {
             connectionString = conString;
        }

        public SQLResult CreateUser(RegisterUser user)
        {
            SQLResult result = new SQLResult();
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var cmd = new SqlCommand("SP_CreateUser", connection);
                cmd.Parameters.AddWithValue("Email", user.Email);
                cmd.Parameters.AddWithValue("userName", user.userName);
                cmd.Parameters.AddWithValue("Role", user.Rol);
                cmd.Parameters.AddWithValue("Password", BC.HashPassword(user.Password, 10));
                cmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataReader rd = cmd.ExecuteReader())
                {
                    rd.Read();
                    result.Error = Convert.ToInt32(rd["Error"].ToString()) == 1;
                    result.Message = rd["Message"].ToString();
                    rd.Close();
                }
                connection.Close();
            }
            return result;
        }

        public ReadUser ReadUser(string email)
        {
            SQLResult result = new SQLResult();
            ReadUser user = new ReadUser();
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                SqlCommand cmd = new SqlCommand("SP_ReadUser", connection);
                cmd.Parameters.AddWithValue("Email", email);
                cmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataReader rd = cmd.ExecuteReader())
                {
                    while (rd.Read())
                    {
                        user.userName = rd["userName"].ToString();
                        user.Email = rd["email"].ToString();
                        user.Rol = rd["Role"].ToString();
                        user.Verified = Convert.ToInt16(rd["Verified"]) == 1;
                    }
                    rd.Close();
                }
                connection.Close();
            }
            return user;
        }
    }
}
