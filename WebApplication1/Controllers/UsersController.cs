﻿using ClassLibrary1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using NLog;
using WebApplication1.DTO;
using System.Web.Helpers;

namespace WebApplication1.Controllers
{
    public class UsersController : ApiController
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        igroup199_prodEntities db = new igroup199_prodEntities();

        [HttpGet]
        [Route("api/users/getnmame/")]
        public HttpResponseMessage getnmame()
        {
            List<UsersDTO> usersDTO = new List<UsersDTO>();
            List<User> users = db.Users.ToList();
            foreach (var item in users)
            {
                usersDTO.Add(new UsersDTO
                {

                    UserEmail = item.UserEmail,
                    UserFirstName = item.UserFirstName,
                    UserLastName = item.UserLastName,
                    UserType = item.UserType,
                    UserImg = item.UserImg,
                    UserBudget = 1,
                    UserPassword = "1111",
                    UserTimeTraveling = 1111111,
                    UserLatPosition = 111,
                    UserLotPosition = 111,
                    Userphonenumber = 455667,
                    Numberoffrieds = 0
                });;
            }
            return Request.CreateResponse(HttpStatusCode.OK,usersDTO);
        }

        [HttpGet]
        [Route("api/users/getusersplace/")]
        public HttpResponseMessage getusersplace()
        {
            List<UsersDTO2> usersDTO2 = new List<UsersDTO2>();
            List<User> users = db.Users.ToList();
            foreach (var item in users)
            {
                DateTime currentTime = DateTime.Now;
                TimeSpan threeHours = TimeSpan.FromHours(3);
                DateTime currentTimePlus3Hours = currentTime.Subtract(threeHours);

                if (currentTimePlus3Hours < currentTime.Date + item.UserTimeSpan)
                {
                    usersDTO2.Add(new UsersDTO2
                    {
                        UserFirstName = item.UserFirstName,
                        UserLastName = item.UserLastName,
                        UserLatPosition = (float)item.UserLotPosition,
                        UserLotPosition = (float)item.UserLatPosition,
                        UserTimeSpan = (TimeSpan)item.UserTimeSpan,
                        Useremail = item.UserEmail
                    }); ;
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK, usersDTO2);
        }

        [HttpGet]
        [Route("api/users/getemail/")]
        public HttpResponseMessage GetByEmail(string email)
        {
            UsersDTO user = new UsersDTO(); // הכנת אובקייט מסוג משתמש שטוח
            string emailGet = email;
            try
            {
                user = db.Users.Select(u => new UsersDTO()
                {
                    UserEmail = u.UserEmail,
                    UserFirstName = u.UserFirstName,
                    UserLastName = u.UserLastName,
                    UserType = u.UserType,
                    UserImg = u.UserImg,
                    UserBudget = (float)u.UserBudget,
                    UserPassword = u.UserPassword,
                    UserTimeTraveling = (int)u.UserTimeTraveling,
                    //UserLatPosition = 111,
                    //UserLotPosition = 111,
                    //Userphonenumber = (int)u.UserPhoneNumber,
                    //UserTimeSpan = (TimeSpan)u.UserTimeSpan,
                    //Numberoffrieds = 0

                }).SingleOrDefault(x => x.UserEmail == emailGet);// בהינתן שנמצא המייל - השמה של הערך באובייקט יוזר
                logger.Info($"user {email} was created \n statusCode:{HttpStatusCode.OK}");
            }
            catch (Exception e)
            {
                logger.Error($"user {email} cant be found DB \n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }

            if (user != null)
            {
                logger.Info($"user {email} was found in the DB \n statusCode:{HttpStatusCode.OK}");
                return Request.CreateResponse(HttpStatusCode.OK, user);// שליחת סטטוס קוד 200 + את המשתמש
            }
            logger.Error($"user {email} are not exsist \n statusCode:{HttpStatusCode.NotFound}");
            return Request.CreateResponse(HttpStatusCode.NotFound, "user email are not exsist.");// אם כתובת המייל לא נמצא במשתמשי המערכת שלנו, יחזור סטטוס קוד 404 ללא שליחת אובייקט

        }

        [HttpPost]
        [Route("api/signup")]
        public HttpResponseMessage Signup([FromBody] UsersDTO user)
        {
            try
            {
                int maxTravelKey = db.TravelDiaries.Max(x => x.TravelDiaryKey);
                User u = null;
                u = db.Users.Where(x => x.UserEmail == user.UserEmail).FirstOrDefault();
                TravelDiary t = db.TravelDiaries.Where(x => x.UserEmail == user.UserEmail).FirstOrDefault();
                if (u != null)
                {
                    logger.Error($"user allready found DB \n statusCode:{HttpStatusCode.NotFound}");
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }
                else
                {
                    User newUser = new User();
                    newUser.UserEmail = user.UserEmail;
                    newUser.UserPassword = user.UserPassword;
                    newUser.UserFirstName = user.UserFirstName;
                    newUser.UserLastName = user.UserLastName;
                    newUser.UserImg = user.UserImg;
                    newUser.UserType = user.UserType;
                    newUser.UserBudget = user.UserBudget;
                    newUser.UserTimeTraveling = 1;
                    newUser.UserPhoneNumber = user.Userphonenumber;
                    newUser.NumberOfFriends = 1;
                    newUser.UserLatPosition = 0;
                    newUser.UserLotPosition = 0;
                    newUser.UserTimeSpan = TimeSpan.Zero;
                    db.Users.Add(newUser);
                    TravelDiary tn = new TravelDiary();
                    tn.UserEmail = user.UserEmail;
                    tn.TravelDiaryKey = maxTravelKey + 1;
                    tn.NumberOfChapters = 0;
                    db.TravelDiaries.Add(tn);
                    db.SaveChangesAsync();
                    logger.Info($"new user was created in the DB \n statusCode:{HttpStatusCode.OK}");

                    return Request.CreateResponse(HttpStatusCode.OK, "OK");
                }
            }
            catch (Exception e)
            {
                logger.Error($"somting wrong! user cant be created \n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());
            }

        }
        [HttpPut]
        [Route("api/users/putid/{id}")]
        public HttpResponseMessage PutById(int id, [FromBody] string UserType)
        {
            UsersDTO user = new UsersDTO(); // הכנת אובקייט מסוג משתמש שטוח
            List<UsersDTO> users = new List<UsersDTO>();// הכנת רשימת אובייקטים מסוג משתמש שטוח
            try
            {
                users = db.Users.Select(u => new UsersDTO()
                {
                    UserEmail = u.UserEmail,
                    UserFirstName = u.UserFirstName,
                    UserLastName = u.UserLastName,
                    UserType = u.UserType


                }).ToList();// הבאת כל המשתמשים מהדאטה בייס שלנו והשמה ברשימה משתמשים שטוחים

                string UserEmail = users[id].UserEmail;
                var userC = db.Users.Where(x => x.UserEmail == UserEmail).FirstOrDefault();
                logger.Info($"user was found in the DB \n statusCode:{HttpStatusCode.OK}");

                //db.Entry(userC).State = EntityState.Modified;

                if (id >= users.Count())
                {
                    logger.Error($"id cant be found DB \n statusCode:{HttpStatusCode.NotFound}");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "undifind id");// אם נשלח מספר גדול יותר ממספר המשתמשי שלנו במערכרת נחסוך את זמן הריצה לחייפוש ונשלח שגיאה
                }

                userC.UserType = UserType;
                db.SaveChanges();
                logger.Info($"user was chenged in the DB \n statusCode:{HttpStatusCode.OK}");
                return Request.CreateResponse(HttpStatusCode.OK, userC.UserType);// שליחת סטטוס קוד 200 + את הטייפ החדש

            }
            catch (Exception e)
            {
                logger.Error($"somting wrong! usertype cant be changed \n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }

        }

        [HttpPut]
        [Route("api/users/PutlocationById/{userEmail}/{userLatPosition}/{userLotPosition}/")]
        public HttpResponseMessage PutlocationById(string userEmail, float userLatPosition, float userLotPosition)
        {
            DateTime now = DateTime.Now;
            TimeSpan currentTime = now - now.Date;
            List<User> users = db.Users.ToList();
            foreach (var item in users)
            {
                if (item.UserEmail == userEmail)
                {
                    item.UserEmail = item.UserEmail;
                    item.UserLatPosition = userLatPosition;
                    item.UserLotPosition = userLotPosition;
                    item.UserTimeSpan = currentTime;
                }
            }
            db.SaveChanges();

            return Request.CreateResponse(HttpStatusCode.OK);// שליחת סטטוס קוד 200 + את הטייפ החדש
            
        }

        [HttpPut]
        [Route("api/users/putemail/type/")]
        public HttpResponseMessage PutByEmail(string email, [FromBody] string UserType)
        {
            User user = new User(); // הכנת אובקייט מסוג משתמש שטוח
            try
            {
                user = db.Users.Where(x => x.UserEmail == email).SingleOrDefault();// משיחת האובייקט משתמש על פי המייל שהוזן
                logger.Info($"user email was found in the DB \n statusCode:{HttpStatusCode.OK}");
                if (user != null)
                {

                    user.UserType = UserType;
                    db.SaveChanges();
                    logger.Info($"user was chenged in the DB \n statusCode:{HttpStatusCode.OK}");
                    return Request.CreateResponse(HttpStatusCode.OK, user.UserType);// שליחת סטטוס קוד 200 + את הטייפ החדש

                }
                logger.Error($"email cant be found DB \n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.NotFound, "undifind email");//שליחת שגיאה 404 לא נמצא לפי מייל

            }
            catch (Exception e)
            {
                logger.Error($"somting wrong! usertype cant be changed \n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }

        }

        [HttpPut]
        [Route("api/users/putemail/password")]
        public HttpResponseMessage PutPassword(string email, [FromBody] string password)
        {
            User user = new User(); // הכנת אובקייט מסוג משתמש שטוח
            try
            {

                user = db.Users.Where(x => x.UserEmail == email).SingleOrDefault();// משיחת האובייקט משתמש על פי המייל שהוזן
                logger.Info($"user email was found in the DB \n statusCode:{HttpStatusCode.OK}");
                if (user != null)
                {
                    if (password.Length < 6)
                    {
                        logger.Error($"userpassword is too short \n statusCode:{HttpStatusCode.NotFound}");
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "sory - password must be at list 6 chars");// נפילה - שליחת שגיאה

                    }
                    user.UserPassword = password;
                    logger.Info($"user userpassword was cheange in the DB \n statusCode:{HttpStatusCode.OK}");
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, user.UserPassword);// שליחת סטטוס קוד 200 + את הטייפ החדש

                }
                logger.Error($"somting wrong! user cant be found \n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.NotFound, "undifind email");//שליחת שגיאה 404 לא נמצא לפי מייל
            }
            catch (Exception e)
            {
                logger.Error($"somting wrong! userpassword cant be changed \n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }

        }

        [HttpPut]
        [Route("api/users/PutImg")]
        public HttpResponseMessage PutImg(string email, [FromBody] string Img)
        {
            User user = new User(); // הכנת אובקייט מסוג משתמש שטוח
            try
            {

                user = db.Users.Where(x => x.UserEmail == email).SingleOrDefault();// משיחת האובייקט משתמש על פי המייל שהוזן
                logger.Info($"user email was found in the DB \n statusCode:{HttpStatusCode.OK}");
                if (user != null)
                {
                    if (Img.Length < 6)
                    {
                        logger.Error($"userpassword is too short \n statusCode:{HttpStatusCode.NotFound}");
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "sory - password must be at list 6 chars");// נפילה - שליחת שגיאה

                    }
                    user.UserImg = Img;
                    logger.Info($"user userpassword was cheange in the DB \n statusCode:{HttpStatusCode.OK}");
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, user.UserImg);// שליחת סטטוס קוד 200 + את הטייפ החדש

                }
                logger.Error($"somting wrong! user cant be found \n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.NotFound, "undifind email");//שליחת שגיאה 404 לא נמצא לפי מייל
            }
            catch (Exception e)
            {
                logger.Error($"somting wrong! userpassword cant be changed \n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }

        }

        [HttpPut]
        [Route("api/users/putall/")]
        public HttpResponseMessage PutAll(string email, [FromBody] UsersDTO user)
        {/// לאחר עדכון של המודל יש לעדכן את האבייקט השטוח ובהתאמה את מה שמתקבל מהבודי והעדכון- לאחר מכן נוכל לעשות פוט אחד על הכל
            User userFromDB = new User(); // הכנת אובקייט מסוג משתמש 
            try
            {
                userFromDB = db.Users.Where(x => x.UserEmail == email).SingleOrDefault();// משיחת האובייקט משתמש על פי המייל שהוזן
                logger.Info($"user email was found in the DB \n statusCode:{HttpStatusCode.OK}");
                if (userFromDB != null)
                {
                    userFromDB.UserType = user.UserType;
                    userFromDB.UserFirstName = user.UserFirstName;
                    userFromDB.UserLastName = user.UserLastName;
                    userFromDB.UserPassword = user.UserPassword;
                    userFromDB.UserImg = user.UserImg;
                    userFromDB.UserBudget = user.UserBudget;
                    userFromDB.UserEmail = user.UserEmail;
                    userFromDB.UserTimeTraveling = user.UserTimeTraveling;
                    userFromDB.NumberOfFriends = user.Numberoffrieds;
                    userFromDB.UserPhoneNumber = user.Userphonenumber;
                    
                    db.SaveChanges();
                    logger.Info($"user was update in the DB \n statusCode:{HttpStatusCode.OK}");
                    return Request.CreateResponse(HttpStatusCode.OK, user);// שליחת סטטוס קוד 200 + את הטייפ החדש

                }
                logger.Error($"somting wrong! user cant be found \n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.NotFound, "undifind email");//שליחת שגיאה 404 לא נמצא לפי מייל

            }
            catch (Exception e)
            {
                logger.Error($"somting wrong! user cant be changed \n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }

        }

        // POST api/<controller>
        [HttpPost]
        [Route("api/login")]
        public dynamic Login([FromBody] UsersDTO user)
        {
            try
            {
                var users = db.Users.Select(x => new UsersDTO
                {
                    UserEmail = x.UserEmail,
                    UserFirstName = x.UserFirstName,
                    UserLastName = x.UserLastName,
                    UserPassword = x.UserPassword,
                    UserBudget = (float)x.UserBudget,
                    UserImg = x.UserImg,
                    Userphonenumber = (int)x.UserPhoneNumber,
                    UserTimeTraveling = (int)x.UserTimeTraveling,
                    UserType = x.UserType,
                    Numberoffrieds = (int)x.NumberOfFriends,


                }).Where(u => u.UserEmail == user.UserEmail && u.UserPassword == user.UserPassword).FirstOrDefault();
                if (users == null)
                {
                    return false;
                }
                logger.Info($"user was found in the DB \n statusCode:{HttpStatusCode.OK}");
                return Request.CreateResponse(HttpStatusCode.OK, users);// שליחת סטטוס קוד 200 + את הטייפ החדש
            }
            catch (Exception e)
            {
                logger.Error($"somting wrong! user cant be found \n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }
        }


        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }

        [HttpGet]
        [Route("api/users/getid/{id}")] //בהרצה לעומר
        public HttpResponseMessage GetID(int id)
        {
            UsersDTO user = new UsersDTO(); // הכנת אובקייט מסוג משתמש שטוח
            List<UsersDTO> users = new List<UsersDTO>();// הכנת רשימת אובייקטים מסוג משתמש שטוח
            try
            {
                users = db.Users.Select(u => new UsersDTO()
                {
                    UserEmail = u.UserEmail,
                    UserFirstName = u.UserFirstName,
                    UserLastName = u.UserLastName,
                    UserType = u.UserType,
                    UserImg = u.UserImg


                }).ToList();// הבאת כל המשתמשים מהדאטה בייס שלנו והשמה ברשימה משתמשים שטוחים
                logger.Info($"users was found in the DB \n statusCode:{HttpStatusCode.OK}");
                if (id >= users.Count())
                {
                    logger.Error($"somting wrong! id cant be found \n statusCode:{HttpStatusCode.NotFound}");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "undifind id");// אם נשלח מספר גדול יותר ממספר המשתמשי שלנו במערכרת נחסוך את זמן הריצה לחייפוש ונשלח שגיאה
                }

                foreach (var userT in users)// ריצה על כל המשתמשים שלנו
                {
                    if (userT.UserEmail == users[id].UserEmail)// אם המייל נמצא אצל אחד ממשתמי המערכת שלנו, שישו ושימחו
                    {
                        user = userT;// אם נמצא, מעתה משתמש שטוח שהוכן בראש הפונקציה יהיה עם ערכים מלאים של המתמש ויוחזר
                    }
                }
            }
            catch (Exception e)
            {
                logger.Error($"somting wrong! user cant be found \n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }

            if (user != null)
            {
                logger.Info($"user was found in the DB \n statusCode:{HttpStatusCode.OK}");
                return Request.CreateResponse(HttpStatusCode.OK, user);// שליחת סטטוס קוד 200 + את המשתמש
            }
            return Request.CreateResponse(HttpStatusCode.NotFound, "");// אם כתובת המייל לא נמצא במשתמשי המערכת שלנו, יחזור סטטוס קוד 404 ללא שליחת אובייקט

        }

        [HttpPut]
        [Route("api/users/putemail/budget")]
        public HttpResponseMessage PutBudget(string email, [FromBody] float budget)
        {
            User user = new User(); // הכנת אובקייט מסוג משתמש שטוח
            try
            {

                user = db.Users.Where(x => x.UserEmail == email).SingleOrDefault();// משיחת האובייקט משתמש על פי המייל שהוזן

                if (user != null)
                {
                    if (budget < 5000)
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "sory - Budget must be at list 5000 shekel");// נפילה - שליחת שגיאה

                    }
                    user.UserBudget = budget;
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, user.UserBudget);// שליחת סטטוס קוד 200 + את הטייפ החדש

                }
                return Request.CreateResponse(HttpStatusCode.NotFound, "undifind email");//שליחת שגיאה 404 לא נמצא לפי מייל

            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }

        }

    }
}