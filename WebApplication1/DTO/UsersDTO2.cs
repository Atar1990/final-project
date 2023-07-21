using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class UsersDTO2
    {
       
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public float UserLatPosition { get; set; }
        public float UserLotPosition { get; set; }
        public TimeSpan UserTimeSpan { get; set; }
        public string Useremail { get; set; }
    }
}