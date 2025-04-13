using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class UsersController : BaseApiController
    {
        private readonly DataContext _context;
        public UsersController(DataContext context)   
        {
            _context=context;
        }

        [AllowAnonymous]

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>>GetUsers(){
            return Ok(await _context.Users.ToListAsync());

        }
        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<AppUser>> GetUser(int id){
            var user= await _context.Users.FindAsync(id);
            if(user==null){return NotFound();}
            return Ok(user);
        }

    }
}