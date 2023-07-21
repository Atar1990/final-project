using ClassLibrary1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using NLog;
using WebApplication1.DTO;


public class UserExpense
{
    public string UserId { get; set; }
    public string ExpenseType { get; set; }
    public double Price { get; set; }
}

public class UserSimilarityCalculator
{

    public Dictionary<string, double> CalculateSimilarity(List<UserExpense> expenses, string targetUserId)

    {
        Dictionary<string, double> scores = new Dictionary<string, double>();

        // Filter expenses by target user
        var targetExpenses = expenses.Where(e => e.UserId == targetUserId).ToList();

        // Calculate the magnitude of the target user's expense vector
        double targetMagnitude = CalculateMagnitude(targetExpenses);

        // Calculate the cosine similarity for each user
        foreach (var userExpenses in expenses.GroupBy(e => e.UserId))
        {
            string userId = userExpenses.Key;
            var userExpenseList = userExpenses.ToList();

            if (userId != targetUserId)
            {
                // Calculate the magnitude of the current user's expense vector
                double userMagnitude = CalculateMagnitude(userExpenseList);

                // Calculate the dot product between the target user and the current user
                double dotProduct = CalculateDotProduct(targetExpenses, userExpenseList);

                // Calculate the cosine similarity
                double similarity = dotProduct / (targetMagnitude * userMagnitude);

                Console.WriteLine($"Similarity between User {targetUserId} and User {userId}: {similarity}");
                scores.Add(userId, similarity);
            }
        }

        return scores;
    }

    static double CalculateMagnitude(List<UserExpense> expenses)
    {
        double sumOfSquares = expenses.Sum(e => e.Price * e.Price);
        return Math.Sqrt(sumOfSquares);
    }

    static double CalculateDotProduct(List<UserExpense> expenses1, List<UserExpense> expenses2)
    {
        double dotProduct = 0;

        foreach (var expense1 in expenses1)
        {
            var expense2 = expenses2.FirstOrDefault(e => e.ExpenseType == expense1.ExpenseType);
            if (expense2 != null)
            {
                dotProduct += expense1.Price * expense2.Price;
            }
        }

        return dotProduct;
    }
}


namespace WebApplication1.Controllers
{
    public class ExpensesController : ApiController
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        igroup199_prodEntities db = new igroup199_prodEntities();

        [HttpGet]
        [Route("api/expenses/{ExpensesKey}")]
        public HttpResponseMessage Get(int ExpensesKey)
        {
            //ExpensesDTO expens = new ExpensesDTO(); // הכנת אובקייט מסוג הוצאה שטוח
            ExpensesDTO expense = new ExpensesDTO();// הכנת רשימת אובייקטים מסוג משתמש שטוח
            try
            {
                int numOfExpenses2 = db.Expenses.Max(x => x.ExpensesKey);//// מה הקוד הגדול ביותר 


                if (numOfExpenses2 < ExpensesKey)// אם מספר ההוצאה שהתקבל למחיקה גדול מהמספר של הפתח הגדול ביותר שנשמר עד כה - זרוק שגיאה מתאימה
                {
                    logger.Error($"user try to get expose from DB\n ExpensesKey is {ExpensesKey}- too big \n statusCode:{HttpStatusCode.BadRequest}");
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "the number of expens is undifinde");// נפילה - שליחת שגיאה
                }

                expense = db.Expenses.Where(e => e.ExpensesKey == ExpensesKey).Select(e => new ExpensesDTO
                {
                    ExpensesKey = e.ExpensesKey,
                    UserEmail = e.UserEmail,
                    KindOfExpenses = e.KindOfExpenses,
                    ExpensesTitle = e.ExpensesTitle,
                    PricePerOne = e.PricePerOne,
                    NumberOfRepeatExpenses = e.NumberOfRepeatExpenses,
                    TotalPriceToPay = e.TotalPriceToPay

                }).SingleOrDefault();// אם נמצא נחזיר, אם לא נמצא אנדיפיינד

            }
            catch (Exception e)
            {
                logger.Warn(e, $"user try get expose from DB \n statusCode:{HttpStatusCode.BadRequest}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!" + e.Message.ToString());// נפילה - שליחת שגיאה

            }

            if (expense != null)
            {
                logger.Info($"user get expose by number from DB\n ExpensesKey is {ExpensesKey} \n statusCode:{HttpStatusCode.OK}");
                return Request.CreateResponse(HttpStatusCode.OK, expense);// שליחת סטטוס קוד 200 + את כל רשימת הההוצאות של אותו משתמש
            }
            logger.Error($"user get expose by number from DB\n ExpensesKey is {ExpensesKey}- expose num was deleted \n statusCode:{HttpStatusCode.NotFound}");
            return Request.CreateResponse(HttpStatusCode.NotFound, "the number of expens is deleted");// אם כתובת המייל לא נמצא במשתמשי המערכת שלנו, יחזור סטטוס קוד 404 ללא שליחת אובייקט

        }




        // GET api/<controller>/5
        //'http://localhost:65095/api/expenses/?email=Benda669@gmail.com'
        [HttpGet]
        [Route("api/expenses/")]
        public HttpResponseMessage Get(string email)
        {
            //ExpensesDTO expens = new ExpensesDTO(); // הכנת אובקייט מסוג הוצאה שטוח
            List<ExpensesDTO> expenses = new List<ExpensesDTO>();// הכנת רשימת אובייקטים מסוג משתמש שטוח
            try
            {
                expenses = db.Expenses.Where(e => e.UserEmail == email).Select(e => new ExpensesDTO
                {
                    ExpensesKey = e.ExpensesKey,
                    UserEmail = e.UserEmail,
                    KindOfExpenses = e.KindOfExpenses,
                    ExpensesTitle = e.ExpensesTitle,
                    PricePerOne = e.PricePerOne,
                    NumberOfRepeatExpenses = e.NumberOfRepeatExpenses,
                    TotalPriceToPay = e.TotalPriceToPay

                }).ToList();// הבאת כל המשתמשים מהדאטה בייס שלנו והשמה ברשימה משתמשים שטוחים
            }
            catch (Exception e)
            {
                logger.Warn(e, $"user try get expose from DB \n statusCode:{HttpStatusCode.BadRequest}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }

            if (expenses != null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, expenses);// שליחת סטטוס קוד 200 + את כל רשימת הההוצאות של אותו משתמש
            }
            logger.Error($"user try to get all exposes from DB\n statusCode:{HttpStatusCode.NotFound}");
            return Request.CreateResponse(HttpStatusCode.NotFound, " ");// אם כתובת המייל לא נמצא במשתמשי המערכת שלנו, יחזור סטטוס קוד 404 ללא שליחת אובייקט

        }

        [HttpGet]
        [Route("api/expenses/getsumof/")]
        public HttpResponseMessage GetSumOfExpenses(string email)
        {
            SumOfExpensesDTO sumAllExpenses = new SumOfExpensesDTO();

            List<ExpensesDTO> expenses = new List<ExpensesDTO>();// הכנת רשימת אובייקטים מסוג משתמש שטוח
            int sumOfExpense = 0;// סה"כ הוצאות
            int sumOfExpenseAtraction = 0;// אטרקציות
            int sumOfExpenseSleep = 0;// מקומות לינה
            int sumOfExpenseDrugs = 0;// סמים
            int sumOfExpenseFood = 0;// מזון
            int sumOfExpenseCasino = 0;// הימורים
            int sumOfExpenseParty = 0;// בילויים

            try
            {
                expenses = db.Expenses.Where(e => e.UserEmail == email).Select(e => new ExpensesDTO
                {
                    ExpensesKey = e.ExpensesKey,
                    UserEmail = e.UserEmail,
                    KindOfExpenses = e.KindOfExpenses,
                    ExpensesTitle = e.ExpensesTitle,
                    PricePerOne = e.PricePerOne,
                    NumberOfRepeatExpenses = e.NumberOfRepeatExpenses,
                    TotalPriceToPay = e.TotalPriceToPay

                }).ToList();

                if (expenses != null)
                {
                    sumOfExpense = expenses.Sum(e => e.TotalPriceToPay);/// סה"כ הוצאות עד כה
                    sumOfExpenseAtraction = expenses.Where(e => e.KindOfExpenses == "אטרקציות").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseSleep = expenses.Where(e => e.KindOfExpenses == "לינה").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseDrugs = expenses.Where(e => e.KindOfExpenses == "סמים").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseFood = expenses.Where(e => e.KindOfExpenses == "מזון").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseCasino = expenses.Where(e => e.KindOfExpenses == "הימורים").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseParty = expenses.Where(e => e.KindOfExpenses == "בילויים").Sum(e => e.TotalPriceToPay);

                    /////////////////////////////////////////////
                    sumAllExpenses.SumOfExpense = sumOfExpense;
                    sumAllExpenses.SumOfExpenseAtraction = sumOfExpenseAtraction;
                    sumAllExpenses.SumOfExpenseSleep = sumOfExpenseSleep;
                    sumAllExpenses.SumOfExpenseDrugs = sumOfExpenseDrugs;
                    sumAllExpenses.SumOfExpenseFood = sumOfExpenseFood;
                    sumAllExpenses.SumOfExpenseCasino = sumOfExpenseCasino;
                    sumAllExpenses.SumOfExpenseParty = sumOfExpenseParty;
                    ////////////////////////////////////////////////////////
                }
                else
                {
                    logger.Error($"sum of exposes faild- user email is undifind\n statusCode:{HttpStatusCode.NotFound}");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "email is undifind");// אם כתובת המייל לא נמצא במשתמשי המערכת שלנו, יחזור סטטוס קוד 404 ללא שליחת אובייקט
                }
            }
            catch (Exception e)
            {
                logger.Warn(e, $"sum of exposes faild \n statusCode:{HttpStatusCode.BadRequest}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }

            if (0 < sumOfExpense)
            {
                return Request.CreateResponse(HttpStatusCode.OK, sumOfExpense);// שליחת סטטוס קוד 200 + את כל רשימת הההוצאות של אותו משתמש
            }
            logger.Error($"sum of exposes under zere\n statusCode:{HttpStatusCode.BadRequest}");
            return Request.CreateResponse(HttpStatusCode.BadRequest, "plese check you expense list in the application");// שגיאה בחישוב הסכום שמביאה לצואה שלילת

        }

        [HttpGet]
        [Route("api/expenses/getsumofall/")]
        public HttpResponseMessage GetAllSumOfExpenses(string email)
        {
            SumOfExpensesDTO sumAllExpenses = new SumOfExpensesDTO();

            List<ExpensesDTO> expenses = new List<ExpensesDTO>();// הכנת רשימת אובייקטים מסוג משתמש שטוח
            int sumOfExpense = 0;// סה"כ הוצאות
            int sumOfExpenseAtraction = 0;// אטרקציות
            int sumOfExpenseSleep = 0;// מקומות לינה
            int sumOfExpenseDrugs = 0;// סמים
            int sumOfExpenseFood = 0;// מזון
            int sumOfExpenseCasino = 0;// הימורים
            int sumOfExpenseParty = 0;// בילויים

            try
            {
                expenses = db.Expenses.Where(e => e.UserEmail == email).Select(e => new ExpensesDTO
                {
                    ExpensesKey = e.ExpensesKey,
                    UserEmail = e.UserEmail,
                    KindOfExpenses = e.KindOfExpenses,
                    ExpensesTitle = e.ExpensesTitle,
                    PricePerOne = e.PricePerOne,
                    NumberOfRepeatExpenses = e.NumberOfRepeatExpenses,
                    TotalPriceToPay = e.TotalPriceToPay

                }).ToList();

                if (expenses != null)
                {
                    sumOfExpense = expenses.Sum(e => e.TotalPriceToPay);/// סה"כ הוצאות עד כה
                    sumOfExpenseAtraction = expenses.Where(e => e.KindOfExpenses == "אטרקציות").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseSleep = expenses.Where(e => e.KindOfExpenses == "לינה").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseDrugs = expenses.Where(e => e.KindOfExpenses == "סמים").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseFood = expenses.Where(e => e.KindOfExpenses == "מזון").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseCasino = expenses.Where(e => e.KindOfExpenses == "הימורים").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseParty = expenses.Where(e => e.KindOfExpenses == "בילויים").Sum(e => e.TotalPriceToPay);

                    /////////////////////////////////////////////
                    sumAllExpenses.SumOfExpense = sumOfExpense;
                    sumAllExpenses.SumOfExpenseAtraction = sumOfExpenseAtraction;
                    sumAllExpenses.SumOfExpenseSleep = sumOfExpenseSleep;
                    sumAllExpenses.SumOfExpenseDrugs = sumOfExpenseDrugs;
                    sumAllExpenses.SumOfExpenseFood = sumOfExpenseFood;
                    sumAllExpenses.SumOfExpenseCasino = sumOfExpenseCasino;
                    sumAllExpenses.SumOfExpenseParty = sumOfExpenseParty;
                    ////////////////////////////////////////////////////////
                }
                else
                {
                    logger.Error($"sum of exposes faild- user email is undifind\n statusCode:{HttpStatusCode.NotFound}");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "email is undifind");// אם כתובת המייל לא נמצא במשתמשי המערכת שלנו, יחזור סטטוס קוד 404 ללא שליחת אובייקט
                }
            }
            catch (Exception e)
            {
                logger.Warn(e, $"sum of exposes faild \n statusCode:{HttpStatusCode.BadRequest}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }

            if (0 < sumOfExpense)
            {
                return Request.CreateResponse(HttpStatusCode.OK, sumAllExpenses);// שליחת סטטוס קוד 200 + את כל רשימת הההוצאות של אותו משתמש
            }
            logger.Error($"sum of exposes under zere\n statusCode:{HttpStatusCode.BadRequest}");
            return Request.CreateResponse(HttpStatusCode.BadRequest, "plese check you expense list in the application");// שגיאה בחישוב הסכום שמביאה לצואה שלילת

        }







        // POST api/<controller>
        [HttpPost]
        [Route("api/expenses/post")]
        public HttpResponseMessage Post([FromBody] ExpensesDTO expense)
        {
            //List<ExpensesDTO> expenses = new List<ExpensesDTO>();// הכנת רשימת אובייקטים מסוג משתמש שטוח
            var NewExpenses = new Expens();// יצירת משתנה הוצאה - החזקה באובייקט כללי 
            try
            {

                // int lengthOf = db.Expenses.Count();// כמה שורות יש בטבלה
                int lengthOf2 = db.Expenses.Max(x => x.ExpensesKey);//// מה הקוד הגדול ביותר 

                NewExpenses.UserEmail = expense.UserEmail;
                NewExpenses.PricePerOne = expense.PricePerOne;
                NewExpenses.NumberOfRepeatExpenses = expense.NumberOfRepeatExpenses;
                NewExpenses.ExpensesTitle = expense.ExpensesTitle;
                NewExpenses.KindOfExpenses = expense.KindOfExpenses;
                //NewExpenses.ExpensesKey = lengthOf + 1;/// לפי כמות השורות שיש בטבלה פלוס אחד
                NewExpenses.ExpensesKey = lengthOf2 + 1;/// השיטה הקודמת לא מספיק טובה מכיוון שלאחר שתימחק הוצאה מאמצע הרשימה המיקום לא יהיה רלוונטי, בגלל שהמספר רץ השיטה הזו עדיפה
                NewExpenses.TotalPriceToPay = expense.TotalPriceToPay;

                if (NewExpenses.UserEmail != null)
                {
                    db.Expenses.Add(NewExpenses);// הוספה לדאטה בייס את האובייקט החדש שהתקבל
                    db.SaveChanges();
                    logger.Info($"add expose to DB by user \n statusCode:{HttpStatusCode.OK}");

                    return Request.CreateResponse(HttpStatusCode.OK, NewExpenses);// שליחת סטטוס קוד 200 + את כל רשימת הההוצאות של אותו משתמש
                }

                logger.Error($"user try to add expose to DB \n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.NotFound, "");// אם כתובת המייל לא נמצא במשתמשי המערכת שלנו או שלא נשלחה בכלל, יחזור סטטוס קוד 404 ללא שליחת אובייקט

            }
            catch (Exception e)
            {
                logger.Warn(e, $"user try toadd expose to DB \n statusCode:{HttpStatusCode.BadRequest}");

                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }
        }

        // PUT api/<controller>/5
        //public void Put(int id, string value)
        //{
        //}
        [HttpPut]
        [Route("api/expenses/put/{ExpensesKey}")]
        public HttpResponseMessage Put(int ExpensesKey, [FromBody] ExpensesDTO expense)
        {
            var NewExpenses = new Expens();// יצירת משתנה הוצאה - החזקה באובייקט כללי 
            var ExpenseToUpdate = db.Expenses.Where(x => x.ExpensesKey == ExpensesKey).SingleOrDefault();

            try
            {

                ExpenseToUpdate.UserEmail = expense.UserEmail;
                ExpenseToUpdate.PricePerOne = expense.PricePerOne;
                ExpenseToUpdate.NumberOfRepeatExpenses = expense.NumberOfRepeatExpenses;
                ExpenseToUpdate.ExpensesTitle = expense.ExpensesTitle;
                ExpenseToUpdate.KindOfExpenses = expense.KindOfExpenses;
                //NewExpenses.ExpensesKey = lengthOf + 1;/// לפי כמות השורות שיש בטבלה פלוס אחד
                //ExpenseToUpdate.ExpensesKey = ExpensesKey;/// מעודכן על ידי 
                ExpenseToUpdate.TotalPriceToPay = expense.TotalPriceToPay;

                if (ExpenseToUpdate != null)/// מספר ההוצאה לשינוי
                {
                    db.SaveChanges();
                    logger.Info($"expose changed by user \n expensNumber:{ExpensesKey}\n statusCode:{HttpStatusCode.OK}");
                    return Request.CreateResponse(HttpStatusCode.OK, ExpenseToUpdate.ExpensesKey);// שליחת סטטוס קוד 200 + את ההוצאה שעודכנה
                }
                logger.Error($"user try to change is expose \n expensNumber:{ExpensesKey}\n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.NotFound, " ");// אם כתובת המייל לא נמצא במשתמשי המערכת שלנו, יחזור סטטוס קוד 404 ללא שליחת אובייקט

            }
            catch (Exception e)
            {
                logger.Warn(e, $"user try to change is expose \n expensNumber:{ExpensesKey}\n statusCode:{HttpStatusCode.BadRequest}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }

        }


        // DELETE api/<controller>/5
        [HttpDelete]
        [Route("api/expenses/delete/{ExpensesKey}")]
        public HttpResponseMessage Delete(int ExpensesKey)
        {
            Expens expens = new Expens();// הכנת אובייקט למחיקה
            ExpensesDTO expensDTO = new ExpensesDTO();// הכנת רשימת אובייקטים מסוג משתמש שטוח
            try
            {
                int numOfExpenses2 = db.Expenses.Max(x => x.ExpensesKey);//// מה הקוד הגדול ביותר 

                //int numOfExpenses = db.Expenses.Count();/// כמה שורות של הוצאות יש בטבלה

                if (numOfExpenses2 < ExpensesKey)// אם מספר ההוצאה שהתקבל למחיקה גדול מהמספר של הפתח הגדול ביותר שנשמר עד כה - זרוק שגיאה מתאימה
                {
                    logger.Error($"user try to delete expose \n expensNumber:{ExpensesKey} -the number of expens is undifinde\n statusCode:{HttpStatusCode.NotFound}");

                    return Request.CreateResponse(HttpStatusCode.BadRequest, "the number of expens is undifinde");// נפילה - שליחת שגיאה
                }
                expensDTO = db.Expenses.Where(e => e.ExpensesKey == ExpensesKey).Select(e => new ExpensesDTO
                {
                    ExpensesKey = e.ExpensesKey,
                    UserEmail = e.UserEmail,
                    KindOfExpenses = e.KindOfExpenses,
                    ExpensesTitle = e.ExpensesTitle,
                    PricePerOne = e.PricePerOne,
                    NumberOfRepeatExpenses = e.NumberOfRepeatExpenses,
                    TotalPriceToPay = e.TotalPriceToPay

                }).SingleOrDefault();

                expens = db.Expenses.Where(e => e.ExpensesKey == ExpensesKey).SingleOrDefault();
                if (expens != null)
                {
                    db.Expenses.Remove(expens);
                    db.SaveChanges();
                    logger.Info($"expose delete by user \n expensNumber:{ExpensesKey}\n statusCode:{HttpStatusCode.OK}");

                    return Request.CreateResponse(HttpStatusCode.OK, expensDTO);// שליחת סטטוס קוד 200 + את כל רשימת הההוצאות של אותו משתמש
                }
                logger.Error($"user try to delete expose \n expensNumber:{ExpensesKey} -the number of expens is undifinde\n statusCode:{HttpStatusCode.NotFound}");
                return Request.CreateResponse(HttpStatusCode.NotFound, " ");// אם בסינגל או דיפולט קיבלנו NULL משמה אין ערך למחיקה במפתח שהתקבל

            }
            catch (Exception e)
            {
                logger.Warn(e, $"user try to deleted  expose \n expensNumber:{ExpensesKey}\n statusCode:{HttpStatusCode.BadRequest}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!" + e.Message.ToString());// נפילה - שליחת שגיאה
            }
        }

        [HttpGet]
        [Route("api/expenses/statusOfExpenses/")]
        public HttpResponseMessage StatusOfExpenses(string email)
        {
            SumOfExpensesDTO sumAllExpenses = new SumOfExpensesDTO();/// אובייקט שמחזיק את כל הסכומים בכל אחת מהקטגוריות

            List<ExpensesDTO> expenses = new List<ExpensesDTO>();// מחזיק את כל ההוצאות של המשתמש שבמערכת
            int sumOfExpense = 0;// סה"כ הוצאות
            int sumOfExpenseAtraction = 0;// אטרקציות
            int sumOfExpenseSleep = 0;// מקומות לינה
            int sumOfExpenseDrugs = 0;// סמים
            int sumOfExpenseFood = 0;// מזון
            int sumOfExpenseCasino = 0;// הימורים
            int sumOfExpenseParty = 0;// בילויים

            UsersDTO user = new UsersDTO();/// על מנת להשוות בין משתמש המערכת למשתמשים נוספים- הבאת תכונות המשתמש
            List<UsersDTO> users = new List<UsersDTO>();/// משתמשים שעונים על התנאים כפי שהגדרנו
            SumOfExpensesDTO averageAllExpenses = new SumOfExpensesDTO();/// יחזיק את ממוצאי ההוצאות על פי הפרמטרים כפי שהגדרנו בסעיף קודם

            try
            {
                expenses = db.Expenses.Where(e => e.UserEmail == email).Select(e => new ExpensesDTO
                {
                    ExpensesKey = e.ExpensesKey,
                    UserEmail = e.UserEmail,
                    KindOfExpenses = e.KindOfExpenses,
                    ExpensesTitle = e.ExpensesTitle,
                    PricePerOne = e.PricePerOne,
                    NumberOfRepeatExpenses = e.NumberOfRepeatExpenses,
                    TotalPriceToPay = e.TotalPriceToPay

                }).ToList();

                if (expenses != null)
                {
                    sumOfExpense = expenses.Sum(e => e.TotalPriceToPay);/// סה"כ הוצאות עד כה
                    sumOfExpenseAtraction = expenses.Where(e => e.KindOfExpenses == "אטרקציות").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseSleep = expenses.Where(e => e.KindOfExpenses == "לינה").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseDrugs = expenses.Where(e => e.KindOfExpenses == "סמים").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseFood = expenses.Where(e => e.KindOfExpenses == "מזון").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseCasino = expenses.Where(e => e.KindOfExpenses == "הימורים").Sum(e => e.TotalPriceToPay);
                    sumOfExpenseParty = expenses.Where(e => e.KindOfExpenses == "בילויים").Sum(e => e.TotalPriceToPay);

                    //////////////////////////////////////////////////////// עד פה שלב ראשון- על ידי קבלת מייל המשתמש סיכום של כל ההוצאות שלו בכל אחת מהקטגוריות

                    /// שלב 2 מתחיל כאן- הבאת כל המשתמשים העומדים בתנאים שהוגדרו על ידינו להשוואה
                    /// כל מי שמאופיין תחת אותו סוג פרסונה וגם בטווח זמן טיול של עד חודש הבדל (בערך מוחלט) וגם 
                    /// תקציב הטיול שלו בטווח של עד 5000 שקל ( בערך מוחלט) בהמשך ייתכנו תוספות ושינויים

                    /// הבאת המשתמשים שעומדים בתנאים


                    user = db.Users.Select(u => new UsersDTO()
                    {
                        UserEmail = u.UserEmail,
                        UserFirstName = u.UserFirstName,
                        UserLastName = u.UserLastName,
                        UserType = u.UserType,
                        UserImg = u.UserImg,
                        UserBudget = (float)u.UserBudget,
                        UserTimeTraveling = (int)u.UserTimeTraveling
                    }).SingleOrDefault(x => x.UserEmail == email);// זה המשתמש שכרגע במערכת וכל ההשוואות נעישות על סמך הנתונים שלו


                    /// ATAR START
                    var usersForSimilarity = db.Expenses.Select(e => new UserExpense(){
                        UserId = e.UserEmail,
                        ExpenseType= e.KindOfExpenses,
                         Price = e.TotalPriceToPay}).ToList();

                    var allUsers = db.Users.Select(e => e).ToList();
                    var newSimilar = new UserExpense[] { };
                    
                    foreach (var item in allUsers)
                    {

                        ArrayExtensions.Push(newSimilar, new UserExpense()
                        {
                            UserId = item.UserEmail,
                            ExpenseType = "אטרקציות",
                            Price = usersForSimilarity.Where(e => e.ExpenseType == "אטרקציות" && item.UserEmail == e.UserId).Sum(e => e.Price)
                        });
                        ArrayExtensions.Push(newSimilar, new UserExpense()
                        {
                            UserId = item.UserEmail,
                            ExpenseType = "בילויים",
                            Price = usersForSimilarity.Where(e => e.ExpenseType == "בילויים" && item.UserEmail == e.UserId).Sum(e => e.Price)
                        });
                        ArrayExtensions.Push(newSimilar, new UserExpense()
                        {
                            UserId = item.UserEmail,
                            ExpenseType = "הימורים",
                            Price = usersForSimilarity.Where(e => e.ExpenseType == "הימורים" && item.UserEmail == e.UserId).Sum(e => e.Price)
                        });
                        ArrayExtensions.Push(newSimilar, new UserExpense()
                        {
                            UserId = item.UserEmail,
                            ExpenseType = "מזון",
                            Price = usersForSimilarity.Where(e => e.ExpenseType == "מזון" && item.UserEmail == e.UserId).Sum(e => e.Price)
                        });
                        ArrayExtensions.Push(newSimilar, new UserExpense()
                        {
                            UserId = item.UserEmail,
                            ExpenseType = "סמים",
                            Price = usersForSimilarity.Where(e => e.ExpenseType == "סמים" && item.UserEmail == e.UserId).Sum(e => e.Price)
                        });
                        ArrayExtensions.Push(newSimilar, new UserExpense()
                        {
                            UserId = item.UserEmail,
                            ExpenseType = "לינה",
                            Price = usersForSimilarity.Where(e => e.ExpenseType == "לינה" && item.UserEmail == e.UserId).Sum(e => e.Price)
                        });

                    }


                    var calculator = new UserSimilarityCalculator();
                    var similarity = calculator.CalculateSimilarity(newSimilar.ToList(), email);
                    var usersIds = similarity.Where(u => u.Value > 0.9 && u.Value <= 1).Select(u => u.Key);
                    //// ATAR END


                    users = db.Users.Select(u => new UsersDTO()
                    {
                        UserEmail = u.UserEmail,
                        UserFirstName = u.UserFirstName,
                        UserLastName = u.UserLastName,
                        UserType = u.UserType,
                        UserImg = u.UserImg,
                        UserBudget = (float)u.UserBudget,
                        UserTimeTraveling = (int)u.UserTimeTraveling

                    }).Where(user_ => usersIds.Contains(user_.UserEmail)).ToList();

                    //.Where(x => x.UserType == user.UserType &&
                    //x.UserEmail != user.UserEmail &&
                    //(x.UserBudget < user.UserBudget ? user.UserBudget - x.UserBudget <= 5000 : x.UserBudget - user.UserBudget <= 5000) &&
                    //(x.UserTimeTraveling < user.UserTimeTraveling ? user.UserTimeTraveling - x.UserTimeTraveling <= 30 : x.UserTimeTraveling - user.UserTimeTraveling <= 30)).ToList();// בהינתן שנמצא המייל - השמה של הערך באובייקט י

                    // בשלב זה תחת רשימת המשתמשים שלנו יהיו כל המשתמשים שעומדים בתנאים כפי שהוגדרו על ידינו והם- 
                    // סוג מטייל באותו סוג כמו של המשתמש, תקציב הטיול בערך מוחלט על 5000 שקל , אורך הטיול בערך מוחלט עד 30 יום




                    int averageOfExpense = 0;// סה"כ הוצאות
                    int averageOfExpenseAtraction = 0;// אטרקציות
                    int averageOfExpenseSleep = 0;// מקומות לינה
                    int averageOfExpenseDrugs = 0;// סמים
                    int averageOfExpenseFood = 0;// מזון
                    int averageOfExpenseCasino = 0;// הימורים
                    int averageOfExpenseParty = 0;// בילויים



                    foreach (var item in users)
                    {
                        expenses = db.Expenses.Where(e => e.UserEmail == item.UserEmail).Select(e => new ExpensesDTO
                        {
                            ExpensesKey = e.ExpensesKey,
                            UserEmail = e.UserEmail,
                            KindOfExpenses = e.KindOfExpenses,
                            ExpensesTitle = e.ExpensesTitle,
                            PricePerOne = e.PricePerOne,
                            NumberOfRepeatExpenses = e.NumberOfRepeatExpenses,
                            TotalPriceToPay = e.TotalPriceToPay

                        }).ToList();

                        averageOfExpense += expenses.Sum(e => e.TotalPriceToPay);/// סה"כ הוצאות עד כה
                        averageOfExpenseAtraction += expenses.Where(e => e.KindOfExpenses == "אטרקציות").Sum(e => e.TotalPriceToPay);
                        averageOfExpenseSleep += expenses.Where(e => e.KindOfExpenses == "לינה").Sum(e => e.TotalPriceToPay);
                        averageOfExpenseDrugs += expenses.Where(e => e.KindOfExpenses == "סמים").Sum(e => e.TotalPriceToPay);
                        averageOfExpenseFood += expenses.Where(e => e.KindOfExpenses == "מזון").Sum(e => e.TotalPriceToPay);
                        averageOfExpenseCasino += expenses.Where(e => e.KindOfExpenses == "הימורים").Sum(e => e.TotalPriceToPay);
                        averageOfExpenseParty += expenses.Where(e => e.KindOfExpenses == "בילויים").Sum(e => e.TotalPriceToPay);
                    }

                    //// חלוקה של הסכומים שנצברו בכל אחת מהקטגוריות במספר המשתמשים שעמדו בתנאי , זאת על מנת לקבל ממוצע של הקטגוריה
                    if (users.Count() > 0)
                    {
                        averageOfExpense /= users.Count();
                        averageOfExpenseAtraction /= users.Count();
                        averageOfExpenseSleep /= users.Count();
                        averageOfExpenseDrugs /= users.Count();
                        averageOfExpenseFood /= users.Count();
                        averageOfExpenseCasino /= users.Count();
                        averageOfExpenseParty /= users.Count();
                    }

                    /// להלן ממוצעים של אלו שעומדים בכל התנאים לאחר חישוב
                    averageAllExpenses.SumOfExpense = averageOfExpense;
                    averageAllExpenses.SumOfExpenseAtraction = averageOfExpenseAtraction;
                    averageAllExpenses.SumOfExpenseSleep = averageOfExpenseSleep;
                    averageAllExpenses.SumOfExpenseDrugs = averageOfExpenseDrugs;
                    averageAllExpenses.SumOfExpenseFood = averageOfExpenseFood;
                    averageAllExpenses.SumOfExpenseCasino = averageOfExpenseCasino;
                    averageAllExpenses.SumOfExpenseParty = averageOfExpenseParty;
                }
                else
                {
                    logger.Error($"sum of exposes faild- user email is undifind\n statusCode:{HttpStatusCode.NotFound}");
                    return Request.CreateResponse(HttpStatusCode.NotFound, "email is undifind");// אם כתובת המייל לא נמצא במשתמשי המערכת שלנו, יחזור סטטוס קוד 404 ללא שליחת אובייקט
                }
            }
            catch (Exception e)
            {
                logger.Warn(e, $"sum of exposes faild \n statusCode:{HttpStatusCode.BadRequest}");
                return Request.CreateResponse(HttpStatusCode.BadRequest, "somting wrong!\n" + e.Message.ToString());// נפילה - שליחת שגיאה
            }

            if (0 < sumOfExpense)
            {
                return Request.CreateResponse(HttpStatusCode.OK, averageAllExpenses);// שליחת סטטוס קוד 200 + את כל רשימת הממצועים של כל אחת מהקטגוריות על פי הקטריונים    
            }
            logger.Error($"sum of exposes under zere\n statusCode:{HttpStatusCode.BadRequest}");
            return Request.CreateResponse(HttpStatusCode.BadRequest, "plese check you expense list in the application");// שגיאה בחישוב הסכום שמביאה לצואה שלילת

        }



    }
}

public static class ArrayExtensions
{
    public static int Push<T>(this T[] source, T value)
    {
        var index = Array.IndexOf(source, default(T));

        if (index != -1)
        {
            source[index] = value;
        }

        return index;
    }
}