using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignUp_BE.Models;

namespace SignUp_BE.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        public SignUpContext Context { get; set; }

        public UserController(SignUpContext context)
        {
            Context = context;
        }

        [Route("Get/{id}")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Get(int id)
        {
            try
            {
                return Ok(await Context.Users.FindAsync(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("GetAll")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> GetAll()
        {
            try
            {
                return Ok(await Context.Users.ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("AddUser")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Add([FromBody] User user)
        {
            if (string.IsNullOrWhiteSpace(user.Username) || user.Username.Length > 30)
            {
                return BadRequest("Username error!");
            }

            if (string.IsNullOrWhiteSpace(user.FirstName) || user.FirstName.Length > 30)
            {
                return BadRequest("First Name error!");
            }

            if (string.IsNullOrWhiteSpace(user.LastName) || user.LastName.Length > 30)
            {
                return BadRequest("Last Name error!");
            }

            try
            {
                Context.Users.Add(user);
                await Context.SaveChangesAsync();
                return CreatedAtAction(nameof(Get), new { id = user.ID }, user);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("UpdateUser")]
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Update([FromBody] User user)
        {
            if (string.IsNullOrWhiteSpace(user.Username) || user.Username.Length > 30)
            {
                return BadRequest("Username error!");
            }

            if (string.IsNullOrWhiteSpace(user.FirstName) || user.FirstName.Length > 30)
            {
                return BadRequest("First Name error!");
            }

            if (string.IsNullOrWhiteSpace(user.LastName) || user.LastName.Length > 30)
            {
                return BadRequest("Last Name error!");
            }

            try
            {
                Context.Users.Update(user);
                await Context.SaveChangesAsync();
                return Ok("User updated!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("DeleteUser/{id}")]
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                User user = await Context.Users.Include(u => u.Ads).FirstOrDefaultAsync(u => u.ID == id);

                user.Ads.ForEach(ad => {
                    ad.NumApl--;
                    Context.JobAds.Update(ad);
                });

                Context.Users.Remove(user);
                await Context.SaveChangesAsync();
                return Ok("User deleted!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}