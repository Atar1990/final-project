//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ClassLibrary1
{
    using System;
    using System.Collections.Generic;
    
    public partial class AidComplex
    {
        public int AidComplexesKey { get; set; }
        public int OptionsKey { get; set; }
        public string AidComplexesOpenHours { get; set; }
        public Nullable<long> AidComplexesPhone { get; set; }
        public string AidComplexesName { get; set; }
        public string AidComplexesLocationCountry { get; set; }
        public Nullable<float> AidComplexesLongitude { get; set; }
        public Nullable<float> AidComplexesLatitude { get; set; }
        public Nullable<float> AidComplexesFinallandmark { get; set; }
        public string AidComplexesPersona { get; set; }
        public string AidComplexesDescription { get; set; }
        public string AidComplexesPhoto { get; set; }
    
        public virtual Option Option { get; set; }
    }
}
