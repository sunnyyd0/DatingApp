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

     [Required] public string? KnownAs { get; set; }
     [Required] public string? Gender { get; set; }
     [Required] public string? DateOfBirth { get; set; }
     [Required] public string? City { get; set; }
     [Required] public string? Country { get; set; }
        
        [Required]
        [StringLength(4)]
        public  string Password { get; set; } =string.Empty;
    }
}