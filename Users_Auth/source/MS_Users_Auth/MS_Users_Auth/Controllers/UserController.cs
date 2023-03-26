using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MS_Users_Auth.Models;
using BC = BCrypt.Net.BCrypt;
using MS_Users_Auth.Utils;
using MongoDB.Driver;
using MS_Users_Auth.Db;
using Microsoft.Extensions.Options;

namespace MS_Users_Auth.Controllers
{
    [EnableCors("ReglasCors")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string cadenaSQL;
        private readonly IConfiguration configuration;
        private readonly string cadenaMongo;
        private readonly EnvironmentConfig environmentConfig;
        private readonly string APPURI;
        public UserController(IConfiguration config, IOptions<EnvironmentConfig> options)
        {
            environmentConfig = options.Value;
            cadenaSQL = environmentConfig.CadenaSQL;
            cadenaMongo = environmentConfig.CadenaMongo;
            APPURI = environmentConfig.APPURL;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterUser obj)
        {
            try
            {
                int error;
                string Response;
                using (var connection = new SqlConnection(cadenaSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("SP_CreateUser", connection);
                    cmd.Parameters.AddWithValue("Email", obj.Email);
                    cmd.Parameters.AddWithValue("Name", obj.Name);
                    cmd.Parameters.AddWithValue("Lastname", obj.Lastname);
                    cmd.Parameters.AddWithValue("Role", obj.Rol);
                    cmd.Parameters.AddWithValue("Password", BC.HashPassword(obj.Password,10));
                    cmd.CommandType = CommandType.StoredProcedure;
                    using (SqlDataReader rd = cmd.ExecuteReader())
                    {
                        rd.Read();
                        error = Convert.ToInt32(rd["Error"].ToString());
                        Response = rd["Message"].ToString();
                        rd.Close();
                    }
                    connection.Close();
                }
                if (error == 1)
                {
                    throw new Exception(Response);
                }
                MongoClass mongoClass = new MongoClass(cadenaMongo);
                IMongoCollection<MongoClass.VerifyUsersModel> VerifyUsersCollection = mongoClass.VerifyUsers;
                Guid guid = Guid.NewGuid();
                var timestamp = (MongoDB.Bson.BsonDateTime)DateTime.Now;
                MongoClass.VerifyUsersModel verifyUsersModel = new MongoClass.VerifyUsersModel() 
                {
                    source = new MongoClass.SourceVerify()
                    {
                        email = obj.Email,
                        unique_str = guid.ToString(),
                    },
                    timestamp = timestamp,
                };
                    
                await VerifyUsersCollection.InsertOneAsync(verifyUsersModel);
                string emailHash = BC.HashString(obj.Email);
                string url = $"https://{APPURI}/api/auth/verify?em={emailHash}&guid={guid.ToString()}";
                MailSender mailSender = new MailSender(configuration);
                MailSender.ErrorModel sent = await mailSender.SendEmailOutlook(obj.Email, "Verifica tu cuenta Nodens", $"<a href='{url}' target='_blank'>Verificala aquí</a>");
                return StatusCode(StatusCodes.Status200OK, new { Message = Response, url, sent });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { err.Message });
            }
        }

        [Authorize]
        [HttpGet]
        public IActionResult GetUser([FromBody] EmailOnlyModel usr)
        {
            try
            {
                ReadUser user = new ReadUser();
                using (var connection = new SqlConnection(cadenaSQL))
                {
                    connection.Open();
                    SqlCommand cmd = new SqlCommand("SP_ReadUser", connection);
                    cmd.Parameters.AddWithValue("Email", usr.email);
                    cmd.CommandType = CommandType.StoredProcedure;
                    using (SqlDataReader rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            user.Name = rd["Name"].ToString();
                            user.Lastname = rd["Lastname"].ToString();
                            user.Email = rd["email"].ToString();
                            user.Rol = rd["Role"].ToString();
                            user.Verified = Convert.ToInt16(rd["Verified"]) == 1;
                        }
                        rd.Close();
                    }
                    connection.Close();
                }
                return StatusCode(StatusCodes.Status200OK, user);
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { err.Message });
            }
        }

        [Authorize]
        [HttpPut("update")]
        public IActionResult UpdateUser([FromBody] UpdateUserModel user) 
        {
            try
            {
                bool Error = false;
                string? Response = String.Empty;
                using(SqlConnection connection = new SqlConnection(cadenaSQL))
                {
                    connection.Open();
                    SqlCommand cmd = new SqlCommand("SP_UpdateUser", connection);
                    cmd.Parameters.AddWithValue("Email", user.OldEmail);
                    cmd.Parameters.AddWithValue("newEmail", user.NewEmail);
                    cmd.Parameters.AddWithValue("Name", user.Name);
                    cmd.Parameters.AddWithValue("Lastname", user.Lastname);
                    cmd.CommandType = CommandType.StoredProcedure;
                    using(SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Error = Convert.ToInt16(reader["Error"]) == 1;
                            Response = reader["Message"].ToString();
                        }
                        reader.Close();
                    }
                    connection.Close();
                }
                return Error ? StatusCode(StatusCodes.Status500InternalServerError, new { Response, Message = "" }) : user.OldEmail == user.NewEmail ? StatusCode(StatusCodes.Status200OK, new { Response , Message = "" }) : StatusCode(StatusCodes.Status200OK, new { Response, Message = "Requerir una verificación de correo" });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { err.Message });
            }
        }
    }
}
