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
    public class JobAdController : ControllerBase
    {
        public SignUpContext Context { get; set; }

        public JobAdController(SignUpContext context)
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
                return Ok(await Context.JobAds.Include(j => j.Users).FirstOrDefaultAsync(p => p.ID == id));
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
                return Ok(await Context.JobAds.ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("AddJobAd/{companyId}")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Add([FromBody] JobAd jobad, int companyId)
        {
            try
            {
                if(jobad.Deadline < DateTime.Now)
                    return BadRequest("Deadline not valid!");
                Company company = await Context.Companies.Include(c => c.Ads).FirstOrDefaultAsync(c => c.ID == companyId);
                jobad.Company = company;
                company.Ads.Add(jobad);
                Context.JobAds.Add(jobad);
                await Context.SaveChangesAsync();
                return CreatedAtAction(nameof(Get), new { id = jobad.ID }, jobad);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("Apply/{jobid}/{username}")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Apply(int jobid, string username)
        {
            try
            {
                User user = await Context.Users.Include(u => u.Ads).FirstOrDefaultAsync(u => u.Username == username);

                if(user == null)
                    return BadRequest("User does not exist!");

                JobAd jobad = await Context.JobAds.Include(j => j.Users).FirstOrDefaultAsync(jb => jb.ID == jobid);

                User checkUser = jobad.Users.Find(u => u.Username == username);

                if(checkUser != null)
                    return BadRequest("User has already applied for that job!");

                user.Ads.Add(jobad);
                jobad.Users.Add(user);

                jobad.NumApl++;
                Context.JobAds.Update(jobad);

                await Context.SaveChangesAsync();
                return Ok("User applied for JobAd!");
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }

        [Route("UpdateJobAd")]
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Update([FromBody] JobAd jobad)
        {
            try
            {
                Context.JobAds.Update(jobad);
                await Context.SaveChangesAsync();
                return Ok("JobAd updated!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("DeleteJobAd/{id}")]
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                JobAd jobad = await Context.JobAds.FindAsync(id);     
                Context.JobAds.Remove(jobad);
                await Context.SaveChangesAsync();
                return Ok("JobAd deleted!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}