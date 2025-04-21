using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{ [Authorize]

    public class UsersController(IUserRepository userRepository,IMapper mapper) : BaseApiController
    {
      


        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>>GetUsers(){
       
          return Ok(await userRepository.GetMembersAsync());

        }
     
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username){
            var user= userRepository.GetMemberAsync(username);
            if(user==null){return NotFound();}
            return Ok(user);
            
        }
            [HttpPut]
     public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto){
            var username=User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
               if (username == null) return BadRequest("No username found in token");
               var user= await userRepository.GetUserByUsernameAsync(username);
                 if (user == null) return BadRequest("Could not find user");
 
                 mapper.Map(memberUpdateDto, user);
                  if (await userRepository.SaveAllAsync()) return NoContent();
 
                return BadRequest("Failed to update the user");
     }

    }
}