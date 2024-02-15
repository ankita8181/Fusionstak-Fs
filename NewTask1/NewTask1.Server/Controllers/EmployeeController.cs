using NewTask1.Data;
using NewTask1.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;

namespace NewTask1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class EmployeeController : ControllerBase
    {
        private readonly UserDbContext _context;
        public EmployeeController(UserDbContext userDbContext)
        {
            _context = userDbContext;
        }

        [HttpPost("add_employee")]
        public IActionResult AddEmployee([FromBody] EmployeeModel employeeObj)
        {
            try
            {
                if (employeeObj == null)
                {
                    return BadRequest();
                }
                else
                {
                    _context.employeeModels.Add(employeeObj);
                    _context.SaveChanges();
                    return Ok(new
                    {
                        StatusCode = 200,
                        Messsage = "Employee added Successfully"
                    });
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            
        }
        [HttpPut("update_employee")]
        public IActionResult UpdateEmployee([FromBody] EmployeeModel employeeObj)
        {
            if(employeeObj == null)
            {
                return BadRequest();
            }
            var user = _context.employeeModels.AsNoTracking().FirstOrDefault(x => x.Id == employeeObj.Id);
            if(user == null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "User Not Found"
                });
            }
            else
            {
                _context.Entry(employeeObj).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(new
                {
                    StatusCode = 200,
                    Message = "Employee Updated Successfully"
                });
            }
        }
        [HttpDelete("delete_employee/{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            var user = _context.employeeModels.Find(id);
            if(user == null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "user not Found"
                });
            }
            else
            {
                _context.Remove(user);
                _context.SaveChanges();
                return Ok(new
                {
                    StatusCode = 200,
                    Message = "EmployeeAPI Deleted"
                });
            }
        }
        [HttpGet("get_all_employees")]
        public IActionResult GetAllEmployees()
        {
            var employees = _context.employeeModels.AsQueryable();
            return Ok(new
            {
                StatusCode = 200,
                EmployeeDetails= employees
            });
        }
        [HttpGet("get_employee/id")]
        public IActionResult Getemployee(int id)
        {
            var employee = _context.employeeModels.Find(id);
            if(employee == null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "User Not Found"
                });
            }
            else
            {
                return Ok(new
                {
                    StatusCode = 200,
                    EmployeeDetail = employee
                });
            }
        }

        //[HttpGet("page")]
        //public async Task<ActionResult<User>> GetData(int pageNumber = 1, int pageSize = 5, string? role = null)
        //{
        //    try
        //    {
        //        Expression<Func<User, bool>> filter = x => (role == null || x.Role == role);
        //        var data = await _employeeRepository.GetPagedAsync(filter, pageNumber, pageSize);
        //        var totalItems = await _employeeRepository.GetTotalCountAsync(filter);

        //        if (totalItems != null)
        //        {
        //            // Return the paged data and total count
        //            return Ok(new { data, totalItems });
        //        }
        //        else
        //        {
        //            return BadRequest("'totalItems' field missing in the data.");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        // Handle any exceptions and return an appropriate error response
        //        return StatusCode(500, $"An error occurred: {ex.Message}");
        //    }
        //}
        [HttpGet("page")]
        public async Task<ActionResult<EmployeeModel>> GetData(int pageNumber = 1, int pageSize = 5, string? role = null)
        {
            try
            {
                // Apply filtering based on the role
                IQueryable<EmployeeModel> filteredData = _context.employeeModels;
                if (!string.IsNullOrEmpty(role))
                {
                    // Assuming 'Id' is the property to compare with 'role' (change as needed)
                    filteredData = filteredData.Where(x => x.Id.ToString() == role);
                }

                // Calculate the total number of items
                int totalItems = await filteredData.CountAsync();

                // Retrieve the paged data
                var data = await filteredData.Skip((pageNumber - 1) * pageSize)
                                             .Take(pageSize)
                                             .ToListAsync();

                return Ok(new { data, totalItems });
            }
            catch (Exception ex)
            {
                // Handle any exceptions and return an appropriate error response
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }




        [HttpGet("sortedByFirstName")]
        public IActionResult GetSortedDataByFirstName()
        {
            try
            {
                // Fetch employee data from the database and sort it by first name
                var sortedData = _context.employeeModels.OrderBy(e => e.FirstName).ToList();

                return Ok(new
                {
                    StatusCode = 200,
                    SortedEmployeeData = sortedData
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}

