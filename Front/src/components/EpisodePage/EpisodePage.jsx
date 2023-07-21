import React, { useEffect, useState } from 'react';
import './EpisodePage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { chapterService } from '../../services/chapter.service';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TopOfAplication from '../TopOfAplication';
import Navigation from '../Navigation';




function EpisodePage(props) {
  const [episode, setEpisode] = useState(null);
  const { NameOfChapter } = useParams();
  const navigate = useNavigate();
  

  useEffect(() => { //עמוד הפרק הספציפי
    if (NameOfChapter) {
      loadEpisode();
    }
  }, []);

  const loadEpisode = async () => { //טוען את הפרק הספציפי לפי שם הפרק
    const data = await chapterService.getById(NameOfChapter,props.userEmailFromDB);
    setEpisode(data);
  };
  return episode ? ( //תצוגת הפרק עצמו
    <div className='episode-page  center'>
      <TopOfAplication label={NameOfChapter} UserType={props.userFromDB.UserType}  />
      <br></br>
      <br></br>
<div className="container ">
<Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        src={episode.ChapterPictures}
      />
      <div className='episode-time'>
<div className='episode-date'> {new Date(episode.ChapterDate).toLocaleDateString('en-us')} </div>
</div>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
        <div className='episode-title'>{episode.NameOfChapter}</div>
        </Typography>
        <Typography variant="body2" color="text.secondary">
        <div className='episode-content'>
        <div className='episode-desc'>{episode.ChapterDescription}</div>
      </div>
        </Typography>
      </CardContent>
    </Card>
<br></br>
<br></br>
<br></br>
      </div>
      <Navigation/>
    </div>
  ) : (
    <div className='loading'>loading...</div>
  );
}

export default EpisodePage;
