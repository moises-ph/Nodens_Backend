using MS_Users_Auth.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using BC = BCrypt.Net.BCrypt;
using System.Text;
using MS_Users_Auth.Utils;
using Microsoft.VisualBasic.FileIO;
using Microsoft.AspNetCore.Authorization;
using MS_Users_Auth.Db;
using MongoDB.Driver;

namespace MS_Users_Auth.Controllers
{
    [Route("api/auth")]
    [ApiController]
    [EnableCors("ReglasCors")]
    public class Auht_UsersController : ControllerBase
    {
        private readonly string secretKey;
        private readonly string cadenaSQL;
        private readonly IConfiguration configuration;
        public Auht_UsersController(IConfiguration config)
        {
            secretKey = config.GetSection("settings").GetSection("secretKey").Value;
            cadenaSQL = config.GetConnectionString("CadenaSQL");
            configuration = config;
        }

        [HttpPost]
        [Route("login")]
        public IActionResult Post([FromBody]Auth_User usr)
        {
            try
            {
                string? password = null;
                bool Verified = false;
                using (var connection = new SqlConnection(cadenaSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("SP_AuthUser", connection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("Email", usr.Email);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        reader.Read();
                        if (reader["password"] != DBNull.Value)
                        {
                            password = reader["password"].ToString();
                            Verified = reader["Verified"].ToString() == "1";
                        }
                        else
                        {
                            return StatusCode(StatusCodes.Status404NotFound, new { token = "", message = "Usuario no encontrado" });
                        }
                        reader.Close();
                    }
                    connection.Close();
                }
                if (!BC.Verify(usr.Password, password))
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new { token = "", message = "Contraseña Incorrecta" });
                }

                var keyBytes = Encoding.ASCII.GetBytes(secretKey);
                var claims = new ClaimsIdentity();
                claims.AddClaim(new Claim(ClaimTypes.Email, usr.Email));
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = claims,
                    Expires = DateTime.UtcNow.AddMinutes(60),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);
                string tokencreado = tokenHandler.WriteToken(tokenConfig);
                return StatusCode(StatusCodes.Status200OK, new { token = tokencreado, Verified });
            }
            catch(Exception err)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { token = "", msg = err.Message, err });
            }
        }

        [HttpPost]
        [Route("recovery/pre")]
        public async Task<IActionResult> PostPreAsync(string Email, string Password)
        {
            try
            {
                if (Email == null)
                {
                    return BadRequest(new { msg = "Email no válido" });
                }
                bool isRegistered = false;
                int? UserId = 0;
                using (var connection = new SqlConnection(cadenaSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("SP_AuthUser", connection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("Email", Email);
                    cmd.Parameters.AddWithValue("Password", Password);
                    using (SqlDataReader rd = await cmd.ExecuteReaderAsync())
                    {
                        rd.Read();
                        isRegistered = rd["Password"] != DBNull.Value;
                        UserId = rd["Password"] != DBNull.Value ? Convert.ToInt32(rd["Id"].ToString()) : null;
                        rd.Close();
                    }
                    connection.Close();
                }
                if (!isRegistered)
                {
                    return NotFound(new { msg = "Usuario no registrado" });
                }
                MongoClass mongoClass = new MongoClass(configuration);
                var mongoClientRequests = mongoClass.ClientRequest;
                var timeStamp = (MongoDB.Bson.BsonDateTime)DateTime.Now;
                Guid guid = Guid.NewGuid();
                MongoClass.RequestModel requestModel = new()
                {
                    source = new MongoClass.SourceRequest()
                    {
                        UserId = UserId,
                        EncodedId = guid.ToString(),
                        Verified = false
                    },
                    email = Email,
                    timestamp = timeStamp,
                };
                await mongoClientRequests.InsertOneAsync(requestModel);
                var filter = Builders<MongoClass.RequestModel>.Filter.Eq(r => r.email, Email);
                var result = await mongoClientRequests.Find(filter).FirstOrDefaultAsync();
                MailSender mailSender = new MailSender(configuration);
                string url = $"https://localhost:44384/api/auth/recovery/request?gdusr={guid.ToString()}&mn={Email.Replace("@", "%40")}";
                //ErrorModel sent = await mailSender.SendEmailGmailAsync(Email, "Recuperar Contraseña en tu Cuenta Nodens", $"<a href={url}?mn={Email.Replace("@", "%40")}' target='_blank'>Recupera tu contraseña aquí</a>");
                return StatusCode(StatusCodes.Status200OK, new { url , email = result.email, source = result.source, timestamp = result.timestamp.ToString() });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { msg = err.Message });
            }
        }

        [HttpPost]
        [Route("recovery/request")]
        public async Task<IActionResult> PostRecAsync(string gdusr, string mn)
        {
            try
            {
                MongoClass mongoClass = new MongoClass(configuration);
                var mongoClientRequests = mongoClass.ClientRequest;
                var filter = Builders<MongoClass.RequestModel>.Filter.Eq(r => r.email, mn);
                var result = await mongoClientRequests.Find(filter).FirstOrDefaultAsync();
                if(result == null)
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new { msg = "Url Expirada, por favor vuelva a pedir el restablecimiento de contraseña" });
                }
                if(result.source.EncodedId != gdusr || result.email!= mn)
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new { msg = "Url no válida, por favor vuelva a pedir el restablecimiento de contraseña" });
                }
                var keyBytes = Encoding.ASCII.GetBytes(secretKey);
                var claims = new ClaimsIdentity();
                claims.AddClaim(new Claim(ClaimTypes.Email, mn));
                claims.AddClaim(new Claim("Guid", gdusr));
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = claims,
                    Expires = DateTime.UtcNow.AddMinutes(60),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);
                string tokencreado = tokenHandler.WriteToken(tokenConfig);

                var sourceRes = result.source;
                var filterUp = Builders<MongoClass.RequestModel>.Filter.Eq(r => r.source.EncodedId, sourceRes.EncodedId);
                var update = Builders<MongoClass.RequestModel>.Update.Set(r => r.source.Verified, true);
                UpdateResult upResult = await mongoClientRequests.UpdateManyAsync(filterUp, update);
                return StatusCode(StatusCodes.Status200OK, new { token = tokencreado, upResult });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { msg = err.Message });
            }
        }

        [HttpPut]
        [Route("recovery/reset")]
        [Authorize]
        public async Task<IActionResult> PostResetAsync(Reset_Pass pass)
        {
            try
            {
                var token = new JwtSecurityToken(Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty));
                string? Guid = token.Payload["Guid"].ToString();
                string? Email = token.Payload["email"].ToString();
                MongoClass mongoClass = new MongoClass(configuration);
                IMongoCollection<MongoClass.RequestModel> mongoClientRequests = mongoClass.ClientRequest;
                FilterDefinition<MongoClass.RequestModel> filter = Builders<MongoClass.RequestModel>.Filter.Eq(r => r.source.EncodedId, Guid);
                MongoClass.RequestModel result = await mongoClientRequests.Find(filter).FirstOrDefaultAsync();
                if(result == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { msg = "Url expirada, por favor vuelva a pedir el restablecimiento de contraseña" });
                }
                if(result.source.EncodedId != Guid || result.email != Email)
                {
                    return BadRequest(new { msg = "URL no válida" });
                }

                if (!result.source.Verified)
                {
                    return BadRequest(new { msg = "Vuelva a solicitar el restablecimiento de su contraseña" });
                }

                int isError = 0;
                string? msg = string.Empty;

                string passwordCrypt = BC.HashPassword(pass.Password, 10);

                using(var connection = new SqlConnection(cadenaSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("SP_ChangePassword", connection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("Email", Email);
                    cmd.Parameters.AddWithValue("Password", passwordCrypt);
                    using(var rd = await cmd.ExecuteReaderAsync())
                    {
                        while (rd.Read())
                        {
                            isError = Convert.ToInt32(rd["Error"].ToString());
                            msg = rd["Respuesta"].ToString();
                        }
                        rd.Close();
                    }
                    connection.Close();
                }

                var delFilter = Builders<MongoClass.RequestModel>.Filter.Eq(r => r.source.EncodedId, Guid);
                DeleteResult deleteResult = await mongoClientRequests.DeleteManyAsync(delFilter);

                return StatusCode(200, new { msg = "Contraseña cambiada exitosamente" });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { msg = err.Message });
            }
        }

        [HttpPut("verify")]
        public async Task<IActionResult> Verifyuser(string em, string guid)
        {
            try
            {
                bool Error = false;
                string Response = String.Empty;
                MongoClass mongoClass = new MongoClass(configuration);
                IMongoCollection<MongoClass.VerifyUsersModel> verifyCollection = mongoClass.VerifyUsers;
                var filter = Builders<MongoClass.VerifyUsersModel>.Filter.Eq(r => r.source.unique_str, guid);
                var result = await verifyCollection.Find(filter).FirstOrDefaultAsync();

                if (result == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { Message = "Url Expirada, intente de nuevo" });
                }

                bool isEmail = BC.Verify(result.source.email, em);
                bool isGuid = result.source.unique_str == guid;

                if ( isEmail && isGuid)
                {
                    string email = result.source.email;
                    using(SqlConnection connection = new SqlConnection(cadenaSQL))
                    {
                        connection.Open();
                        var cmd = new SqlCommand("SP_VerifyUser", connection);
                        cmd.Parameters.AddWithValue("Email", email);
                        cmd.CommandType = CommandType.StoredProcedure;
                        using(SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while(reader.Read())
                            {
                                Error = Convert.ToInt32(reader["Error"].ToString()) == 1;
                                Response = reader["Message"].ToString();
                            }
                            reader.Close();
                        }
                        connection.Close();
                    }
                }

                if (Error)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new { Response, Message = "Vuelva a intentarlo" });
                }

                DeleteResult deleteResult = await verifyCollection.DeleteManyAsync(filter);

                return StatusCode(StatusCodes.Status200OK, new { Response });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { msg = err.Message });
            }
        }

        [HttpPost("verify/req")]
        public async Task<IActionResult> RequestVerify([FromBody] VerifyReqModel verifyReq)
        {
            return StatusCode(200,verifyReq);
        }
    }
}
