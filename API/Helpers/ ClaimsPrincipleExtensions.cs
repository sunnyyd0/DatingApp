using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Security.Claims;
using System.Threading.Tasks;
using Mono.TextTemplating;

namespace API.Helpers
{
    public static class  ClaimsPrincipleExtensions
    {
         public static string GetUsername(this ClaimsPrincipal user){
            var username=user.FindFirstValue(ClaimTypes.Name)
         ?? throw new Exception("Cannot get username from token");
         
         return username;
         }

          public static int GetUserId(this ClaimsPrincipal user){
            var userId=user.FindFirstValue(ClaimTypes.NameIdentifier)
         ?? throw new Exception("Cannot get userId from token");
         
         return int.Parse(userId);
         }
        
    }
}