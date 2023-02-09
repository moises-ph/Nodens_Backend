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
using MS_Users_Auth.Models;
using Microsoft.VisualBasic.FileIO;

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

        //[HttpPost]
        //[Route("/")]
        //public IActionResult Post(Auth_User usr)
        //{
        //    try
        //    {
        //        using(var connection = new SqlConnection(cadenaSQL))
        //        {
        //            string? password = null;
        //            int? Id = null;
        //            connection.Open();
        //            var cmd = new SqlCommand("SP_AuthUser", connection);
        //            cmd.Parameters.AddWithValue("Email", usr.Email);
        //            cmd.Parameters.AddWithValue("Password", usr.Password);
        //            using(SqlDataReader reader = cmd.ExecuteReader())
        //            {
        //                reader.Read();
        //                if (reader["Password"].ToString() != null)
        //                {
        //                    password = reader["Password"].ToString();
        //                    Id = Convert.ToInt32(reader["Id"].ToString());
        //                }
        //                else
        //                {
        //                    new Exception("Usuario no encontrado");
        //                }
        //                reader.Close();
        //            }
        //            if(BC.Verify(usr.Password, password))
        //            {
        //                var keyBytes = Encoding.ASCII.GetBytes(secretKey);
        //                var claims = new ClaimsIdentity();
        //                claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, usr.Email));
        //                var tokenDescriptor = new SecurityTokenDescriptor
        //                {
        //                    Subject = claims,
        //                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
        //                };
        //                var tokenHandler = new JwtSecurityTokenHandler();
        //                var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);
        //                string tokencreado = tokenHandler.WriteToken(tokenConfig);
        //                return StatusCode(StatusCodes.Status200OK, new { token = tokencreado, User_Id = Id });
        //            }
        //            else
        //            {
        //                return StatusCode(StatusCodes.Status401Unauthorized, new { token = "" });
        //            }
        //        }
        //    }
        //    catch(Exception err)
        //    {
        //        return StatusCode(StatusCodes.Status401Unauthorized, new { token = "", msg = err.Message });
        //    }
        //}

        [HttpPost]
        [Route("recovery/request")]
        public async Task<IActionResult> PostRecAsync(Auth_User usr)
        {
            try
            {
                if (usr.Password == null)
                {
                    using(var connection = new SqlConnection(cadenaSQL))
                    {
                        connection.Open();
                        var cmd = new SqlCommand("",connection);
                    }


                    MailSender mailSender = new MailSender(configuration);

                    var keyBytes = Encoding.ASCII.GetBytes(secretKey);
                    var claims = new ClaimsIdentity();
                    claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, usr.Email));
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = claims,
                        Expires = DateTime.UtcNow.AddMinutes(30),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
                    };
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);
                    string tokencreado = tokenHandler.WriteToken(tokenConfig);

                    // ErrorModel sent = await mailSender.SendEmailGmailAsync(usr.Email, "Prueba", "<h1>Hola<h1>");
                    // return StatusCode(StatusCodes.Status200OK, new {Result = sent});
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { msg = err.Message });
            }
        }
    }
}
