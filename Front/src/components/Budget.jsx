
import { Box, Slider, Stack, Table } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Navigation from './Navigation'
import TopOfAplication from './TopOfAplication'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styled from '@emotion/styled';
import DataTable from './DataTable';
import { useNavigate } from 'react-router-dom';
import { getEnv } from '../utils/env';

export default function Budget(props) {
  const nav=useNavigate();

  const PrettoSlider = styled(Slider)({
    color: '#52af77',
    height: 8,
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&:before': {
        display: 'none',
      },
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 12,
      background: 'unset',
      padding: 0,
      width: 38,
      height: 38,
      borderRadius: '50% 50% 50% 0',
      backgroundColor: '#52af77',
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&:before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
      },
      '& > *': {
        transform: 'rotate(45deg)',
      },
    },
  });
  
  const [value, setValue] = useState();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const [expensesInApp, setExpensesInApp] = useState([]);/// הבאה בצורה אסינכורית את כל ההוצאות של המשתמש

  const [userInApp, setUserInApp] = useState('');// בתאכלס, משתמש ישלח כבר מעטר, עד החיבור מביא אותו בגט לפי מיקום

        useEffect(()=>{
        const apiUrl= getEnv() + '/users/getemail/?email='    
        fetch(apiUrl+props.userFromDB.UserEmail, 
          {
          method: 'GET',
          headers: new Headers({
            'Content-Type':'application/json; charset=UTF-8',
            'Accept':'application/json; charset=UTF-8',
            })
            
          })
        .then(response => {
         console.log('response= ',response);
         console.log('response statuse=', response.status);
         console.log('response.ok=', response.ok)
        
        return response.json()
        })
        .then(
          (result)=>{
            console.log("fetch get user by id=", result);
            console.log("result=", result.UserFirstName);
            setUserInApp(result); // השמה של המשתמש שהגיע מהדאטה בייס להמשך עבודה בצד שרת
            setValue(result.UserBudget)
            console.log('first name=', result.UserFirstName)
            console.log('first name=', result.UserLastName)
            console.log('budget=', result.UserBudget)

          },
        (error) => {
        console.log("err post=", error);
        });     
    
     },[])
 
useEffect(()=>{
  const apiUrl= getEnv() + '/expenses/?email='
  fetch(apiUrl+props.userFromDB.UserEmail, 
     {
     method: 'GET',
    headers: new Headers({
        'Content-Type':'application/json; charset=UTF-8',
        'Accept':'application/json; charset=UTF-8',
        }),
    
       })
        .then(response => {
         console.log('response= ',response);
         console.log('response statuse=', response.status);
         console.log('response.ok=', response.ok)
        
        return response.json()
        })
        .then(
          (result)=>{
            console.log("fetch get user by id=", result);
            setExpensesInApp(result); // השמה של המשתמש שהגיע מהדאטה בייס להמשך עבודה בצד שרת
            console.log('UserEmail', result[0].UserEmail)
            console.log('ExpensesTitle=', result[0].ExpensesTitle)
            console.log(result.length);        
          },
        (error) => {
        console.log("err post=", error);
        });     
    
     },[])
    

 const budgetChange=()=>{
  const apiUrl= getEnv() + '/users/putemail/budget/?email='
  fetch(apiUrl+props.userEmailFromDB, 
    {
    method: 'PUT',
    body:JSON.stringify(value),
    headers: new Headers({
      'Content-Type':'application/json; charset=UTF-8',
      'Accept':'application/json; charset=UTF-8',
      })
      
    })
  .then(response => {
   console.log('response= ',response);
   console.log('response statuse=', response.status);
   console.log('response.ok=', response.ok)
  },
  (error) => {
  console.log("err post=", error);
  });     

  nav('/Analysis',{state:value})
 }

  return (
    <>
      <TopOfAplication label='מעקב הוצאות' UserType={props.userFromDB.UserType} />
      
      <Card sx={{ minWidth: 275  }} style={{marginTop:'60px'}} >
      <CardContent >
        <Typography variant="h6" component="div" gutterBottom  >
        <h4 style={{ color:'black',backgroundColor:'#eeeeee', padding:'5px', margin:'15px',borderRadius: '5%'}}> {"תקציב אישי"}</h4>
        </Typography>
        <Box sx={{ width: 270 }}>
            <Box sx={{ m: 1 }} />
            <Typography gutterBottom>הגדר את תקציב הטיול שלך</Typography>
            <PrettoSlider 
              step={500}
              marks
              min={5000}
              max={70000}
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            defaultValue={value}
            value={value}
            onChange={handleChange}
          />
          <Box sx={{ m: 3 }} />
        </Box>
        <Typography variant="body2">
          <h3>יש לי <b>{value}</b> שקל לבזבז בטיול</h3>
          <br />
          {"אנחנו כאן כדי לעזור לך לנהל את התקציב שלך בצורה הטובה ביותר"}
        </Typography>
      </CardContent>
      <CardActions >
      <Button style={{marginLeft:'auto', marginRight:'auto',backgroundColor:'#598e89'}} size="small" onClick={budgetChange} variant="contained">בוא נצלול פנימה</Button>
      </CardActions>
    </Card>
    {expensesInApp[0] !==undefined?<DataTable allExpenes={expensesInApp}/>:''}
      <Navigation pagNav={'budget'}/>
    </>
  )
}
