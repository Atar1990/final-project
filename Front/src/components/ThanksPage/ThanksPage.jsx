import React from 'react'
import './ThanksPage.css'
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import  manthanks from '../../assets/manthanks.png'
import  thanks from '../../assets/thanks.png';
import TopOfAplication from '../TopOfAplication';
import Navigation from '../Navigation';
function ThanksPage() {
    const navigate = useNavigate();
  return ( //דף תודה רבה לאחר הוספת פיידבק מהמשתמש
    <div>
        <div className='thanks center'>
        <TopOfAplication label='תודה רבה!'  />      
      <br></br>
      <br></br>
      <img className='book-image' src={manthanks}></img>
      <div className='desc'>
        הצוות שלנו בודק את הצעתכם... נחזור בקרוב עם תשובה
      </div>
      <img className='book-image' src={thanks}></img>
      <br></br>
      <Button
          className='btn btn-create'
          variant='contained'
          onClick={() => navigate('/userProfile')}
        >חזרה למסך הבית</Button>
        <br></br>
        <br></br>
        <br></br>
    </div>
    <Navigation></Navigation>
    </div>
  )
}

export default ThanksPage