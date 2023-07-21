import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AccountCircle, AddLocationAlt, ConnectWithoutContact, CurrencyExchange, Home, TravelExplore } from '@mui/icons-material';
import Budget from './Budget';
import { Route, Routes, useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function NavigationAdmin(props) {
  
const nav=useNavigate();
const [value, setValue] = useState(props.pagNav);
const handleChange = (event, newValue) => {
  setValue(newValue);
};
  return (
 
    <Box sx={{ pb: 1 , width: 150 }} style={{alignItems:'center'}}>
    <Paper sx={{zIndex:10, backgroundColor:'white', position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
    <BottomNavigation value={value} onChange={handleChange}>
          <BottomNavigationAction
            label="פרופיל"
            value="profile"
            icon={<AccountCircle />}
            onClick={() => {nav('/UserProfileAdmin')}}
          />
          <BottomNavigationAction
            label="המלצה"
            value="recommendation"
            icon={<AddLocationAlt />}
             onClick={() => {nav('/CreateFeedbackAdmin')}}
          />
          
          <BottomNavigationAction
            label="מפה"
            value="mapAdmin"
            icon={<TravelExplore />}
            onClick={() => {nav('/mapAdmin')}}

          />

          <BottomNavigationAction label="בהמתנה" value="toAdd" icon={<ConnectWithoutContact/>} onClick={() => {nav('/Feedbacks')}} />
        </BottomNavigation>
    
        </Paper>
        
        </Box>

  );
}

