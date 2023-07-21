
import styled from '@emotion/styled';
import { Avatar, Badge, BottomNavigation, BottomNavigationAction, Button, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import { Box, margin, padding, Stack } from '@mui/system';
import AutoStories from '@mui/icons-material/AutoStories';
import HikingIcon from '@mui/icons-material/Hiking';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Navigation from './Navigation';
import Paper from '@mui/material/Paper';
import TopOfAplication from './TopOfAplication';
import { AddLocationAlt, Celebration, ConnectWithoutContact, ManageAccounts, Password, SelfImprovement } from '@mui/icons-material';
import { resolvePath, useNavigate } from 'react-router-dom';
import { getEnv } from '../utils/env';
import { storageService } from '../services/storage.service';
import { file } from '@babel/types';
import { userService } from '../services/user.service';
import { async } from '@firebase/util';
import NavigationAdmin from './NavigationAdmin';

export default function UserProfileAdmin(props) {

  const nav = useNavigate();

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      // boxShadow:'0 0 0 20px',
      boxShadow: '0 0 0 2px ${theme.palette.background.paper}',
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));

  const [checkType, setCheckType] = useState('')

  const [userInApp, setUserInApp] = useState('');// בתאכלס, משתמש ישלח כבר מעטר, עד החיבור מביא אותו בגט לפי מיקום
  const [form, setForm] = useState();
  const handleChange = async (ev) => { //לוקח את הפרמטרים ש/מזינים בפורם

    let { name, value } = ev.target;
    if (name==='UserImg') {
      console.log(name);
      const file = ev.target.files[0]
      console.log({ file });
      if (file) {
        const url = await storageService.upload(file)//////////// בדיקה
        console.log(url)
        const data=await userService.updateIMG(url,props.userFromDB.UserEmail)
        console.log(data)
        setForm({ ...form, [name]: url });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
    

    
  };

  useEffect(() => {
    console.log(props.userFromDB,"uesrprofileadmin");
    const email = props.userFromDB.UserEmail;
    const apiUrl = getEnv() + '/users/getemail/?email='

    fetch(apiUrl + email,
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
          console.log("fetch get user by id=", result);
          console.log("result=", result.UserFirstName);
          setUserInApp(result); // השמה של המשתמש שהגיע מהדאטה בייס להמשך עבודה בצד שרת
          console.log('first name=', userInApp.UserFirstName)
          console.log('first name=', userInApp.UserLastName)

        },
        (error) => {
          console.log("err post=", error);
        });

  }, [])// משתמש שנכנס לראשונה לתהליך האפיון נכנס עם טייפ רייק- לאחר העדכון של האפיון נראצ הלהביא מחדש את המשתמש לאחר השינויים


  useEffect(() => {

    if (userInApp.UserType == 'מוצילר') {
      setCheckType(<HikingIcon onClick={() => { nav('/Questionnaire') }}  />)
    }
    if (userInApp.UserType == 'בליין') {

      setCheckType(<Celebration onClick={() => { nav('/Questionnaire') }}  />)
    }
    if (userInApp.UserType == 'ציל') {

      setCheckType(<SelfImprovement onClick={() => { nav('/Questionnaire') }}  />)
    }
    if (userInApp.UserType == 'אדמין') {

      setCheckType(<ManageAccounts/>)
    }

  }, [userInApp.UserType])/// מתעדכן לאחר כל שינוי של הטייפ של המתשמש בדאטה בייס

  return (
    <>
      <TopOfAplication label='הפרופיל שלי' UserType={props.userFromDB.UserType} />

      <img className="App-logo" src="logo.png" style={{ marginTop: '5px', width: '120px' }} />
      <Box style={{ marginBottom: '0px', backgroundColor: '#eeeeee', margin: '1px',paddingBottom:'0px',paddingBottom:10,paddingTop:0, paddingLeft:20, paddingRight:20, borderRadius: '5%' }}>
      <input  style={{marginRight:'235px', color:'#eeeeee', backgroundColor:'#eeeeee', fontSize:'0px'}} className='imginput' type='file' name='UserImg' onChange={handleChange} />

        <Stack direction={"row"} spacing={5} justifyContent={'space-around'} >
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            variant="dot"
          >
            <Avatar sx={{ width: 64, height: 64 }} src= {props.userFromDB.UserImg} style={{ display: 'flex' }} onClick={() => {alert('bdike')}} />
    
          </StyledBadge>

          <p style={{ color: 'black' }}> {props.userFromDB.UserFirstName} שלום <br /> {props.userFromDB.UserEmail} </p>
        </Stack>
      </Box>

      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar style={{
            marginTop: '20px', marginBottom: '15px'
          }}>
            <Avatar>
              <ConnectWithoutContact onClick={() => { nav('/Feedbacks') }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            style={{ textAlign: 'right' }}
            primary=" "
            secondary={
              <React.Fragment >
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  <b style={{ textAlign: 'center' }} > {'הצעות משתמשים'}</b>
                  <br />
                </Typography>
                {" לחץ על האייקון לצפייה בכל הצעות המשתמשים המחכים לאישורך"}

              </React.Fragment>
            }
          />
        </ListItem>

        <Divider variant="inset" component="li" />


        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar style={{
            marginTop: '20px', marginBottom: '15px'
          }}>
            <Avatar>
              <AddLocationAlt onClick={() => { nav('/CreateFeedbackAdmin') }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            style={{ textAlign: 'right' }}
            primary=" "
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  <b> {'הוספת המלצה'}</b>
                  <br />
                </Typography>
                {"לחץ על האייקון להוסיף המלצה שמשתמשי המערכת יוכלו להנות ממנה"}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
{/* שינוי סיסמא */}
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar style={{
            marginTop: '20px', marginBottom: '15px'
          }}>
            <Avatar>
              <Password onClick={() => { nav('/ChangePasswordComAdmin') }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            style={{ textAlign: 'right' }}
            primary=" "
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  <b> {'שינוי פרטים'}</b>
                  <br />
                </Typography>
                {"לחץ על ה-אייקון למעבר לשינוי הפרטים האישיים"}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </List>

      <NavigationAdmin pagNav={'profile'} />
    </>
  )

}
