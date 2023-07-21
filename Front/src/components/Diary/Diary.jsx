import React from 'react';
import './Diary.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import TopOfAplication from '../TopOfAplication';
import Navigation from '../Navigation';
import book from '../../assets/book.png';

function Diary() {
  const navigate = useNavigate();

  return ( //עמוד הפתיחה של היומן מסע
    <div className='diary center'>
      <br></br>
      <br></br>
      <TopOfAplication label='יומן המסע שלי'  />
      <br></br>
      <div className='desc'>
        יומן מסע הינו כלי המאפשר לכם לתעד פרקים בטיול שלכם.... בכל פרק תתארו את
        החוויה שעברתם ביעד ואף תוכלו לצרף תמונות. בלחיצה על "שמור פרק" הפרק ישמר
        בזיכרון האפליקציה ותוכלו לשתף אותו עם משתמשים אחרים. בסיום הטיול אוסף
        הפרקים ששמרתם יקווצו ליומן המסע ובו כל הרגעים היפים מהטיול הגדול
      </div>
      <img className='book-image2' src={book}></img>
      <div className='btns'>
        <Button
          className='btn btn-create'
          variant='contained'
          onClick={() => navigate('/create-episode')}
        >
          צור פרק
        </Button>
        <Button
          className='btn btn-show'
          variant='contained'
          onClick={() => navigate('/episodes')}
        >
          הצג את הפרקים שלי
        </Button>
      </div>
      <br></br>
      <br></br>
      <Navigation></Navigation>
    </div>
  );
}

export default Diary;
