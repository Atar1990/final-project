using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class UserFavouritesDTO
    {
        public int FkeyDTO { get; set; }
        public string FnameDTO { get; set; }
        public double FlatDTO { get; set; }
        public double FlotDTO { get; set; }
        public string FdescriptionDTO { get; set; }
        public string FphotoDTO { get; set; }
        public string FuseremailDTO { get; set; }
        public string FcountryDTO { get; set; }
    }
}