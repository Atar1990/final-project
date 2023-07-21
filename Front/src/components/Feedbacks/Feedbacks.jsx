import React, { useEffect, useState } from 'react';
import './Feedbacks.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { feedbackService } from '../../services/feedback.service';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import  jeep from '../../assets/jeep.jpg';
import TopOfAplication from '../TopOfAplication';
import Navigation from '../Navigation';
import NavigationAdmin from '../NavigationAdmin';



function Feedbacks(props) {
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => { //תצוגה של כל הפיידבקים
    loadFeedbacks();
  }, []);

  const getById = (FeedbackKey) => { //תצוגה של כל הפיידבק לפי לחיצה על הכתפור והצגתו במסך הבא לפי הקיי
    console.log({ FeedbackKey });
    navigate(`/FeedbackPage/${FeedbackKey}`);
  };

  const loadFeedbacks = async () => { //תצוגה של כל הפיידבקים
    const res = await feedbackService.getAll();
    setFeedbacks(res);
  };

  return ( //תצוגה של הפיידבקים על המסך לפי הסדר
    <div className='feedbacks-page center'>
      <TopOfAplication label='הצעות שמחכות לאישור' UserType={props.userFromDB.UserType} />
      {/* <div className='title'>יומן המסע שלי</div> */}
      <br></br>
      <br></br>
      <br></br>

      <div className='feedbacks'>
        {feedbacks.map((f) => ( //תצוגה של הפיידבקים על המסך לפי map
          <div className='feedback'>
            <div className='feedback-content'>
            <Card className='cardstyle2' sx={{ maxWidth: 345 }}>
                  <CardMedia className='cardimg2'
                    component="img"
                    alt="green iguana"
                    height="160"
                    src={f.FeedbackPhoto} />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    <h1 className='Feedback-title2'>{f.FeedbackTitle}</h1>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    <h1 className='Feedback-title3'>{f.FeedbackDescription.length > 20 ?'...'+  f.FeedbackDescription.substring(0, 20) : f.FeedbackDescription}</h1>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button onClick={() => getById(f.FeedbackKey)} size="small">הצגת הצעה </Button>
                  </CardActions>
                </Card>
                <br></br>
            </div>
          </div>
        ))}
      </div>
      <br></br>
      <br></br>
      <NavigationAdmin pagNav={'toAdd'}/>
    </div>
  );
}

export default Feedbacks;
