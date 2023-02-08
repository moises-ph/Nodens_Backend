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

namespace MS_Users_Auth.Controllers
{
    [Route("api/auth")]
    [ApiController]
    [EnableCors("ReglasCors")]
    public class Auht_UsersController : ControllerBase
    {
        private readonly string secretKey;
        private readonly string cadenaSQL;
        public Auht_UsersController(IConfiguration config)
        {
            secretKey = config.GetSection("settings").GetSection("secretKey").Value;
            cadenaSQL = config.GetConnectionString("CadenaSQL");
        }

        [HttpPost]
        [Route("/")]
        public IActionResult Post(Auth_User usr)
        {
            try
            {
                using(var connection = new SqlConnection(cadenaSQL))
                {
                    string? password = null;
                    int? Id = null;
                    connection.Open();
                    var cmd = new SqlCommand("SP_AuthUser", connection);
                    cmd.Parameters.AddWithValue("Email", usr.Email);
                    cmd.Parameters.AddWithValue("Password", usr.Password);
                    using(SqlDataReader reader = cmd.ExecuteReader())
                    {
                        reader.Read();
                        if (reader["Password"].ToString() != null)
                        {
                            password = reader["Password"].ToString();
                            Id = Convert.ToInt32(reader["Id"].ToString());
                        }
                        else
                        {
                            new Exception("Usuario no encontrado");
                        }
                        reader.Close();
                    }
                    if(BC.Verify(usr.Password, password))
                    {
                        var keyBytes = Encoding.ASCII.GetBytes(secretKey);
                        var claims = new ClaimsIdentity();
                        claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, usr.Email));
                        var tokenDescriptor = new SecurityTokenDescriptor
                        {
                            Subject = claims,
                            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
                        };
                        var tokenHandler = new JwtSecurityTokenHandler();
                        var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);
                        string tokencreado = tokenHandler.WriteToken(tokenConfig);
                        return StatusCode(StatusCodes.Status200OK, new { token = tokencreado, User_Id = Id });
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status401Unauthorized, new { token = "" });
                    }
                }
            }
            catch(Exception err)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { token = "", msg = err.Message });
            }
        }
    }
}
