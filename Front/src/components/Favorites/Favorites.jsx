import React, { useEffect, useState } from 'react';
import './Favorites.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { chapterService } from '../../services/chapter.service';
import jeep from '../../assets/jeep.jpg'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import TopOfAplication from '../TopOfAplication';
import Navigation from '../Navigation';
import { favoriteservice } from '../../services/Favorites.service';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ExpandMore } from '@mui/icons-material';


function Favorites(props) {
  const navigate = useNavigate();
  const [expandedIdx, setExpandedIdx] = useState(null);

  const [favoritess, setFavorites] = useState([]);

  useEffect(() => { //טעינה של כל הפרקים
    loadFavorites();
  }, []);

  const loadFavorites = async () => { //טעינת כל הפרקים הקיימים
    const res = await favoriteservice.Getall(props.userEmailFromDB);
    console.log(res);
    setFavorites(res);
  };

  const removeFavorite = async (FKey) => {
    const res = await favoriteservice.DeleteFavourites(FKey)
    loadFavorites()
  }

  return ( //תצוגת הפרקים במסך
    <div className='episodes-page center'>
    <TopOfAplication label='המועדפים שלי'  UserType={props.userFromDB.UserType}/>      {/* <div className='title'>יומן המסע שלי</div> */}
     <div className='Favoritesss'>
        {favoritess.map((item, idx) => {
          return (
            <div className='episode2'>
              <Card sx={{ maxWidth: 345 }}>
                <CardHeader
                  title={item.FnameDTO}
                />
                
                  <Typography variant="body2" color="text.secondary">
                    <h3>נמצא ב{item.FcountryDTO}</h3>
                  </Typography>
               
                <CardMedia
                  component="img"
                  height="194"
                  image={item.FphotoDTO}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">

                  </Typography>
                </CardContent>
                <CardActions className='btn2' disableSpacing>
                  <IconButton onClick={() => removeFavorite(item.FkeyDTO)} aria-label="add to favorites">
                    <FavoriteIcon style={{ color: 'red' }} />
                  </IconButton>
                  {"צפייה בפרטים מלאים"}
                  <ExpandMore
                    expand={expandedIdx === idx}
                    onClick={() => {
                      if (expandedIdx === idx) {
                        setExpandedIdx(null)
                      } else {
                        setExpandedIdx(idx)
                      }
                    }}
                    aria-expanded={expandedIdx === idx}
                    aria-label="show more"
                  >

                   <ExpandMoreIcon/>
                  </ExpandMore>
                </CardActions>
                <Collapse className='btn2' in={expandedIdx === idx} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography  paragraph>{item.FdescriptionDTO}</Typography>
                  </CardContent>
                </Collapse>
              </Card>
              <br></br>
              <br></br>
            </div>
          );
        })}
      </div>
      <Navigation />
    </div>
  );
}

export default Favorites;
