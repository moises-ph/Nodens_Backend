﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using BC = BCrypt.Net.BCrypt;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Driver;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.Extensions.Options;
using RestSharp.Authenticators;
using RestSharp;
using NodensAuth.Db;
using NodensAuth.Models;
using NodensAuth.Utils;

namespace NodensAuth.Controllers
{
    [Route("api/auth")]
    [ApiController]
    [EnableCors("ReglasCors")]
    public class Auht_UsersController : ControllerBase
    {
        private readonly string secretKey;
        private readonly string renewKey;
        private readonly string cadenaSQL;
        private readonly string cadenaMongo;
        private readonly string APPURI;
        private readonly IConfiguration configuration;
        private readonly EnvironmentConfig environmentConfig;
        public Auht_UsersController(IConfiguration config, IOptions<EnvironmentConfig> options)
        {
            environmentConfig = options.Value;
            secretKey = config.GetSection("settings").GetSection("secretKey").Value;
            renewKey = config.GetSection("settings").GetSection("renewTokenKey").Value;
            cadenaSQL = environmentConfig.CadenaSQL;
            cadenaMongo = environmentConfig.CadenaMongo;
            APPURI = environmentConfig.APPURL;
            configuration = config;
        }

        [HttpPut("renew")]
        public IActionResult RenewToken(string token)
        {
            try
            {
                var cookieKey = Request.Cookies["RenewKey"];
                if (cookieKey == null || !BC.Verify(renewKey, cookieKey))
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new { message = "Invalid Cookies" });
                }
                JsonWebToken jsonWebToken = new JsonWebToken(token);
                var claims = new ClaimsIdentity(jsonWebToken.Claims);
                var keyBytes = Encoding.UTF8.GetBytes(secretKey);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = claims,
                    Expires = DateTime.UtcNow.AddMinutes(15),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);
                string tokencreado = tokenHandler.WriteToken(tokenConfig);
                var RenewKey = BC.HashString(renewKey);
                Response.Cookies.Delete("RenewKey");
                Response.Cookies.Append("RenewKey", RenewKey);
                return StatusCode(StatusCodes.Status200OK, new { ttoken = tokencreado });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { token = "", msg = ex.Message });
            }
        }

        [HttpPost]
        [Route("login")]
        public IActionResult Post([FromBody] Auth_User usr)
        {
            try
            {
                string? password = String.Empty;
                bool Verified = false;
                int Id = 0;
                string? Role = String.Empty;
                string? Name = String.Empty;
                string? Lastname = String.Empty;
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
                            Verified = Convert.ToInt32(reader["Verified"]) == 1;
                            Id = Convert.ToInt32(reader["id"]);
                            Role = reader["Role"].ToString();
                            Name = reader["Name"].ToString();
                            Lastname = reader["Lastname"].ToString();
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

                var keyBytes = Encoding.UTF8.GetBytes(secretKey);
                var securityKey = new SymmetricSecurityKey(keyBytes);
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                var claims = new[]
                {
                    new Claim("Role", Role),
                    new Claim("Email", usr.Email),
                    new Claim("Id", Id.ToString())
                };
                var token = new JwtSecurityToken(null,null, claims, expires: DateTime.Now.AddMinutes(15), signingCredentials: credentials);
                var tokencreado = new JwtSecurityTokenHandler().WriteToken(token);
                var RenewKey = BC.HashString(renewKey);
                Response.Cookies.Append("RenewKey", RenewKey);
                return StatusCode(StatusCodes.Status200OK, new { token = tokencreado, Verified, Name, Lastname });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { token = "", msg = err.Message });
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
                MongoClass mongoClass = new MongoClass(cadenaMongo);
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
                string url = $"https://{APPURI}/api/auth/recovery/request?gdusr={guid.ToString()}&mn={Email.Replace("@", "%40")}";
                RestClient client = new RestClient("https://api.mailgun.net/v3");
                RestRequest request = new RestRequest();
                request.Authenticator = new HttpBasicAuthenticator("api", "baed881d980ce8198d7e53e47a7c89fa-d51642fa-8eb94240");
                request.AddParameter("domain", "sandbox6562cab7a1654c4aa48c3a000ddc12f8.mailgun.org", ParameterType.UrlSegment);
                request.Resource = "{domain}/messages";
                request.AddParameter("from", "Mailgun Sandbox <postmaster@sandbox6562cab7a1654c4aa48c3a000ddc12f8.mailgun.org>");
                request.AddParameter("to", $"<{Email}>");
                request.AddParameter("subject", "Recuperación de contraseña");
                request.AddParameter("template", "nodensrecovery");
                request.AddParameter("h:X-Mailgun-Variables", "{'url': '" + url + "'}");
                request.Method = Method.Post;
                RestResponse response = await client.ExecuteAsync(request);

                return StatusCode(StatusCodes.Status200OK, new { guid = guid.ToString(), Email, email = result.email, source = result.source, timestamp = result.timestamp.ToString(), response });
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
                MongoClass mongoClass = new MongoClass(cadenaMongo);
                var mongoClientRequests = mongoClass.ClientRequest;
                var filter = Builders<MongoClass.RequestModel>.Filter.Eq(r => r.email, mn);
                var result = await mongoClientRequests.Find(filter).FirstOrDefaultAsync();
                if (result == null)
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new { msg = "Url Expirada, por favor vuelva a pedir el restablecimiento de contraseña" });
                }
                if (result.source.EncodedId != gdusr || result.email != mn)
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
                MongoClass mongoClass = new MongoClass(cadenaMongo);
                IMongoCollection<MongoClass.RequestModel> mongoClientRequests = mongoClass.ClientRequest;
                FilterDefinition<MongoClass.RequestModel> filter = Builders<MongoClass.RequestModel>.Filter.Eq(r => r.source.EncodedId, Guid);
                MongoClass.RequestModel result = await mongoClientRequests.Find(filter).FirstOrDefaultAsync();
                if (result == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { msg = "Url expirada, por favor vuelva a pedir el restablecimiento de contraseña" });
                }
                if (result.source.EncodedId != Guid || result.email != Email)
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

                using (var connection = new SqlConnection(cadenaSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("SP_ChangePassword", connection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("Email", Email);
                    cmd.Parameters.AddWithValue("Password", passwordCrypt);
                    using (var rd = await cmd.ExecuteReaderAsync())
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
                MongoClass mongoClass = new MongoClass(cadenaMongo);
                IMongoCollection<MongoClass.VerifyUsersModel> verifyCollection = mongoClass.VerifyUsers;
                var filter = Builders<MongoClass.VerifyUsersModel>.Filter.Eq(r => r.source.unique_str, guid);
                var result = await verifyCollection.Find(filter).FirstOrDefaultAsync();

                if (result == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { Message = "Url Expirada, intente de nuevo" });
                }

                bool isEmail = BC.Verify(result.source.email, em);
                bool isGuid = result.source.unique_str == guid;

                if (isEmail && isGuid)
                {
                    string email = result.source.email;
                    using (SqlConnection connection = new SqlConnection(cadenaSQL))
                    {
                        connection.Open();
                        var cmd = new SqlCommand("SP_VerifyUser", connection);
                        cmd.Parameters.AddWithValue("Email", email);
                        cmd.CommandType = CommandType.StoredProcedure;
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
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
        public async Task<IActionResult> RequestVerify([FromBody] EmailOnlyModel verifyReq)
        {
            try
            {
                bool exists = false;
                using (SqlConnection connection = new SqlConnection(cadenaSQL))
                {
                    connection.Open();
                    SqlCommand cmd = new SqlCommand("SP_AuthUser", connection);
                    cmd.Parameters.AddWithValue("Email", verifyReq.email);
                    cmd.CommandType = CommandType.StoredProcedure;
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        reader.Read();
                        exists = reader["Verified"] != DBNull.Value;
                        reader.Close();
                    }
                    connection.Close();
                }
                if (!exists)
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { Message = "El usuario no existe, por favor regístrese" });
                }

                Guid guid = Guid.NewGuid();
                var timestamp = (MongoDB.Bson.BsonDateTime)DateTime.Now;
                MongoClass mongoClass = new MongoClass(cadenaMongo);
                IMongoCollection<MongoClass.VerifyUsersModel> verifyCollection = mongoClass.VerifyUsers;
                MongoClass.VerifyUsersModel verifyUsersModel = new MongoClass.VerifyUsersModel()
                {
                    source = new MongoClass.SourceVerify()
                    {
                        email = verifyReq.email,
                        unique_str = guid.ToString(),
                    },
                    timestamp = timestamp
                };

                await verifyCollection.InsertOneAsync(verifyUsersModel);
                string emailHash = BC.HashString(verifyReq.email);
                string url = $"https://localhost:44384/api/auth/verify?em={emailHash}&guid={guid.ToString()}";
                return StatusCode(StatusCodes.Status200OK, new { url, Message = "Verificación de email solicitada correctamente, vaya al enlace" });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { msg = err.Message });
            }
        }
    }
}
