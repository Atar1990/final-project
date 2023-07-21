using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class UsersDTO
    {
        public string UserEmail { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string UserType { get; set; }
        public string UserImg { get; set; }
        public string UserPassword { get; set; }
        public float UserBudget { get; set; }
        public int UserTimeTraveling { get; set; }
        public int Numberoffrieds { get; set; }
        public int Userphonenumber { get; set; }
        public float UserLatPosition { get; set; }
        public float UserLotPosition { get; set; }
        public TimeSpan UserTimeSpan { get; set; }
    }
}