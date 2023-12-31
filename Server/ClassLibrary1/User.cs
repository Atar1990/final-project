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
    
    public partial class User
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public User()
        {
            this.TalkWiths = new HashSet<TalkWith>();
            this.TalkWiths1 = new HashSet<TalkWith>();
            this.TravelDiaries = new HashSet<TravelDiary>();
            this.UserFavourites = new HashSet<UserFavourite>();
            this.Countries = new HashSet<Country>();
        }
    
        public string UserEmail { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public Nullable<int> NumberOfFriends { get; set; }
        public Nullable<long> UserPhoneNumber { get; set; }
        public string UserType { get; set; }
        public string UserPassword { get; set; }
        public string UserImg { get; set; }
        public Nullable<float> UserBudget { get; set; }
        public Nullable<int> UserTimeTraveling { get; set; }
        public Nullable<float> UserLatPosition { get; set; }
        public Nullable<float> UserLotPosition { get; set; }
        public Nullable<System.TimeSpan> UserTimeSpan { get; set; }
    
        public virtual SelectedBy SelectedBy { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TalkWith> TalkWiths { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TalkWith> TalkWiths1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TravelDiary> TravelDiaries { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<UserFavourite> UserFavourites { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Country> Countries { get; set; }
    }
}
