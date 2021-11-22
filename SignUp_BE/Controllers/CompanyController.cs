using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignUp_BE.Models;

namespace SignUp_BE.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CompanyController : ControllerBase
    {
        public SignUpContext Context { get; set; }

        public CompanyController(SignUpContext context)
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
                return Ok(await Context.Companies.Include(c => c.Ads).FirstOrDefaultAsync(c => c.ID == id));
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
                return Ok(await Context.Companies.Include(c => c.Ads).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("AddCompany")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Add([FromBody] Company company)
        {
            try
            {
                Context.Companies.Add(company);
                await Context.SaveChangesAsync();
                return Ok("Company added!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("UpdateCompany")]
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Update([FromBody] Company company)
        {
            try
            {
                Context.Companies.Update(company);
                await Context.SaveChangesAsync();
                return Ok("Company updated!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("DeleteCompany/{id}")]
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                Company company = await Context.Companies.Include(c => c.Ads).FirstOrDefaultAsync(c => c.ID == id);
                
                company.Ads.ForEach(ad =>
                {
                    Context.JobAds.Remove(ad);
                });

                Context.Companies.Remove(company);
                await Context.SaveChangesAsync();
                return Ok("Company deleted!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}