using System.Text;
using API.Data;
using API.Extentions;
using API.Interfaces;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


builder.Services.AddCors();

var app = builder.Build();


//configure The HTTP  request pipleine


app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(x=>x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200","https://localhost:4200"));

 app.UseAuthentication();
 app.UseAuthorization();

app.MapControllers();

var scope=app.Services.CreateScope();
var services=scope.ServiceProvider;
try{
  var context = services.GetRequiredService<DataContext>();
  await context.Database.MigrateAsync();
  Seed.SeedUsers(context);


}
catch(Exception ex){
  var logger=services.GetRequiredService<ILogger>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();
