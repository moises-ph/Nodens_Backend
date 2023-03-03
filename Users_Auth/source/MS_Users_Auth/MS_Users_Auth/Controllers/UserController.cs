using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MS_Users_Auth.Models;
using BC = BCrypt.Net.BCrypt;

namespace MS_Users_Auth.Controllers
{
    [EnableCors("ReglasCors")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string cadenaSQL;
        public UserController(IConfiguration config)
        {
            cadenaSQL = config.GetConnectionString("CadenaSQL");
        }

        [HttpPost]
        [Route("Register")]
        public IActionResult Register([FromBody] User obj)
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
                    cmd.Parameters.AddWithValue("Rol", obj.Rol);
                    cmd.Parameters.AddWithValue("Password", BC.HashPassword(obj.Password));
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
                else
                {
                    return StatusCode(StatusCodes.Status200OK, new { Message = Response });
                }
            }
            catch(Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { err.Message });
            }
        }
    }
}
