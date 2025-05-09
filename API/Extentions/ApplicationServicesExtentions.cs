using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extentions
{
    public static class ApplicationServicesExtentions
    {
     public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config){
        services.AddDbContext<DataContext>(options =>{
           options.UseSqlite(config.GetConnectionString("DefaultConnection"));
        });
        services.AddScoped<ITokenService,TokenService>();
        services.AddScoped<IUserRepository,UserRepository>();
        services.AddScoped<ILikesRepository,LikeRepository>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
        services.AddScoped<IPhotoService,PhotoService>();    
        services.AddScoped<LogUserActivity>();
         return services;
        }
        
        
       
        
    }
}