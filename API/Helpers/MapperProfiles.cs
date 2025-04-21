using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Extentions;
using AutoMapper;

namespace API.Helpers
{
    public class MapperProfiles:Profile
    {
        public MapperProfiles()
        {
            CreateMap<AppUser, MemberDto>().ForMember(d=>d.PhotoUrl,o=>{o.MapFrom(s=>s.Photos.SingleOrDefault(x=>x.IsMain)!.Url);}).ForMember(d=>d.Age,o=>{o.MapFrom(s=>s.DateOfBirth.CalculateAge());});
            CreateMap<Photo,PhotoDto>();
            CreateMap<MemberUpdateDto,AppUser>();
        }
        
    }
}