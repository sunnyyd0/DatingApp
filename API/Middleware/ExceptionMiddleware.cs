using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Error;

namespace API.Middleware
{
    public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        public async Task Invoke(HttpContext context){
            try{
                await next (context);
            }
            catch (Exception e){
                logger.LogError(e,e.Message);
                context.Response.ContentType="application/json";
                context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

                var response=env.IsDevelopment()?new ApiException(context.Response.StatusCode,e.Message,e.StackTrace):
                new ApiException(context.Response.StatusCode,e.Message, "Internal server error");

                var option=new JsonSerializerOptions{
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };
                var json=JsonSerializer.Serialize(response, option);
               await context.Response.WriteAsync(json);
            }
        }
        
    }
}