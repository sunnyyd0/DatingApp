using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
                
    [ApiController]
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        
    }
}