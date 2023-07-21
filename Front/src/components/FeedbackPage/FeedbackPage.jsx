import React, { useEffect, useState } from 'react'
import './FeedbackPage.css'
import { feedbackService } from '../../services/feedback.service';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import jeep from '../../assets/jeep.jpg';
import TopOfAplication from '../TopOfAplication';
import Navigation from '../Navigation';
import NavigationAdmin from '../NavigationAdmin';
import AddLocationAltTwoToneIcon from '@mui/icons-material/AddLocationAltTwoTone';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PublicTwoToneIcon from '@mui/icons-material/PublicTwoTone';
import LocationCityTwoToneIcon from '@mui/icons-material/LocationCityTwoTone';
import FormatListNumberedTwoToneIcon from '@mui/icons-material/FormatListNumberedTwoTone';
import MapTwoToneIcon from '@mui/icons-material/MapTwoTone';



function FeedbackPage(props) {
  const [feedback, setFeedback] = useState(null);
  const { FeedbackKey } = useParams();
  const navigate = useNavigate();

  useEffect(() => { //טעינה של הפיידבק הספציפי לפי הקיי
    if (FeedbackKey) {
      loadFeedback();
    }
  }, []);

  const loadFeedback = async () => {  //טעינה של הפיידבק הספציפי לפי הקיי
    const data = await feedbackService.getById(FeedbackKey);
    setFeedback(data);
  };

  const remove = async (id) => { //מחיקה של הפיידבק הספציפי לפי הקיי
    console.log({ id });
    await feedbackService.remove(feedback.FeedbackKey);
    navigate('/feedbacks')
  };
  const PutUpdateFeed = async () => { //מחיקה של הפיידבק הספציפי לפי הקיי
    navigate(`/EditFeedbackAdmin/${feedback.FeedbackKey}`)
  };
  //PutUpdateFeed
  const submit = async () => { //הוספה של הפיידבק הספציפי לפי הקיי
    console.log();
    const res = await feedbackService.create(feedback,props.feedback)
    await feedbackService.remove(feedback.FeedbackKey)
    navigate('/feedbacks')
  }
  return feedback ? ( //תצוגה של הפידבק הספציפי על המסך
    <div className='feedbackpage'>
      <TopOfAplication label="הוספת המלצה" UserType={props.userFromDB.UserType} />
      <br></br>
      <br></br>
      <br></br>
      <Card className='cardstyle' sx={{ maxWidth: 345,direction:'rtl' }}>
        <CardContent>
          <CardMedia className='cardimg'
            component="img"
            alt="green iguana"
            height="140"
            src={feedback.FeedbackPhoto} />
          <div className='rigt'>
            <h1 className='title2'><AddLocationAltTwoToneIcon />   {feedback.FeedbackTitle}<AddLocationAltTwoToneIcon /></h1>

            <Divider variant="inset" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar style={{marginTop: '-15px', marginBottom: '-15px'}}>
                <Typography gutterBottom variant="h5" component="div">
                  <h1 className='Feedback-title3'><PublicTwoToneIcon /> <b>שם המדינה-</b> {feedback.FeedbackCountry}  </h1>
                </Typography>
              </ListItemAvatar>
            </ListItem>
            <Divider className='diva' variant="inset" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar style={{marginTop: '-15px', marginBottom: '-15px'}}>
                <Typography gutterBottom variant="h5" component="div">
                  <h1 className='Feedback-title3'>  <LocationCityTwoToneIcon /> <b> איזור במדינה-</b> {feedback.FeedbackRegionOfTheCountry} </h1>
                </Typography>
              </ListItemAvatar>
            </ListItem>
            <Divider variant="inset" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar style={{marginTop: '-15px', marginBottom: '-15px'}}>
                <Typography gutterBottom variant="h5" component="div">
                  <h1 className='Feedback-title3'> <FormatListNumberedTwoToneIcon />  <b>תיאור מהמשתמש</b> <br /> {feedback.FeedbackDescription} </h1>
                </Typography>
              </ListItemAvatar>
            </ListItem>
            <Divider variant="inset" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar style={{marginTop: '-15px', marginBottom: '-15px'}}>
                <Typography gutterBottom variant="h5" component="div">
                  <h3 className='Feedback-title3'><MapTwoToneIcon /> <b>נקודת ציון של ההמלצה</b> <br /> <br />
                   <b>קו אורך:</b> {feedback.FeedbackLongitude} <br /> <br /> <b>קו רוחב:</b> {feedback.FeedbackLatitude} </h3>
                  {/* <h3 className='Feedback-title3'>קו אורך : {feedback.FeedbackLongitude}</h3>
                  <h3 className='Feedback-title3'>קו רוחב : {feedback.FeedbackLatitude}</h3> */}
                  <h3 className='Feedback-title4'>* זכור לשנות בהתאם למיקום הנכון</h3>
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                  
                  <h3 className='Feedback-title4'>מתאים למשתמש מסוג : {feedback.FeedbackPersona} </h3>
                </Typography>
              </ListItemAvatar>
            </ListItem>
          </div>
        </CardContent>
        <CardActions>
          <Button onClick={submit} size="small">הוספת הצעה </Button>
          <Button onClick={() => remove(feedback.FeedbackKey)} size="small">מחיקת הצעה </Button>
          <Button onClick={() => PutUpdateFeed(feedback.FeedbackKey)} size="small">עריכת הצעה </Button>
        </CardActions>
      </Card>
      <br></br>
      <br></br>
      {/* <Navigation></Navigation> */}
      <NavigationAdmin pagNav={'toAdd'} />
    </div>
  ) : <div className="loading">
    loading...
  </div>
}

export default FeedbackPage