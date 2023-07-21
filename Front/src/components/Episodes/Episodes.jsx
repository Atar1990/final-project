import React, { useEffect, useState } from 'react';
import './Episodes.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { chapterService } from '../../services/chapter.service';
// import  jeep from '../../assets/jeep.jpg'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import TopOfAplication from '../TopOfAplication';
import Navigation from '../Navigation';
import Swal from 'sweetalert2';




function Episodes(props) {
  const navigate = useNavigate();

  const [episodes, setEpisodes] = useState([]);

  useEffect(() => { //טעינה של כל הפרקים
    loadEpisodes();
  }, [props.userEmailFromDB]);

  const remove = async (id) => { //אפשרות למחיקת פרק לפי האי די שלו
    console.log({ id });
    await chapterService.remove(id,props.userEmailFromDB);

    loadEpisodes();
  };
  

  const edit = (id) => { //אפשרות לעריכה פרק לפי האי די שלו
    console.log({ id });
    navigate(`/create-episode/${id}`);
  };

  const loadEpisodes = async () => { //טעינת כל הפרקים הקיימים
    const res = await chapterService.getAll(props.userEmailFromDB);
  console.log('getting  episodes',res);
    setEpisodes(res);
  };

  return ( //תצוגת הפרקים במסך
    <div className='episodes-page center'>
      <TopOfAplication label='הפרקים שלי' UserType={props.userFromDB.UserType}  />
      <br></br>
      <br></br>
      <div className='episodes'>
        {episodes.map((e) => {
          return (
            <div key={e.NameOfChapter} className='episode'>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia className='cardimg2'
                      component="img"
                      alt="green iguana"
                      height="160"
                      src={e.ChapterPictures} />
                      <div className='episode-time'>
                  <div className='episode-date'> {new Date(e.ChapterDate).toLocaleDateString('en-GB')} </div>
                </div>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    <h1 className='Feedback-title2'>{e.NameOfChapter}</h1>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    <h1 className='Feedback-title3'>{e.ChapterDescription.length > 20 ? e.ChapterDescription.substring(0, 20) + '...' : e.ChapterDescription}</h1>
                    </Typography>
                  </CardContent>
                  <CardActions className='btn2'>
                    <Button  onClick={() => edit(e.NameOfChapter,props.userEmailFromDB)} size="small">עריכה</Button>
                    <Button onClick={() => navigate(`/episode/${e.NameOfChapter}`)} size="small"> תצוגה</Button>
                    <Button onClick={() => remove(e.NameOfChapter,props.userEmailFromDB)} size="small"> מחיקה</Button>
                  </CardActions>
                </Card>
    <br></br>
      <br></br>
            </div>
          );
        })}
      </div>
      <Navigation/>
    </div>
  );
}

export default Episodes;
