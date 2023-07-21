﻿using ClassLibrary1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.DTO;
using NLog;
using System.Web.Http.Cors;


namespace WebApplication1.Controllers
{
    public class FavouritesController : ApiController
    {
        EnableCorsAttribute enableCorsAttribute = new EnableCorsAttribute("*", "*", "*");

        igroup199_prodEntities db = new igroup199_prodEntities();
        private static Logger logger = LogManager.GetCurrentClassLogger();
        // GET api/<controller>
        [HttpGet]
        [Route("api/Favourites/{userwmailfromuser}/Getall")] // הדפסת כל המועדפים
        public IHttpActionResult Getall(string userwmailfromuser)
        {
            try
            {
                List<ForFevPerUser> favourites = db.ForFevPerUsers.Where(x=>x.Fuseremail== userwmailfromuser).ToList();
                List<UserFavouritesDTO> userFavouritesDTOs = new List<UserFavouritesDTO>();
                foreach (var item3 in favourites)
                {
                    userFavouritesDTOs.Add(new UserFavouritesDTO
                    {
                        FkeyDTO = item3.Fkey,
                        FdescriptionDTO = item3.Fdescription,
                        FlatDTO = (double)item3.Flat,
                        FlotDTO = (double)item3.Flot,
                        FnameDTO = item3.Fname,
                        FphotoDTO = item3.Fphoto,
                        FuseremailDTO = item3.Fuseremail,
                        FcountryDTO = item3.Fcontry
                    });
                }
                logger.Info($"all UserFavourites was shown \n statusCode:{HttpStatusCode.OK}");
                return Ok(userFavouritesDTOs);
            }
            catch (Exception)
            {
                logger.Error($"something went wrong! cant be found user favourites \n statusCode:{HttpStatusCode.NotFound}");
                return NotFound();
            }
        }

        [HttpGet]
        [Route("api/Favourites/{FavKey}/GetByName")] // הדפסת מועדפים ספציפי
        public IHttpActionResult GetByName(int FavKey)
        {
            List<ForFevPerUser> favourites = db.ForFevPerUsers.ToList();
            List<UserFavouritesDTO> userFavouritesDTOs = new List<UserFavouritesDTO>();
            foreach (var item in favourites)
            {
                if (item.Fkey == FavKey)
                {
                    userFavouritesDTOs.Add(new UserFavouritesDTO
                    {
                        FkeyDTO = item.Fkey,
                        FdescriptionDTO = item.Fdescription,
                        FlatDTO = (double)item.Flat,
                        FlotDTO = (double)item.Flot,
                        FnameDTO = item.Fname,
                        FphotoDTO = item.Fphoto,
                        FuseremailDTO = item.Fuseremail,
                        FcountryDTO = item.Fcontry
                    });
                }
            }
            logger.Info($"specific favourite was found \n statusCode:{HttpStatusCode.OK}");
            return Ok(userFavouritesDTOs);
        }

        // POST api/<controller>
        [HttpPost]
        [Route("api/Favourites/{OptINTindb}/{Favemail}/PostAddFav")] // הוספת הפידבק לטבלה הרצויה
        public IHttpActionResult PostAddFav(int OptINTindb, string Favemail)
        {
            //int maxFevKey = db.ForFevPerUsers.Max(x => x.Fkey);
            List<Trip> trips = db.Trips.ToList();
            List<Attraction> Attractions = db.Attractions.ToList();
            List<AidComplex> AidComplexs = db.AidComplexes.ToList();
            List<SleepingComplex> SleepingComplexs = db.SleepingComplexes.ToList();
            List<ForFevPerUser> ForFevPerUsers = db.ForFevPerUsers.ToList();

            foreach (var item in trips)
            {
                if (item.OptionsKey==OptINTindb)
                {
                    var newfav = new ForFevPerUser
                    {
                        Fcontry = item.TripsLocationCountry,
                        Fdescription = item.TripsDescription,
                        Fkey = 1,
                        Flat = (float)item.TripsLatitude,
                        Flot = (float)item.TripsLongitude,
                        Fname = item.TripsName,
                        Fphoto = item.TripsPhoto,
                        Fuseremail = Favemail
                    };
                    db.ForFevPerUsers.Add(newfav);
                }
            }
            foreach (var item in Attractions)
            {
                if (item.OptionsKey == OptINTindb)
                {
                    var newfav = new ForFevPerUser
                    {
                        Fcontry = item.AttractionsLocationCountry,
                        Fdescription = item.AttractionDescription,
                        Fkey =  1,
                        Flat = (float)item.AttractionsLatitude,
                        Flot = (float)item.AttractionsLongitude,
                        Fname = item.AttractionsName,
                        Fphoto = item.AttractionPhoto,
                        Fuseremail = Favemail
                    };
                    db.ForFevPerUsers.Add(newfav);
                }
            }
            foreach (var item in AidComplexs)
            {
                if (item.OptionsKey == OptINTindb)
                {
                    var newfav = new ForFevPerUser
                    {
                        Fcontry = item.AidComplexesLocationCountry,
                        Fdescription = item.AidComplexesDescription,
                        Fkey =  1,
                        Flat = (float)item.AidComplexesLatitude,
                        Flot = (float)item.AidComplexesLongitude,
                        Fname = item.AidComplexesName,
                        Fphoto = item.AidComplexesPhoto,
                        Fuseremail = Favemail
                    };
                    db.ForFevPerUsers.Add(newfav);
                }
            }
            foreach (var item in SleepingComplexs)
            {
                if (item.OptionsKey == OptINTindb)
                {
                    var newfav = new ForFevPerUser
                    {
                        Fcontry = item.SleepingComplexesLocationCountry,
                        Fdescription = item.SleepingComplexesDescription,
                        Fkey =  1,
                        Flat = (float)item.SleepingComplexesLatitude,
                        Flot = (float)item.SleepingComplexesLongitude,
                        Fname = item.SleepingComplexesName,
                        Fphoto = item.SleepingComplexesPhoto,
                        Fuseremail = Favemail
                    };
                    db.ForFevPerUsers.Add(newfav);
                }
            }
            db.SaveChanges();
            return Ok();
        }

        // DELETE api/<controller>/5
        [HttpDelete]
        [Route("api/Favourites/DeleteFavourites/{DeleteFavouritesIDfromdb}")] // מחיקת מועדף ספציפי
        public IHttpActionResult DeleteFavourites(int DeleteFavouritesIDfromdb)
        {
            try
            {
                ForFevPerUser OptionFavouriteToDelete = db.ForFevPerUsers.Where(x => x.Fkey == DeleteFavouritesIDfromdb).FirstOrDefault();
                db.ForFevPerUsers.Remove(OptionFavouriteToDelete);
                db.SaveChanges();
                logger.Info($"Favourite was update in DB \n statusCode:{HttpStatusCode.OK}");
                return Ok();
            }
            catch (Exception)
            {
                logger.Error($"something went wrong! cant be found Favourite to delete \n statusCode:{HttpStatusCode.NotFound}");
                return NotFound();
            }
        }
    }
}