using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class RegisterDto
    {  [Required]
       [MaxLength(100)]
        public string Username { get; set; }=string.Empty;
        
        [Required]
        [StringLength(4)]
        public  string Password { get; set; } =string.Empty;
    }
}