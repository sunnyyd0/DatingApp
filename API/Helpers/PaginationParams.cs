using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class PaginationParams
    {
     private const int MaxPageSize = 50;
     public int PageNumber { get; set; } = 1;
     private int _pageSize = 10;
    public int pageSize
    {
        get => _pageSize;
        set => _pageSize = value;
    }
    }
}