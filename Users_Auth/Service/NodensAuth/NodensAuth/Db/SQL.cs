using NodensAuth.Models;
using System.Data;
using System.Data.SqlClient;
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

        public ReadUser? ReadUser(string? parameter)
        {
            SQLResult result = new SQLResult();
            ReadUser? user = new ReadUser();
            using (var connection = new SqlConnection(connectionString))
            {
                int Id;
                connection.Open();
                SqlCommand cmd = new SqlCommand("SP_ReadUser", connection);
                cmd.Parameters.AddWithValue("Email", parameter.Contains('@') ? parameter : DBNull.Value);
                cmd.Parameters.AddWithValue("username", parameter.Contains('@') ? DBNull.Value : parameter);
                cmd.Parameters.AddWithValue("Id", int.TryParse(parameter, out Id) ? Id : DBNull.Value);
                cmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataReader rd = cmd.ExecuteReader())
                {
                    if (!rd.Read())
                    {
                        user = null;
                    }
                    else
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

        public SQLResult UpdateUser(UpdateUserModel upUser)
        {
            SQLResult result = new SQLResult();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                SqlCommand cmd = new SqlCommand("SP_UpdateUser", connection);
                cmd.Parameters.AddWithValue("Email", upUser.OldEmail);
                cmd.Parameters.AddWithValue("newEmail", upUser.NewEmail);
                cmd.Parameters.AddWithValue("userName", upUser.userName);
                cmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        result.Error = Convert.ToInt16(reader["Error"]) == 1;
                        result.Message = reader["Message"].ToString();
                    }
                    reader.Close();
                }
                connection.Close();
            }
            return result;
        }

        public ReadAuthUser? AuthUser(string email)
        {
            ReadAuthUser authUser = new ReadAuthUser();
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var cmd = new SqlCommand("SP_AuthUser", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("Email", email);
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    reader.Read();
                    if (reader["password"] != DBNull.Value)
                    {
                        authUser.password = reader["password"].ToString();
                        authUser.Verified = Convert.ToInt32(reader["Verified"]) == 1;
                        authUser.Id = Convert.ToInt32(reader["id"]);
                        authUser.Role = reader["Role"].ToString();
                        authUser.userName = reader["userName"].ToString();
                    }
                    else
                    {
                        return null;
                    }
                    reader.Close();
                }
                connection.Close();
            }
            return authUser;
        }

        public async Task<SQLResult> ChangePassword(AuthUserReq pass)
        {
            SQLResult result = new SQLResult();
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var cmd = new SqlCommand("SP_ChangePassword", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("Email", pass.Email);
                cmd.Parameters.AddWithValue("Password", BC.HashPassword(pass.Password, 10));
                using (var rd = await cmd.ExecuteReaderAsync())
                {
                    while (rd.Read())
                    {
                        result.Error = Convert.ToInt32(rd["Error"].ToString()) == 1;
                        result.Message = rd["Respuesta"].ToString();
                    }
                    rd.Close();
                }
                connection.Close();
            }
            return result;
        }

        public SQLResult VerifyUser(string email)
        {
            SQLResult result = new SQLResult();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var cmd = new SqlCommand("SP_VerifyUser", connection);
                cmd.Parameters.AddWithValue("Email", email);
                cmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        result.Error = Convert.ToInt32(reader["Error"].ToString()) == 1;
                        result.Message = reader["Message"].ToString();
                    }
                    reader.Close();
                }
                connection.Close();
            }
            return result;
        }
    }
}
