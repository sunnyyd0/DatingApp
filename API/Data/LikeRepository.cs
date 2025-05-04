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
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
  public class LikeRepository(DataContext context,IMapper mapper) : ILikesRepository
  {
    public void AddLike(UserLike like)
    {
      context.Likes.Add(like);
    }

    public void DeleteLike(UserLike like)
    {
      context.Likes.Remove(like );
    }

    public async Task<IEnumerable<int>> GetCurrentUserLikeIds(int currentUserId)
    {
       return await context.Likes.Where(x=>x.SourceUserId==currentUserId).Select(x=>x.TargetUserId).ToListAsync();
    }

    public async Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId)
    {
      return await context.Likes.FindAsync(sourceUserId,targetUserId);
    }

    public async Task<PagedList<MemberDto>> GetUserLikes(LikesParams likesParams)
    {
      var likes= context.Likes.AsQueryable();
        IQueryable<MemberDto> query;

      switch(likesParams.Predicate){
        case "liked":
        query= likes.Where(x=>x.SourceUserId==likesParams.UserId).Select(x=>x.TargetUser).ProjectTo<MemberDto>(mapper.ConfigurationProvider);
        break;
        case "likedby":
  query= likes.Where(x=>x.TargetUserId==likesParams.UserId).Select(x=>x.SourceUser).ProjectTo<MemberDto>(mapper.ConfigurationProvider);break;
       
         default:
           var likeIds = await GetCurrentUserLikeIds(likesParams.UserId);
    query= likes
                     .Where(x => x.TargetUserId == likesParams.UserId && likeIds.Contains(x.SourceUserId))
                     .Select(x => x.SourceUser)
                     .ProjectTo<MemberDto>(mapper.ConfigurationProvider);
                 break;
      }

return await PagedList<MemberDto>.CreateAsync(query, likesParams.PageNumber, likesParams.pageSize);
    }

    public async Task<bool> SaveChanges()
    {
     return await context.SaveChangesAsync() > 0;
    }
  }
}