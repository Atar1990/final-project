using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class Attraction_Dto
    {
        public int AttractionKey { get; set; }
        public int OptionKey { get; set; }
        public string AttractionName { get; set; }
        public string AttractionCountry { get; set; }
        public float AttractionsLongitude { get; set; }
        public float AttractionsLatitude { get; set; }
        public string AttractionPhoto { get; set; }
        public string AttractionDescription { get; set; }
        public string AttractionsPersona { get; set; }

    }

}