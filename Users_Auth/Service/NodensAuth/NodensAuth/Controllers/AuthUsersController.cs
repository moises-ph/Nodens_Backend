using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using NodensAuth.Db;
using NodensAuth.Models;
using NodensAuth.Utils;
using RestSharp;
using RestSharp.Authenticators;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static NodensAuth.Db.SQL;
using BC = BCrypt.Net.BCrypt;

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
        private readonly string APPURI = "<none>";
        private readonly IConfiguration configuration;
        private readonly EnvironmentConfig environmentConfig;
        private readonly SQL SQLHandler;
        public Auht_UsersController(IConfiguration config, IOptions<EnvironmentConfig> options)
        {
            environmentConfig = options.Value;
            secretKey = config.GetSection("settings").GetSection("secretKey").Value;
            renewKey = config.GetSection("settings").GetSection("renewTokenKey").Value;
            //cadenaSQL = config.GetConnectionString("CadenaSQL");
            //cadenaMongo = config.GetConnectionString("CadenaMongo");
            cadenaSQL = environmentConfig.CadenaSQL;
            cadenaMongo = environmentConfig.CadenaMongo;
            APPURI = environmentConfig.APPURL;
            configuration = config;
            SQLHandler = new SQL(cadenaSQL);
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
        public IActionResult Post([FromBody] AuthUserReq usr)
        {
            try
            {
                ReadAuthUser? readAuthUser = new ReadAuthUser();
                readAuthUser = SQLHandler.AuthUser(usr.Email);
                if (readAuthUser == null)
                {
                    return BadRequest(new { Message = "El usuario no existe" });
                }
                if (!BC.Verify(usr.Password, readAuthUser.password))
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new { token = "", message = "Contraseña Incorrecta" });
                }

                var keyBytes = Encoding.UTF8.GetBytes(secretKey);
                var securityKey = new SymmetricSecurityKey(keyBytes);
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                var claims = new[]
                {
                    new Claim("Role", readAuthUser.Role),
                    new Claim("Email", usr.Email),
                    new Claim("Id", readAuthUser.Id.ToString())
                };
                var token = new JwtSecurityToken(null, null, claims, expires: DateTime.Now.AddMinutes(15), signingCredentials: credentials);
                var tokencreado = new JwtSecurityTokenHandler().WriteToken(token);
                var RenewKey = BC.HashString(renewKey);
                Response.Cookies.Append("RenewKey", RenewKey);
                return StatusCode(StatusCodes.Status200OK, new { token = tokencreado, readAuthUser.Verified, readAuthUser.userName });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { token = "", msg = err.Message });
            }
        }

        [HttpPost]
        [Route("recovery/pre")]
        public async Task<IActionResult> PostPreAsync(string Email)
        {
            try
            {
                if (Email == null)
                {
                    return BadRequest(new { Message = "Email no válido" });
                }
                ReadAuthUser? readAuthUser = new ReadAuthUser();
                readAuthUser = SQLHandler.AuthUser(Email);
                bool isRegistered = readAuthUser != null;
                if (!isRegistered)
                {
                    return NotFound(new { Message = "Usuario no registrado" });
                }
                MongoClass mongoClass = new MongoClass(cadenaMongo);
                var mongoClientRequests = mongoClass.ClientRequest;
                var timeStamp = (MongoDB.Bson.BsonDateTime)DateTime.Now;
                Guid guid = Guid.NewGuid();
                MongoClass.RequestModel requestModel = new()
                {
                    source = new MongoClass.SourceRequest()
                    {
                        UserId = readAuthUser.Id,
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
                return StatusCode(StatusCodes.Status200OK, new { guid = guid.ToString(), email = result.email, URL = url });
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
                var keyBytes = Encoding.UTF8.GetBytes(secretKey);
                var securityKey = new SymmetricSecurityKey(keyBytes);
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                var claims = new[]
                {
                    new Claim("Guid", gdusr),
                    new Claim("Email", mn),
                };
                var token = new JwtSecurityToken(null, null, claims, expires: DateTime.Now.AddMinutes(10), signingCredentials: credentials);
                var tokencreado = new JwtSecurityTokenHandler().WriteToken(token);

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
        public async Task<IActionResult> PostResetAsync([FromBody]Reset_Pass pass)
        {
            try
            {
                var token = new JwtSecurityToken(Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty));
                string? Guid = token.Payload["Guid"].ToString();
                string? Email = token.Payload["Email"].ToString();
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

                SQLResult sqlresult = new SQLResult();

                sqlresult = await SQLHandler.ChangePassword(new AuthUserReq() { Email = Email, Password = pass.Password });

                if (sqlresult.Error)
                {
                    return StatusCode(500, new { Message = sqlresult.Message });
                }

                var delFilter = Builders<MongoClass.RequestModel>.Filter.Eq(r => r.source.EncodedId, Guid);
                DeleteResult deleteResult = await mongoClientRequests.DeleteManyAsync(delFilter);

                return StatusCode(200, new { Message = "Contraseña cambiada exitosamente" });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { Message = err.Message });
            }
        }

        [HttpPut("verify")]
        public async Task<IActionResult> Verifyuser(string em, string guid)
        {
            try
            {
                string Response = String.Empty;
                MongoClass mongoClass = new MongoClass(cadenaMongo);
                IMongoCollection<MongoClass.VerifyUsersModel> verifyCollection = mongoClass.VerifyUsers;
                var filter = Builders<MongoClass.VerifyUsersModel>.Filter.Eq(r => r.source.unique_str, guid);
                var result = await verifyCollection.Find(filter).FirstOrDefaultAsync();

                if (result == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { Message = "Url Expirada, intente de nuevo" });
                }

                SQLResult sqlresult = new SQLResult();

                if (BC.Verify(result.source.email, em) && result.source.unique_str == guid)
                {
                    string email = result.source.email;
                    sqlresult = SQLHandler.VerifyUser(email);
                }

                if (sqlresult.Error)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new { Response, Message = "Vuelva a intentarlo" });
                }

                DeleteResult deleteResult = await verifyCollection.DeleteManyAsync(filter);

                return StatusCode(StatusCodes.Status200OK, new { Response, Message = sqlresult.Message });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = err.Message });
            }
        }

        [HttpPost("verify/req")]
        public async Task<IActionResult> RequestVerify([FromBody] EmailOnlyModel verifyReq)
        {
            try
            {
                ReadAuthUser? result = SQLHandler.AuthUser(verifyReq.email);
                if (result == null)
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
                string url = $"https://localhost:44384/api/auth/verify?em={emailHash}&guid={guid}";
                return StatusCode(StatusCodes.Status200OK, new { url, Message = "Verificación de email solicitada correctamente, vaya al enlace" });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { msg = err.Message });
            }
        }
    }
}
