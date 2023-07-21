
import React from 'react'
import SingelQuestion from './SingelQuestion'
import { Button } from '@mui/material';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import TopOfAplication from './TopOfAplication';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { getEnv } from '../utils/env';



export default function Question(props) {
  const nav = useNavigate();

  const onLoad = () => {/// זמני , ישונה אחרי שנבנה את קלקולייט- ניתן לייצר מהקריאה אלמנט ורק לשלוח את הערך
    if (props.pageNum == 'first') {
      nav('/secondQues')
    }
    else {
      const randomNumber = Math.ceil((Math.random() * 100));
      if (randomNumber <= 33) {
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
      else if (randomNumber <= 66) {
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
      else if (randomNumber <= 100) {
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
  }
  return (
    <>

      {props.pageNum == 'first' ? 
      <div>
        <TopOfAplication label='שאלות היכרות' />
        <img className="App-logo" src="logo.png" style={{ marginTop: '45px', alignItems:'right' }} alt='logo' />
        <SingelQuestion  q="מינך" f="אחר" s="אישה" t="גבר" />
        <SingelQuestion q="איזור מגורים" f=" דרום" s="מרכז" t="צפון" />
        <SingelQuestion q="באיזה יבשת תכננת לטייל" f="דרום אמריקה" s="מרכז אמריקה" t="מזרח" fo="לא החלטתי" />
        <SingelQuestion q="הרכב הטיסה שלך" f="לבד" s="חברים" t="בן\בת זוג" fo="מחפש פרטנר" />
        <SingelQuestion q="תקציב משוער לטיול" f="₪ 15,000" s="₪ 15,000-₪ 30,000" t="₪ 30,000-₪ 50,000" fo='₪ 50,000-₪ 70,000' l='לא מוגבל' />
        <SingelQuestion q="תקופת זמן מתוכננת" f="איזור החודש" s="חדושיים שלושה" t="שלושה ארבעה חודשים" fo='איזור החצי שנה' l='לא מוגבל' />


      </div> : ""}



      {props.pageNum == 'second' ? <div>
        <div>
          <Button onClick={() => { nav('/firstQues') }}> <ArrowBackIosNew style={{ color: 'black', marginRight: '250', position: 'absolute' }} /> </Button>
        </div>
        <img className="App-logo" src="logo.png" style={{ marginTop: '45px' }} alt='logo' />

        <h3 style={{
          color: 'black', fontSize: '20px',
          textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'
        }}> {props.userFromDB.UserFirstName}, עוד כמה שאלות וסיימנו <br /> </h3>

        <h5 style={
          {
            color: 'black', fontSize: '15px',
            textAlign: 'center', marginLeft: 'auto',
            marginRight: 'auto'
          }}>
          על השאלות הבאות יש לבחור ערך בין 1-5 מענה כנה על שאלות אילו יעזור לנו להכיר אותך טוב יותר <br />
        </h5>
        <SingelQuestion q="חשוב לי מאוד רמת הנקיון בהוסטל" f="לא מסכים בכלל" s="לא מסכים" t="ניטרלי" fo="מסכים" l="מסכים מאוד" />
        <SingelQuestion q="חייב לשלב יעדין של בטן-גב בטיול" f="לא מסכים בכלל" s="לא מסכים" t="ניטרלי" fo="מסכים" l="מסכים מאוד" />
        <SingelQuestion q="חיי לילה הם חלק משמעותי בטיול שאני מתכנן" f="לא מסכים בכלל" s="לא מסכים" t="ניטרלי" fo="מסכים" l="מסכים מאוד" />
        <SingelQuestion q="אני פתוח להצעות ורעיונות חדשים" f="לא מסכים בכלל" s="לא מסכים" t="ניטרלי" fo="מסכים" l="מסכים מאוד" />
        <SingelQuestion q="פחות מתחבר לטיולי שטח וטרקים" f="לא מסכים בכלל" s="לא מסכים" t="ניטרלי" fo="מסכים" l="מסכים מאוד" />
        <SingelQuestion q="כשאני מגיע ליעד, אני מעוניין להתשקע ולא ממהר לרוץ ליעד הבא" f="לא מסכים בכלל" s="לא מסכים" t="ניטרלי" fo="מסכים" l="מסכים מאוד" />
        <SingelQuestion q="אני מכור לאדרנלין" f="לא מסכים בכלל" s="לא מסכים" t="ניטרלי" fo="מסכים" l="מסכים מאוד" />
        <SingelQuestion q="אני מחפש להכיר חברים חדשים" f="לא מסכים בכלל" s="לא מסכים" t="ניטרלי" fo="מסכים" l="מסכים מאוד" />
        <SingelQuestion q="בכל הקשור לכספים, אני בזבזן גדול" f="לא מסכים בכלל" s="לא מסכים" t="ניטרלי" fo="מסכים" l="מסכים מאוד" />

      </div> : ""}

      <Button style={{ backgroundColor: '#598e89' }} onClick={onLoad} variant="contained">{props.pageNum == 'first' ? 'הבא' : 'לחץ לסיום'}</Button>

    </>
  )
}
