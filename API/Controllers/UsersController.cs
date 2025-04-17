using System;
using System.Collections.Generic;
using System.Linq;
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
          var users=await userRepository.GetUsersAsync();
          var members=mapper.Map<IEnumerable<MemberDto>>(users);
          return Ok(members);

        }
     
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username){
            var user= await userRepository.GetUserByUsernameAsync(username);
            if(user==null){return NotFound();}
            return Ok(mapper.Map<MemberDto>(user));
            
        }

    }
}