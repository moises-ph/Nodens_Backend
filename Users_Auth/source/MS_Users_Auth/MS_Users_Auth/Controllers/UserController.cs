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
            cadenaSQL = config.GetConnectionString("cadenaSQL");
        }

        [HttpPost]
        [Route("Register")]
        public IActionResult Register([FromBody] User obj)
        {
            try
            {
                int error;
                string Response;
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("SP_CreateUser", conexion);
                    cmd.Parameters.AddWithValue("Email", obj.Email);
                    cmd.Parameters.AddWithValue("First_Name", obj.First_Name);
                    cmd.Parameters.AddWithValue("Second_Name", obj.Second_Name);
                    cmd.Parameters.AddWithValue("First_Lastname", obj.First_Lastname);
                    cmd.Parameters.AddWithValue("Second_Lastname", obj.Second_Lastname);
                    cmd.Parameters.AddWithValue("Rol", obj.Rol);
                    cmd.Parameters.AddWithValue("Birthdate", obj.Birthdate);
                    string pass = BC.HashPassword(obj.Password);
                    cmd.Parameters.AddWithValue("Password", pass);
                    cmd.CommandType = CommandType.StoredProcedure;
                    using (SqlDataReader rd = cmd.ExecuteReader())
                    {
                        rd.Read();
                        error = Convert.ToInt32(rd["Error"].ToString());
                        Response = rd["Message"].ToString();
                        rd.Close();
                    }
                    conexion.Close();
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
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = err.Message });
            }
        }
    }
}
