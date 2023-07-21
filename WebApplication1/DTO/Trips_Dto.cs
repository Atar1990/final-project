using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class Trips_Dto
    {
        public int TripsKey { get; set; }
        public int OptionKey { get; set; }
        public string TripsName { get; set; }
        public string TripsLocationCountry { get; set; }
        public float TripsLongitude { get; set; }
        public float TripsLatitude { get; set; }
        public string TripsDescription { get; set; }
        public string TripsPhoto { get; set; }
        public string TripsPersona { get; set; }
    }
}