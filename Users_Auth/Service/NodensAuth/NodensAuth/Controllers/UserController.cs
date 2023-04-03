using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System.Data;
using System.Data.SqlClient;
using BC = BCrypt.Net.BCrypt;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using RestSharp.Authenticators;
using RestSharp;
using NodensAuth.Db;
using NodensAuth.Models;
using NodensAuth.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;

namespace NodensAuth.Controllers
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
            configuration = config;
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
                    cmd.Parameters.AddWithValue("Password", BC.HashPassword(obj.Password, 10));
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
                //MailSender mailSender = new MailSender();
                //var sent = await mailSender.SendEmailAsync($"Hola {obj.Name} {obj.Lastname}",obj.Email, "Verifica tu cuenta Nodens", url);
                RestClient client = new RestClient("https://api.mailgun.net/v3");
                RestRequest request = new RestRequest();
                request.Authenticator = new HttpBasicAuthenticator("api", "baed881d980ce8198d7e53e47a7c89fa-d51642fa-8eb94240");
                request.AddParameter("domain", "sandbox6562cab7a1654c4aa48c3a000ddc12f8.mailgun.org", ParameterType.UrlSegment);
                request.Resource = "{domain}/messages";
                request.AddParameter("from", "Mailgun Sandbox <postmaster@sandbox6562cab7a1654c4aa48c3a000ddc12f8.mailgun.org>");
                request.AddParameter("to", $"{obj.Name} {obj.Lastname} <{obj.Email}>");
                request.AddParameter("subject", "Verifica tu correo de Nodens");
                request.AddParameter("template", "nodensvalidation");
                request.AddParameter("h:X-Mailgun-Variables", "{'url': '" + url + "'}");
                request.Method = Method.Post;
                RestResponse response = await client.ExecuteAsync(request);
                return StatusCode(StatusCodes.Status200OK, new { Message = Response, url, response });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { err.Message });
            }
        }

        
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult GetUser()
        {
            try
            {
                var token = Request.Headers.Authorization.ToString().Replace("Bearer ", String.Empty);
                JsonWebToken jsonWebToken = new JsonWebToken(token);
                var claims = new ClaimsIdentity(jsonWebToken.Claims);
                var claimValues = claims.Claims.ToList();
                var email = claimValues[1].Value;
                ReadUser user = new ReadUser();
                using (var connection = new SqlConnection(cadenaSQL))
                {
                    connection.Open();
                    SqlCommand cmd = new SqlCommand("SP_ReadUser", connection);
                    cmd.Parameters.AddWithValue("Email", email);
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

        [HttpPut]
        [Route("update")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult UpdateUser([FromBody] UpdateUserModel user)
        {
            try
            {
                bool Error = false;
                string? Response = String.Empty;
                using (SqlConnection connection = new SqlConnection(cadenaSQL))
                {
                    connection.Open();
                    SqlCommand cmd = new SqlCommand("SP_UpdateUser", connection);
                    cmd.Parameters.AddWithValue("Email", user.OldEmail);
                    cmd.Parameters.AddWithValue("newEmail", user.NewEmail);
                    cmd.Parameters.AddWithValue("Name", user.Name);
                    cmd.Parameters.AddWithValue("Lastname", user.Lastname);
                    cmd.CommandType = CommandType.StoredProcedure;
                    using (SqlDataReader reader = cmd.ExecuteReader())
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
                return Error ? StatusCode(StatusCodes.Status500InternalServerError, new { Response, Message = "" }) : user.OldEmail == user.NewEmail ? StatusCode(StatusCodes.Status200OK, new { Response, Message = "" }) : StatusCode(StatusCodes.Status200OK, new { Response, Message = "Requerir una verificación de correo" });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { err.Message });
            }
        }
    }
}
