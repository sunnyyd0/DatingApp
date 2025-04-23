using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class AccountController(DataContext context,ITokenService tokenService) : BaseApiController
    {
        
        [HttpPost("register")] // api/register
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto){
            return Ok();
            // if(await UserExists(registerDto.Username)){return BadRequest("user alerady exists");}
            //     using var hmac=new HMACSHA512();
            //     var user=new AppUser{
            //         UserName=registerDto.Username,
            //         PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
            //         PasswordSalt=hmac.Key
            //     };
            //     await context.Users.AddAsync(user);
            //     await context.SaveChangesAsync();
            //     return Ok(new UserDto{Username=user.UserName,Token=tokenService.CreateToken(user)});
        }


        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){
            var user=await context.Users.Include(x=>x.Photos).FirstOrDefaultAsync(user=>user.UserName==loginDto.Username.ToLower());
            if(user==null){return Unauthorized("invalid username ");}
            using var hmac=new HMACSHA512(user.PasswordSalt);
            var computedHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            for(var i=0;i<user.PasswordHash.Length;i++){
                if(computedHash[i]!=user.PasswordHash[i]){return Unauthorized("invalid password");}
            }
           return Ok(new UserDto{Username=user.UserName,Token=tokenService.CreateToken(user),
              PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url});

        }

        public async Task<bool> UserExists(string username){
            return await context.Users.AnyAsync((user) => user.UserName.ToLower() == username.ToLower());
        }


    }
}