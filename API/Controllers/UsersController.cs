using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{ [Authorize]

    public class UsersController(IUserRepository userRepository,IMapper mapper,IPhotoService photoService) : BaseApiController
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
            var username=User.GetUsername();
               if (username == null) return BadRequest("No username found in token");
               var user= await userRepository.GetUserByUsernameAsync(username);
                 if (user == null) return BadRequest("Could not find user");
 
                 mapper.Map(memberUpdateDto, user);
                  if (await userRepository.SaveAllAsync()) return NoContent();
 
                return BadRequest("Failed to update the user");
     }

      [HttpPost("add-photo")]
     public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
     {
         var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
 
         if (user == null) return BadRequest("Cannot update user");
 
         var result = await photoService.AddPhotoAsync(file);
         
         if (result.Error != null) return BadRequest(result.Error.Message);
              var photo = new Photo
         {
             Url = result.SecureUrl.AbsoluteUri,
             PublicId = result.PublicId
         };
 
         user.Photos.Add(photo);
              if (await userRepository.SaveAllAsync()) 
             return CreatedAtAction(nameof(GetUser), 
                 new {username = user.UserName}, mapper.Map<PhotoDto>(photo));
 
         return BadRequest("Problem adding photo");
     }
      [HttpPut("set-main-photo/{photoId:int}")]
      public async Task<ActionResult> SetMainPhoto(int photoId){
        var user=await userRepository.GetUserByUsernameAsync(User.GetUsername());
         if (user == null) return BadRequest("Could not find user");
 
         var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
         if(photo==null ||photo.IsMain) return BadRequest("Cannot use this as main photo");
         var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
         if (currentMain != null) currentMain.IsMain = false;
         photo.IsMain = true;
 
         if (await userRepository.SaveAllAsync()) return NoContent();
 
         return BadRequest("Problem setting main photo");

      }

       [HttpDelete("delete-photo/{photoId:int}")]
     public async Task<ActionResult> DeletePhoto(int photoId){
      var user= await userRepository.GetUserByUsernameAsync(User.GetUsername());
       if (user == null) return BadRequest("User not found");
 
         var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
          if (photo == null || photo.IsMain) return BadRequest("This photo cannot be deleted");

                if (photo.PublicId != null)
         {
             var result = await photoService.DeletePhotoAsync(photo.PublicId);
             if (result.Error != null) return BadRequest(result.Error.Message);
         }
 
         user.Photos.Remove(photo);
 
         if (await userRepository.SaveAllAsync()) return Ok();
 
         return BadRequest("Problem deleting photo");
     }

     

    }
   
    

}