using Antlr.Runtime.Misc;
using ClassLibrary1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography.X509Certificates;
using System.Web.Http;
using WebApplication1.DTO;
using NLog;
using Newtonsoft.Json.Linq;

namespace WebApplication1.Controllers
{
    public class FeedbackController : ApiController
    {
        igroup199_prodEntities db = new igroup199_prodEntities();
        private static Logger logger = LogManager.GetCurrentClassLogger();
        [HttpGet]
        [Route("api/Feedback")] // הדפסת כל הפידבקים
        public IHttpActionResult Getall()
        {
            try
            {
                List<Feedback> feedbacks = db.Feedbacks.ToList();
                List<FeedbackDTO> feedbackDTOs = new List<FeedbackDTO>();
                foreach (Feedback item in feedbacks)
                {
                    feedbackDTOs.Add(new FeedbackDTO
                    {
                        FeedbackKey = item.FeedbackKey,
                        KindOfFeedback = item.KindOfFeedback,
                        FeedbackDescription = item.FeedbackDescription,
                        FeedbackCountry = item.FeedbackCountry,
                        FeedbackLatitude = (float)item.FeedbackLatitude,
                        FeedbackLongitude = (float)item.FeedbackLongitude,
                        FeedbackRegionOfTheCountry = item.FeedbackRegionOfTheCountry,
                        FeedbackTitle = item.FeedbackTitle,
                        FeedbackPhoto = item.FeedbackPhoto

                    });
                }
                logger.Info($"all feedbacks was shown \n statusCode:{HttpStatusCode.OK}");
                return Ok(feedbackDTOs);
            }
            catch (Exception)
            {
                logger.Error($"something went wrong! cant be found feedbackes \n statusCode:{HttpStatusCode.NotFound}");
                return NotFound(); 
            }
        }

        [HttpGet]
        [Route("api/Feedback/{FeedbackKey}/GetByName")] // הדפסת פידבק ספציפי
        public IHttpActionResult GetByName(int FeedbackKey)
        {
            try
            {
                List<Feedback> feedbacks = db.Feedbacks.ToList();
                List<FeedbackDTO> feedbackDTOs = new List<FeedbackDTO>();
                foreach (var item in feedbacks)
                {
                    if (item.FeedbackKey == FeedbackKey)
                    {
                        feedbackDTOs.Add(new FeedbackDTO
                        {
                            FeedbackKey = item.FeedbackKey,
                            KindOfFeedback = item.KindOfFeedback,
                            FeedbackDescription = item.FeedbackDescription,
                            FeedbackCountry = item.FeedbackCountry,
                            FeedbackLatitude = (float)item.FeedbackLatitude,
                            FeedbackLongitude = (float)item.FeedbackLongitude,
                            FeedbackRegionOfTheCountry = item.FeedbackRegionOfTheCountry,
                            FeedbackTitle = item.FeedbackTitle,
                            FeedbackPhoto = item.FeedbackPhoto,
                            FeedbackPersona = item.FeedbackPersona
                        });
                    }
                }
                logger.Info($"feedback was found \n statusCode:{HttpStatusCode.OK}");
                return Ok(feedbackDTOs);
            }
            catch (Exception)
            {
                logger.Error($"something went wrong! cant be found feedbacke \n statusCode:{HttpStatusCode.NotFound}");
                return NotFound();
            }
        }

        [HttpPost]
        [Route("api/Feedback/{feedbackINTindb}/PostNew/")] // הוספת הפידבק לטבלה הרצויה
        public IHttpActionResult PostNew(int feedbackINTindb, [FromBody] JObject obj)
        {
            var feedbacksepc = db.Feedbacks.Where(x => x.FeedbackKey == feedbackINTindb).First();
            logger.Info($"feedback was found \n statusCode:{HttpStatusCode.OK}");
            int maxFevKey = db.UserFavourites.Max(x => x.FavouritesKey);
            int maxOptKey = db.Options.Max(x => x.OptionsKey);
            int maxAtrrKey = db.Attractions.Max(x => x.AttractionsKey);
            int maxTripKey = db.Trips.Max(x => x.TripsKey);
            int maxAidCom = db.AidComplexes.Max(x => x.AidComplexesKey);
            int maxSleeAidKey = db.SleepingComplexes.Max(x => x.SleepingComplexesKey);

            try
            {
                var userfevoritenew = new UserFavourite
                {
                    FavouritesKey = maxFevKey + 1,
                    UserEmail = "admin@gmail.com",
                    CountryName = feedbacksepc.FeedbackCountry,
                    UserFavouritesRegionOfTheCountry = feedbacksepc.FeedbackRegionOfTheCountry,
                    Titel = feedbacksepc.FeedbackTitle,
                    Description = feedbacksepc.KindOfFeedback
                };
                db.UserFavourites.Add(userfevoritenew);
                var newoption = new Option
                {
                    OptionsKey = maxOptKey + 1,
                    FavouritesKey = userfevoritenew.FavouritesKey,
                    OptionsLikeDislike = "D",
                    OptionName = feedbacksepc.FeedbackTitle,
                    OptionLocationCountry = feedbacksepc.FeedbackCountry,
                    OptionsRegionOfTheCountry = feedbacksepc.FeedbackCountry,
                };
                db.Options.Add(newoption);
                if (feedbacksepc.KindOfFeedback == "Attractions")
                {
                    var newattraction = new Attraction
                    {
                        AttractionsKey = maxAtrrKey + 1,
                        OptionsKey = newoption.OptionsKey,
                        KindOfAttraction = "omega",
                        AttractionsTimeInMinutes = 0,
                        AttractionsCost = 0,
                        NumberOfRepeatAttractions = 1,
                        AttractionsName = feedbacksepc.FeedbackTitle,
                        AttractionsLocationCountry = newoption.OptionLocationCountry,
                        AttractionsRegionOfTheCountry = newoption.OptionsRegionOfTheCountry,
                        AttractionsLongitude = feedbacksepc.FeedbackLongitude,
                        AttractionsLatitude = feedbacksepc.FeedbackLatitude,
                        AttractionsFinallandmark = (float)1.1,
                        AttractionsPersona = obj["FeedbackPersona"].ToString(),
                        AttractionDescription = feedbacksepc.FeedbackDescription,
                        AttractionPhoto = feedbacksepc.FeedbackPhoto,
                    };
                    db.Attractions.Add(newattraction);
                    db.Feedbacks.Remove(feedbacksepc);
                }
                if (feedbacksepc.KindOfFeedback == "Trips")
                {
                    var newattrip = new Trip
                    {
                        TripsKey = maxTripKey + 1,
                        OptionsKey = newoption.OptionsKey,
                        KindOfTrips = "climbing",
                        TripsTimeInMinutes = 0,
                        TripsCost = 0,
                        NumberOfRepeatTrips = 1,
                        TripsName = feedbacksepc.FeedbackTitle,
                        TripsLocationCountry = newoption.OptionLocationCountry,
                        TripsRegionOfTheCountry = newoption.OptionsRegionOfTheCountry,
                        TripsLongitude = feedbacksepc.FeedbackLongitude,
                        TripsLatitude = feedbacksepc.FeedbackLatitude,
                        TripsFinallandmark = (float)1.1,
                        TripsPersona = obj["FeedbackPersona"].ToString(),
                        TripsDescription = feedbacksepc.FeedbackDescription,
                        TripsPhoto= feedbacksepc.FeedbackPhoto,
                    };
                    db.Trips.Add(newattrip);
                    db.Feedbacks.Remove(feedbacksepc);
                }
                if (feedbacksepc.KindOfFeedback == "AidComplexes")
                {
                    var newAidComplexes = new AidComplex
                    {
                        AidComplexesKey = maxAidCom + 1,
                        OptionsKey = newoption.OptionsKey,
                        AidComplexesOpenHours = "24/7",
                        AidComplexesPhone = 0,
                        AidComplexesName = feedbacksepc.FeedbackTitle,
                        AidComplexesLocationCountry = feedbacksepc.FeedbackRegionOfTheCountry,
                        AidComplexesLongitude = feedbacksepc.FeedbackLongitude,
                        AidComplexesLatitude = feedbacksepc.FeedbackLatitude,
                        AidComplexesFinallandmark = (float)1.1,
                        AidComplexesPersona= "כולם",
                        AidComplexesDescription= feedbacksepc.FeedbackDescription,
                        AidComplexesPhoto= feedbacksepc.FeedbackPhoto,
                    };
                    db.AidComplexes.Add(newAidComplexes);
                    db.Feedbacks.Remove(feedbacksepc);
                }
                if (feedbacksepc.KindOfFeedback == "SleepingComplexes")
                {
                    var newSleepingComplexes = new SleepingComplex
                    {
                        SleepingComplexesKey = maxSleeAidKey + 1,
                        OptionsKey = newoption.OptionsKey,
                        SleepingComplexesCost = 0,
                        NumberOfNightsSleepingComplexes = 1,
                        SleepingComplexesName = feedbacksepc.FeedbackTitle,
                        SleepingComplexesLocationCountry = newoption.OptionLocationCountry,
                        SleepingComplexesRegionOfTheCountry = newoption.OptionsRegionOfTheCountry,
                        SleepingComplexesLongitude = feedbacksepc.FeedbackLongitude,
                        SleepingComplexesLatitude = feedbacksepc.FeedbackLatitude,
                        SleepingComplexesFinallandmark = (float)1.1,
                        SleepingComplexesPersona = obj["FeedbackPersona"].ToString(),
                        SleepingComplexesDescription = feedbacksepc.FeedbackDescription,
                        SleepingComplexesPhoto= feedbacksepc.FeedbackPhoto,
                    };
                    db.SleepingComplexes.Add(newSleepingComplexes);
                    db.Feedbacks.Remove(feedbacksepc);
                }
                
                db.SaveChanges();
                logger.Info($"feedback was found \n statusCode:{HttpStatusCode.OK}");
                return Ok();
            }
            catch (Exception)
            {
                logger.Error($"something went wrong! cant be found feedbacke to add to DB \n statusCode:{HttpStatusCode.NotFound}");
                return NotFound();
            }
        }
        //api/Feedback/{feedbackINTindb}/PostNew
        [HttpPost] // הוספת פרק
        [Route("api/Feedback/PostFeed/{useremail}/")]
        public IHttpActionResult PostFeed(string useremail,[FromBody] FeedbackDTO newFeed)
        {
            User u = db.Users.Where(x => x.UserEmail == useremail).First();
            int maxFEEDKey = db.Feedbacks.Max(x => x.FeedbackKey);
            var feedbacknew = new Feedback();
            try
            {
                feedbacknew.FeedbackKey = maxFEEDKey + 1;
                feedbacknew.KindOfFeedback = newFeed.KindOfFeedback;
                feedbacknew.FeedbackDescription = newFeed.FeedbackDescription;
                feedbacknew.FeedbackLongitude = (float)1.1;
                feedbacknew.FeedbackLatitude = (float)1.1;
                feedbacknew.FeedbackCountry = newFeed.FeedbackCountry;
                feedbacknew.FeedbackRegionOfTheCountry = newFeed.FeedbackRegionOfTheCountry;
                feedbacknew.FeedbackTitle = newFeed.FeedbackTitle;
                feedbacknew.FeedbackPhoto = newFeed.FeedbackPhoto;
                feedbacknew.FeedbackPersona = u.UserType;

                if (feedbacknew != null)
                {
                    db.Feedbacks.Add(feedbacknew);
                }
                db.SaveChanges();
                logger.Info($"feedback has been added \n statusCode:{HttpStatusCode.OK}");
            }
            catch (Exception)
            {
                logger.Error($"somthing went worng!\n statusCode:{HttpStatusCode.BadRequest}");
                return NotFound();
            }
            return Ok();
        }

        [HttpPost] // הוספת פרק
        [Route("api/Feedback/PostFeedfromadmin/{useremail}/")]
        public IHttpActionResult PostFeedfromadmin(string useremail, [FromBody] FeedbackDTO newFeed)
        {
            User u = db.Users.Where(x => x.UserEmail == useremail).First();
            int maxFEEDKey = db.Feedbacks.Max(x => x.FeedbackKey);
            var feedbacknew = new Feedback();
            try
            {
                feedbacknew.FeedbackKey = maxFEEDKey + 1;
                feedbacknew.KindOfFeedback = newFeed.KindOfFeedback;
                feedbacknew.FeedbackDescription = newFeed.FeedbackDescription;
                feedbacknew.FeedbackLongitude = newFeed.FeedbackLongitude;
                feedbacknew.FeedbackLatitude = newFeed.FeedbackLatitude;
                feedbacknew.FeedbackCountry = newFeed.FeedbackCountry;
                feedbacknew.FeedbackRegionOfTheCountry = newFeed.FeedbackRegionOfTheCountry;
                feedbacknew.FeedbackTitle = newFeed.FeedbackTitle;
                feedbacknew.FeedbackPhoto = newFeed.FeedbackPhoto;
                feedbacknew.FeedbackPersona = newFeed.FeedbackPersona;

                if (feedbacknew != null)
                {
                    db.Feedbacks.Add(feedbacknew);
                }
                db.SaveChanges();
                logger.Info($"feedback has been added \n statusCode:{HttpStatusCode.OK}");
            }
            catch (Exception)
            {
                logger.Error($"somthing went worng!\n statusCode:{HttpStatusCode.BadRequest}");
                return NotFound();
            }
            return Ok();
        }

        [HttpPut] //שינוי תאור פרק
        [Route("api/Feedback/PutUpdateFeed/{feedKey}/")]
        public HttpResponseMessage PutUpdateFeed(int feedKey, [FromBody] FeedbackDTO newfeed)
        {
            int maxchapkey = db.Chapters.Max(x => x.ChapterKey);
            try
            {
                int feedID = feedKey;
                var feedParameters = db.Feedbacks.Where(x => x.FeedbackKey == feedKey).FirstOrDefault();
                logger.Info($"chapter has been found \n statusCode:{HttpStatusCode.OK}");
                if (feedParameters.KindOfFeedback != newfeed.KindOfFeedback)
                {
                    feedParameters.KindOfFeedback = newfeed.KindOfFeedback;
                }
                if (feedParameters.FeedbackDescription != newfeed.FeedbackDescription)
                {
                    feedParameters.FeedbackDescription = newfeed.FeedbackDescription;
                }
                if (feedParameters.FeedbackLongitude != newfeed.FeedbackLongitude)
                {
                    feedParameters.FeedbackLongitude = newfeed.FeedbackLongitude;
                }
                if (feedParameters.FeedbackLatitude != newfeed.FeedbackLatitude)
                {
                    feedParameters.FeedbackLatitude = newfeed.FeedbackLatitude;
                }
                if (feedParameters.FeedbackCountry != newfeed.FeedbackCountry)
                {
                    feedParameters.FeedbackCountry = newfeed.FeedbackCountry;
                }
                if (feedParameters.FeedbackRegionOfTheCountry != newfeed.FeedbackRegionOfTheCountry)
                {
                    feedParameters.FeedbackRegionOfTheCountry = newfeed.FeedbackRegionOfTheCountry;
                }
                if (feedParameters.FeedbackTitle != newfeed.FeedbackTitle)
                {
                    feedParameters.FeedbackTitle = newfeed.FeedbackTitle;
                }
                if (feedParameters.FeedbackPhoto != newfeed.FeedbackPhoto)
                {
                    feedParameters.FeedbackPhoto = newfeed.FeedbackPhoto;
                }
                if (feedParameters.FeedbackPersona != newfeed.FeedbackPersona)
                {
                    feedParameters.FeedbackPersona = newfeed.FeedbackPersona;
                }
                newfeed.FeedbackKey = feedParameters.FeedbackKey;
                db.SaveChanges();
                logger.Info($"chapter has been update \n statusCode:{HttpStatusCode.OK}");
                return Request.CreateResponse(HttpStatusCode.OK, feedParameters.FeedbackTitle);// שליחת סטטוס קוד 200 + את שם פרק החדש 
            }
            catch (Exception e)
            {
                logger.Error($"somthing went worng!\n statusCode:{HttpStatusCode.BadRequest}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }
        }

        [HttpDelete]
        [Route("api/Feedback/DeleteFeedback/{feedbackIDfromdb}")] // מחיקת פידבק ספציפי
        public IHttpActionResult DeleteFeedback(int feedbackIDfromdb)
        {
            try
            {
                Feedback feedbackToDelete = db.Feedbacks.Where(x => x.FeedbackKey == feedbackIDfromdb).FirstOrDefault();
                if (feedbackIDfromdb == 0)
                {
                    logger.Error($" cant be found feedback \n statusCode:{HttpStatusCode.NotFound}");
                    return BadRequest("Invalid feedback name value.");
                }
                logger.Info($"feedback to delete was found \n statusCode:{HttpStatusCode.OK}");
                db.Feedbacks.Remove(feedbackToDelete);
                db.SaveChanges();
                logger.Info($"feedback  was deleted from DB \n statusCode:{HttpStatusCode.OK}");
                return Ok();
            }
            catch (Exception)
            {
                logger.Error($"something went wrong! cant be found feedbacke to delete \n statusCode:{HttpStatusCode.NotFound}");
                return NotFound();
            }
        }
    }
}