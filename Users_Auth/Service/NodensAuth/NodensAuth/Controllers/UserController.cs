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
        private readonly string APPURI = "<none>";
        private readonly SQL SQLHandler;
        public UserController(IConfiguration config, IOptions<EnvironmentConfig> options)
        {
            environmentConfig = options.Value;
            //cadenaSQL = config.GetConnectionString("CadenaSQL");
            //cadenaMongo = config.GetConnectionString("CadenaMongo");
            cadenaSQL = environmentConfig.CadenaSQL;
            cadenaMongo = environmentConfig.CadenaMongo;
            APPURI = environmentConfig.APPURL;
            SQLHandler = new SQL(cadenaSQL);
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
                string url = $"https://{APPURI}/api/auth/verify?em={emailHash}&guid={guid.ToString()}";
                RestClient client = new RestClient("https://api.mailgun.net/v3");
                RestRequest request = new RestRequest();
                request.Authenticator = new HttpBasicAuthenticator("api", "baed881d980ce8198d7e53e47a7c89fa-d51642fa-8eb94240");
                request.AddParameter("domain", "sandbox6562cab7a1654c4aa48c3a000ddc12f8.mailgun.org", ParameterType.UrlSegment);
                request.Resource = "{domain}/messages";
                request.AddParameter("from", "Mailgun Sandbox <postmaster@sandbox6562cab7a1654c4aa48c3a000ddc12f8.mailgun.org>");
                request.AddParameter("to", $"{obj.userName} <{obj.Email}>");
                request.AddParameter("subject", "Verifica tu correo de Nodens");
                request.AddParameter("template", "nodensvalidation");
                request.AddParameter("h:X-Mailgun-Variables", "{'url': '" + url + "'}");
                request.Method = Method.Post;
                RestResponse response = await client.ExecuteAsync(request);
                return StatusCode(StatusCodes.Status200OK, new { EmailVerificationStatus = response.StatusCode.ToString(), url, Message = sqlResult.Message });
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
                ReadUser user = SQLHandler.ReadUser(email);
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
