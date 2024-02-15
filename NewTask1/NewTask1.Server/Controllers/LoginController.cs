using NewTask1.Data;
using NewTask1.Helpers;
using NewTask1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace NewTask1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly UserDbContext _context;
        public LoginController(UserDbContext userDbContext)
        {
            _context = userDbContext;
        }

        // Get all users
        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            // Instead of exposing IQueryable directly, consider projecting into DTOs
            var userdetails = _context.userModels.Select(u => new { u.UserName});
            return Ok(userdetails);
        }

        // User sign up
        [HttpPost("signup")]
        public IActionResult SignUp([FromBody] UserModel userObj)
        {
            if (userObj == null)
            {
                return BadRequest("Invalid user object.");
            }

            // Encrypt the password before saving
            userObj.Password = EncDscPassword.EncryptPassword(userObj.Password);
            _context.userModels.Add(userObj);
            _context.SaveChanges();

            return Ok(new
            {
                StatusCode = 200,
                Message = "Sign up Successfully"
            });
        }

        // User login
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserModel userObj)
        {
            if (userObj == null)
            {
                return BadRequest("Invalid user object.");
            }

            var user = _context.userModels.FirstOrDefault(a => a.UserName == userObj.UserName);

            if (user != null && EncDscPassword.DecryptPassword(user.Password) == userObj.Password)
            {
                return Ok(new
                {
                    StatusCode = 200,
                    Message = "Logged In Successfully",
                    UserType = user.UserType
                });
            }
            else
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "User Not Found or Incorrect Password"
                });
            }
        }
    }
}
