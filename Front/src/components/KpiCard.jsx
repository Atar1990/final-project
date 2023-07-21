
import styled from '@emotion/styled';
import { ArrowDropDown, ArrowDropUp, Celebration, CompareArrows, Edit, Expand, Fastfood, FollowTheSigns, Hotel, LocalFlorist, PriorityHigh, Snowboarding, Whatshot } from '@mui/icons-material'
import { Alert, Avatar, Box, Button, Card, CardActions, CardContent, Chip, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

export default function KpiCard(props) {

  const [down,setDown]=useState(<ArrowDropDown style={{color:'green'}} />)
  const [up,setUp]=useState(<ArrowDropUp style={{color:'red'}} />)

  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
        <h4 style={{color:'black', background:'#eeeeee'}}>מצבך ביחס למשתמשים דומים </h4>
        <Alert severity="error" sx={{direction:'rtl'}} icon={false} >חץ למעלה מעיד על הוצאה גבוהה בקטגוריה !</Alert>

      <Grid container spacing={{ xs: 2}} columns={{ xs: 4 }}>
      <Grid item xs={2}>
    <Card sx={{ minWidth: 15, maxHeight:185  }} style={{marginTop:'10px'}} >
      <CardContent >
        <Avatar><Snowboarding/></Avatar>
        <Typography variant="h6" component="div" gutterBottom  >
        <h5 style={{ color:'black',backgroundColor:'rgba(75,192,192,1)', padding:'1px', margin:'10px',borderRadius: '5%'}}> {'אטרקציות'}</h5>
        </Typography>
        

        <Typography variant="body2">
          <h5>שרפת <b>{props.SumOfExpenseAtraction}</b> ש"ח   </h5>
          <Chip icon={props.SumOfExpenseAtraction<props.AvgOfExpenseAtraction? down:up} label={`${parseInt(Math.abs((props.SumOfExpenseAtraction-props.AvgOfExpenseAtraction)/props.AvgOfExpenseAtraction*100))}% `} variant="outlined" />
        </Typography>
        
      </CardContent>

    </Card>
    </Grid>
    <Grid item xs={2}>
    <Card sx={{ minWidth: 15, maxHeight:185  }} style={{marginTop:'10px'}} >
      <CardContent >
        <Avatar ><Fastfood/></Avatar>
        <Typography variant="h6" component="div" gutterBottom  >
        <h5 style={{ color:'black',backgroundColor:'#50AF95', padding:'1px', margin:'10px',borderRadius: '5%'}}> {"מזון"}</h5>
        </Typography>

        <Typography variant="body2">
          <h5> שרפת <b>{props.SumOfExpenseFood}</b> ש"ח   </h5>
          <Chip icon={props.SumOfExpenseFood<props.AvgOfExpenseFood? down:up} label={` ${parseInt(Math.abs((props.SumOfExpenseFood-props.AvgOfExpenseFood)/props.AvgOfExpenseFood*100))}%`} variant="outlined" />

        </Typography>
        
      </CardContent>

    </Card>
    </Grid>
    
    </Grid>


    <Grid container spacing={{ xs: 2}} columns={{ xs: 4 }}>
      <Grid item xs={2}>
    <Card sx={{ minWidth: 15, maxHeight:185  }} style={{marginTop:'10px'}} >
      <CardContent >
        <Avatar><Hotel/></Avatar>
        <Typography variant="h6" component="div" gutterBottom  >
        <h5 style={{ color:'black',backgroundColor:'#ce93d8', padding:'1px', margin:'10px',borderRadius: '5%'}}> {"לינה"}</h5>
        </Typography>

        <Typography variant="body2">
          <h5> שרפת <b>{props.SumOfExpenseSleep}</b> ש"ח   </h5>
          <Chip icon={props.SumOfExpenseSleep<props.AvgOfExpenseSleep? down:up} label={`${parseInt(Math.abs((props.SumOfExpenseSleep-props.AvgOfExpenseSleep)/props.AvgOfExpenseSleep*100))}%`} variant="outlined" />

        </Typography>
        
      </CardContent>

    </Card>
    </Grid>
    <Grid item xs={2}>
    <Card sx={{ minWidth: 15, maxHeight:185  }} style={{marginTop:'10px'}} >
      <CardContent >
        <Avatar><Celebration/></Avatar>
        <Typography variant="h6" component="div" gutterBottom  >
        <h5 style={{ color:'black',backgroundColor:'#f3ba2f', padding:'1px', margin:'10px',borderRadius: '5%'}}> {"בילויים"}</h5>
        </Typography>

        <Typography variant="body2">
          <h5> שרפת <b>{props.SumOfExpenseParty}</b> ש"ח   </h5>
          <Chip icon={props.SumOfExpenseParty<props.AvgOfExpenseParty? down:up} label={`${parseInt(Math.abs((props.SumOfExpenseParty-props.AvgOfExpenseParty)/props.AvgOfExpenseParty*100))}%`} variant="outlined" />

        </Typography>
        
      </CardContent>

    </Card>
    </Grid>
    
    </Grid>

    <Grid container spacing={{ xs: 2}} columns={{ xs: 4 }}>
      <Grid item xs={2}>
    <Card sx={{ minWidth: 15, maxHeight:185  }} style={{marginTop:'10px'}} >
      <CardContent >
        <Avatar><Whatshot/></Avatar>
        <Typography variant="h6" component="div" gutterBottom  >
        <h5 style={{ color:'black',backgroundColor:'#e57373', padding:'1px', margin:'10px',borderRadius: '5%'}}> {"הימורים"}</h5>
        </Typography>

        <Typography variant="body2">
          <h5> שרפת <b>{props.SumOfExpenseCasino}</b> ש"ח   </h5>
          <Chip icon={props.SumOfExpenseCasino<props.AvgOfExpenseCasino? down:up} label={`${parseInt(Math.abs((props.SumOfExpenseCasino-props.AvgOfExpenseCasino)/props.AvgOfExpenseCasino*100))}%`} variant="outlined" />
        </Typography>
        
      </CardContent>

    </Card>
    </Grid>
    <Grid item xs={2}>
    <Card sx={{ minWidth: 15, maxHeight:185 }} style={{marginTop:'10px'}} >
      <CardContent >
        <Avatar><LocalFlorist/></Avatar>
        <Typography variant="h6" component="div" gutterBottom  >
        <h5 style={{ color:'black',backgroundColor:'#2a71d0', padding:'1px', margin:'10px',borderRadius: '5%'}}> {"התארגנויות"}</h5>
        </Typography>
        

        <Typography variant="body2">
          <h5> שרפת <b>{props.SumOfExpenseDrugs}</b> ש"ח   </h5>
          <Chip icon={props.SumOfExpenseDrugs<props.AvgOfExpenseDrugs? down:up} label={`${parseInt(Math.abs((props.SumOfExpenseDrugs-props.AvgOfExpenseDrugs)/props.AvgOfExpenseDrugs*100))}%`} variant="outlined" />
        </Typography>
        
      </CardContent>

    </Card>
    </Grid>
    
    </Grid>

    <h3 style={{color:'black', background:'#eeeeee'}}>גרפים ופירוט הוצאות </h3>

    </Box>
    </>
  )
}
