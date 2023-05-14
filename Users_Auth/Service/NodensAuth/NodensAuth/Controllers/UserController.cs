using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using MongoDB.Driver;
using NodensAuth.Db;
using NodensAuth.Models;
using NodensAuth.Utils;
using RestSharp;
using RestSharp.Authenticators;
using System.Linq;
using System.Security.Claims;
using static NodensAuth.Db.SQL;
using BC = BCrypt.Net.BCrypt;

namespace NodensAuth.Controllers
{
    [EnableCors("ReglasCors")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string cadenaSQL;
        private readonly string cadenaMongo;
        private readonly EnvironmentConfig environmentConfig;
        private readonly SQL SQLHandler;
        private readonly MailService MailService;
        public UserController(IConfiguration config, IOptions<EnvironmentConfig> options)
        {
            environmentConfig = options.Value;
            //cadenaSQL = config.GetConnectionString("CadenaSQL");
            //cadenaMongo = config.GetConnectionString("CadenaMongo");
            cadenaSQL = environmentConfig.CadenaSQL;
            cadenaMongo = environmentConfig.CadenaMongo;
            SQLHandler = new SQL(cadenaSQL);
            MailService = new MailService(environmentConfig.MAILURL);
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterUser obj)
        {
            try
            {
                SQLResult sqlResult = new SQLResult();
                sqlResult = SQLHandler.CreateUser(obj);
                if (sqlResult.Error)
                {
                    return BadRequest(sqlResult.Message);
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
                return StatusCode(StatusCodes.Status200OK, new { Message = sqlResult.Message, emailHash, guid });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { err.Message });
            }
        }


        [HttpGet("{Id}")]
        public IActionResult GetUser(string? Id)
        {
            try
            {
                string? email = null;
                if(Request.Headers.ContainsKey("Authorization"))
                {
                    string? token = Request.Headers.Authorization.ToString().Replace("Bearer ", String.Empty);
                    JsonWebToken jsonWebToken = new JsonWebToken(token);
                    ClaimsIdentity claims = new ClaimsIdentity(jsonWebToken.Claims);
                    List<Claim> claimValues = claims.Claims.ToList();
                    email = claimValues[1].Value;
                }
                else if(Id != null)
                {
                    email = Id;
                }
                else
                {
                    return BadRequest(new { Message = "No data provided" });
                }
                ReadUser? user = SQLHandler.ReadUser(email);
                return user != null ? StatusCode(StatusCodes.Status200OK, user) : NotFound(new { Message = "El usuario no existe" });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { err.Message });
            }
        }

        [HttpPut]
        [Route("update")]
        [Authorize]
        public IActionResult UpdateUser([FromBody] UpdateUserModel user)
        {
            try
            {
                SQLResult result = SQLHandler.UpdateUser(user);
                return result.Error ? StatusCode(StatusCodes.Status500InternalServerError, new { Message = result.Message }) : user.OldEmail == user.NewEmail ? StatusCode(StatusCodes.Status200OK, new { Message = result.Message }) : StatusCode(StatusCodes.Status200OK, new { Message = "Usuario Actualizado, Requerir una verificación de correo" });
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { err.Message });
            }
        }
    }
}
