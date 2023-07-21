import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
import { Button } from '@mui/material';
import { ArrowBackIosNew, Celebration, ManageAccounts, SelfImprovement} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import LogoutIcon from '@mui/icons-material/Logout';
import HikingIcon from '@mui/icons-material/Hiking';

function TopOfAplication(props) {
  const nav = useNavigate()
  const logout = () => {
    localStorage.removeItem('user');
    nav('/')
  }
  const [checkType, setCheckType] = useState('')

  React.useEffect(() => {

    if (props.UserType == 'מוצילר') {
      setCheckType(<HikingIcon />)
    }
    
    if (props.UserType == 'בליין') {
      setCheckType(<Celebration />)
    }
    if (props.UserType == 'ציל') {
      setCheckType(<SelfImprovement />)
    }
    if (props.UserType == 'אדמין') {

      setCheckType(<ManageAccounts/>)
    }

  }, [])



  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: '#598e89', width: '100%', height: '70px' }}  >

        <Container maxWidth="xs" >
          <Toolbar >
            <IconButton style={{ marginRight: 'auto', marginLeft: 'auto' }} onClick={logout} >
              <LogoutIcon/>
            </IconButton>
            <Typography
              sx={{
                mr: 0,
                fontFamily: 'Arial',
                fontSize: 'large',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                position: 'fixed'
              }}
            >
            </Typography>
            <span style={{ marginLeft: '35px', marginRight: '35px' }} >{props.label}</span>
            <IconButton style={{ marginRight: 'auto', marginLeft: 'auto' }} sx={{ p: 0 }}>
             <Avatar variant="rounded" style={{ borderRadius: '40%' }} sx={{ mt: 1 }} >
              {checkType}
             </Avatar>

            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </>);
}
export default TopOfAplication;
