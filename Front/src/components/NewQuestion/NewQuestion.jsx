import React, { useEffect, useState } from "react";
import "./NewQuestion.css";
import TopOfAplication from "../TopOfAplication";
import { useNavigate } from "react-router-dom";
import { getEnv } from "../../utils/env";

function NewQuestion(props) {

  useEffect(() => {
    const apiUrl = getEnv() + '/users/getemail/?email=';
    fetch(apiUrl+props.userEmailFromDB,
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8',
        })

      })
      .then(response => {
        console.log('response= ', response);
        console.log('response statuse=', response.status);
        console.log('response.ok=', response.ok)

        return response.json()
      })
      .then(
        (result) => {
          console.log("result=", result.UserFirstName);
          const sendUser = () => { props.getUser(result) }
          sendUser();/// העברת המשתמש כולו
          console.log('first name=', result.UserFirstName)
          console.log('first name=', result.UserLastName)
          console.log('budget=', result.UserBudget)

        },
        (error) => {
          console.log("err post=", error);
        });

  }, [])



  const nav = useNavigate();

  const onEnd = () => {/// זמני , ישונה אחרי שנבנה את קלקולייט- ניתן לייצר מהקריאה אלמנט ורק לשלוח את הערך
      if (scoreM > scoreC && scoreM >scoreB) {
        const apiUrl = getEnv() + '/users/putemail/type/?email='
        fetch(apiUrl + props.userEmailFromDB,
          {
            method: 'PUT',
            body: JSON.stringify('מוצילר'),
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
              'Accept': 'application/json; charset=UTF-8',
            })

          })
          .then(response => {
            console.log('response= ', response);
            console.log('response statuse=', response.status);
            console.log('response.ok=', response.ok)
          },
            (error) => {
              console.log("err post=", error);
            });

        // return'PersonaM'
        nav('/PersonaM')
      }
      else if (scoreB >scoreC && scoreB >scoreC) {
        const apiUrl = getEnv() + '/users/putemail/type/?email='
        fetch(apiUrl+props.userEmailFromDB,
          {
            method: 'PUT',
            body: JSON.stringify('בליין'),
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
              'Accept': 'application/json; charset=UTF-8',
            })

          })
          .then(response => {
            console.log('response= ', response);
            console.log('response statuse=', response.status);
            console.log('response.ok=', response.ok)
          },
            (error) => {
              console.log("err post=", error);
            });

        // return 'PersonaB'
        nav('/PersonaB')

      }
      else if (scoreC >= scoreB && scoreC >=scoreM) {
        const apiUrl = getEnv() + '/users/putemail/type/?email='
        fetch(apiUrl+props.userEmailFromDB,
          {
            method: 'PUT',
            body: JSON.stringify('ציל'),
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
              'Accept': 'application/json; charset=UTF-8',
            })

          })
          .then(response => {
            console.log('response= ', response);
            console.log('response statuse=', response.status);
            console.log('response.ok=', response.ok)
          },
            (error) => {
              console.log("err post=", error);
            });
        nav('/PersonaC')
        // return 'PersonaC'
      }
    }
  
  // Properties
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const [scoreM, setScoreM] = useState(0);
  const [scoreC, setScoreC] = useState(0);
  const [scoreB, setScoreB] = useState(0);



  const questions = [
    {
      text: "מה הכי חשוב לך בבחירת הוסטל ?",
      options: [
        { id: 0, text: "קרוב למרכז ולמקומות בילוי", isCorrect: "B" },
        { id: 1, text: "שיהיה זול", isCorrect: "M" },
        { id: 2, text: "שיהיו מקומות ישיבה להזרק", isCorrect: "C" },
      ],
    },
    {
      text: "שאני מגיע ליעד, אני מעוניין להתשקע בו",
      options: [
        { id: 0, text: "יום יומיים וממשיכים", isCorrect: "M" },
        { id: 1, text: "ברור, לאן אני ממהר?", isCorrect: "C" },
        { id: 2, text: "כל עוד יש איפה לצאת בערב", isCorrect: "B" },
      ],
    },
    {
      text: "אני מחפש להכיר חברים חדשים",
      options: [
        { id: 0, text: "כל עוד הם בראש לצאת לטיולים יחד", isCorrect: "M" },
        { id: 1, text: "רק אם הם אוהבים לבלות", isCorrect: "B" },
        { id: 2, text: "בכיף, מי שבא בא", isCorrect: "C" },
      ],
    },
    {
      text: "מה הדבר שהכי חשוב לך לדעת בהגעה ליעד חדש ?",
      options: [
        { id: 0, text: "איפה יוצאים בערב ?", isCorrect: "B" },
        { id: 1, text: "רגע, רק הגעתי, כמה ימים אני אבין כבר", isCorrect: "C" },
        { id: 2, text: "המלצות לטרקים וטיולי יום", isCorrect: "M" },
      ],
    },
    {
      text: "לאן אתה מתכנן לטוס ?",
      options: [
        { id: 0, text: "דרום/מרכז אמריקה", isCorrect: "B" },
        { id: 1, text: "מזרח", isCorrect: "C" },
        { id: 2, text: "עוד לא החלטתי", isCorrect: "M" },
      ],
    },
    {
      text: "הטיול הגדול בשבילי זה...",
      options: [
        { id: 0, text: "לחגוג את החיים", isCorrect: "B" },
        { id: 1, text: "לראות נופים ותרבויות חדשות", isCorrect: "M" },
        { id: 2, text: "לנקות את הראש", isCorrect: "C" },
      ],
    },
    {
      text: "אני אוהב יותר",
      options: [
        { id: 0, text: "ישיבות וסטאלבט עם חברים", isCorrect: "M" },
        { id: 1, text: "קרחנות ובילויים", isCorrect: "C" },
        { id: 2, text: "טבע וטיולים", isCorrect: "M" },
      ],
    },
  ];

  // Helper Functions

  /* A possible answer was clicked */
  const optionClicked = (isCorrect) => {
    // Increment the score
    if (isCorrect==="M") {
      setScoreM(scoreM + 1);
    }
    if (isCorrect==="C") {
      setScoreC(scoreC + 1);
    }
    if (isCorrect==="B") {
      setScoreB(scoreB + 1);
    }
    setScore(score+1)
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }

  };

  /* Resets the game back to default */
  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
    setScoreC(0);
    setScoreM(0);
    setScoreB(0);
    onEnd();


  };

  return (
    <>
      <TopOfAplication label='שאלות היכרות' />
    <div className="NewQuestion">

      {showResults ? (
        /* 4. Final Results */
        <div className="final-results">
          <h1>סיכום תוצאות</h1>
          <h2>
          {scoreM} | {scoreC} | {scoreB}

          </h2>
          <button onClick={() => restartGame()}>לחץ לסיום</button>
        </div>
      ) : (
        /* 5. Question Card  */
        <div className="question-card">
          
          {/* Current Question  */}
          <h3>
            שאלה: {currentQuestion + 1} מתוך {questions.length}
          </h3>
          <h4 className="question-text">{questions[currentQuestion].text}</h4>

          {/* List of possible answers  */}
          <ul>
            {questions[currentQuestion].options.map((option) => {
              return (
                <li className="uiQ"
                  key={option.id}
                  onClick={() => optionClicked(option.isCorrect)}
                >
                  {option.text}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
    </>
  );
}

export default NewQuestion;
