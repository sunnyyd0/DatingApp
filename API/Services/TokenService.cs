using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
  public class TokenService(IConfiguration config) : ITokenService
  {
    public string CreateToken(AppUser user)
    {
      var tokenKey=config["TokenKey"]?? throw new Exception("Cannot access tokenKey from appsettings");
        if (tokenKey.Length < 64) throw new Exception("Your tokenKey needs to be longer");

        //creating the security key
         var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

         //defining claims
         var claims =new List<Claim>(){
            new (ClaimTypes.NameIdentifier,user.UserName)
         };
         //signing cred

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

          var tokenDescriptor = new SecurityTokenDescriptor
         {
             Subject = new ClaimsIdentity(claims),
             Expires = DateTime.UtcNow.AddDays(45),
             SigningCredentials = creds
         };
 
         var tokenHandler = new JwtSecurityTokenHandler();
         var token = tokenHandler.CreateToken(tokenDescriptor);
 
         return tokenHandler.WriteToken(token);
    }
  }
}