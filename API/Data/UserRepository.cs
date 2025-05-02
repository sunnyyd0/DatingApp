using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
  public class UserRepository(DataContext context,IMapper mapper) : IUserRepository
  {
    public async Task<MemberDto?> GetMemberAsync(string username)
    {
      return await context.Users
             .Where(x => x.UserName == username)
             .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
             .SingleOrDefaultAsync();
    }

    public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
    {
     var query=  context.Users.AsQueryable();
     query=query.Where(x=>x.UserName!=userParams.CurrentUserName);
       if (userParams.Gender != null) 
         {
             query = query.Where(x => x.Gender == userParams.Gender);
         }
             query = userParams.OrderBy switch
         {
             "created" => query.OrderByDescending(x => x.CreatedAt),
             _ => query.OrderByDescending(x => x.LastActive)
         };
     var minDob=DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge-1));
      var maxDob=DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));
       query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);
     return  await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(mapper.ConfigurationProvider),userParams.PageNumber,userParams.pageSize);
             
    }

    public async Task<AppUser?> GetUserByIdAsync(int id)
    {
       return await context.Users.FindAsync(id);
    }

    public async Task<AppUser?> GetUserByUsernameAsync(string username)
    {
        var user=await context.Users.Include(x=>x.Photos).SingleOrDefaultAsync(x => x.UserName == username.ToLower());
        return user;
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
      return await context.Users.Include(x=>x.Photos).ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
      return await context.SaveChangesAsync() > 0;
    }

    public void Update(AppUser user)
    {
       context.Entry(user).State = EntityState.Modified;
    }
  }
}