
import { Avatar, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navigation from './Navigation'
import ProgressBar from './ProgressBar'
import TopOfAplication from './TopOfAplication'
import { ArrowDropDown, ArrowDropUp, LocalFireDepartment, Percent, PointOfSale, QueryStats, Savings } from '@mui/icons-material'
import GraphsBar from './GraphsBar';
import { getEnv } from '../utils/env'
import KpiChart from './KpiChart'
import GeographyChart from './GeographyChart'
import KpiCard from './KpiCard'

export default function ExpensesAnalysis(props) {
  const nav=useNavigate();
  const {state}=useLocation();
  useEffect(()=>{
    if (state!=undefined) {
      const obj=state;
      setUserBudget(obj)
    }
  },[])

  const [sumExpense, setSumExpense] = useState(1);/// הוצאות המשתמש
  const [userBudget, setUserBudget] = useState(1);//תקציב המשתמש כפי שהוגדר
  const [boolean, setBoolean] = useState(false);// בשביל ההצגה של הניתוחים
//// שייך להחזקת הנתונים שמועברים לגרפים של הניתוח
const [SumOfExpenseAtraction, setSumOfExpenseAtraction] = useState(0)
const [SumOfExpenseSleep, setSumOfExpenseSleep] = useState(0)
const [SumOfExpenseDrugs, setSumOfExpenseDrugs] = useState(0)
const [SumOfExpenseFood, setSumOfExpenseFood] = useState(0)
const [SumOfExpenseCasino, setSumOfExpenseCasino] = useState(0)
const [SumOfExpenseParty, setSumOfExpenseParty] = useState(0)
  const booleanop=(boolean)=>{
    if (boolean) {
      setBoolean(false)
    }
    else{
      setBoolean(true)
    }
  }/// שליטה על הצגה וסגיה של ניתוחים


////שייך להחזקת הממוצעים להשוואת צרכנות
const [AvgOfExpenseAtraction, setAvgOfExpenseAtraction] = useState(0)
const [AvgOfExpenseSleep, setAvgOfExpenseSleep] = useState(0)
const [AvgOfExpenseDrugs, setAvgOfExpenseDrugs] = useState(0)
const [AvgOfExpenseFood, setAvgOfExpenseFood] = useState(0)
const [AvgOfExpenseCasino, setAvgOfExpenseCasino] = useState(0)
const [AvgOfExpenseParty, setAvgfExpenseParty] = useState(0)
const [AvgOfExpense, setAvgOfExpense] = useState(1);/// הוצאות המשתמש


useEffect(()=>{
// const apiUrl= getEnv() + '/expenses/getsumofall/?email=Benda669@gmail.com'
const apiUrl= getEnv() + '/expenses/getsumofall/?email='
fetch(apiUrl +props.userFromDB.UserEmail, 
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
 console.log("fetch get  sumOfExpense =", result);
setSumOfExpenseAtraction(result.SumOfExpenseAtraction); // השמה של המשתמש שהגיע מהדאטה בייס להמשך עבודה בצד שרת
setSumOfExpenseSleep(result.SumOfExpenseSleep)
setSumOfExpenseDrugs(result.SumOfExpenseDrugs)
setSumOfExpenseFood(result.SumOfExpenseFood)
setSumOfExpenseCasino(result.SumOfExpenseCasino)
setSumOfExpenseParty(result.SumOfExpenseParty)
setSumExpense(result.SumOfExpense)
 },
 (error) => {
 console.log("err post=", error);
 });     

///// הוספה של ממוצעי צריכה
const apiUrlA= getEnv() + '/expenses/statusOfExpenses/?email='
fetch(apiUrlA +props.userFromDB.UserEmail, 
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
 console.log("fetch get  sumOfExpense =", result);
setAvgOfExpenseAtraction(result.SumOfExpenseAtraction); // השמה של המשתמש שהגיע מהדאטה בייס להמשך עבודה בצד שרת
setAvgOfExpenseSleep(result.SumOfExpenseSleep)
setAvgOfExpenseDrugs(result.SumOfExpenseDrugs)
setAvgOfExpenseFood(result.SumOfExpenseFood)
setAvgOfExpenseCasino(result.SumOfExpenseCasino)
setAvgfExpenseParty(result.SumOfExpenseParty)
setAvgOfExpense(result.SumOfExpense)
 },
 (error) => {
 console.log("err post=", error);
 });     
                
 },[]) //לדאטה בגרף 
 const Data = [
  {
    id: 1,
    KindOfExpenses: 'אטרקציות',
    sumOfExpense: SumOfExpenseAtraction,
  },
  {
    id: 2,
    KindOfExpenses: 'לינה',
    sumOfExpense: SumOfExpenseSleep,
  },
  {
    id: 3,
    KindOfExpenses: 'מזון',
    sumOfExpense: SumOfExpenseFood,
  },
  {
    id: 4,
    KindOfExpenses: 'בילויים',
    sumOfExpense: SumOfExpenseParty,
  },
  {
    id: 5,
    KindOfExpenses: 'התארגנות',
    sumOfExpense: SumOfExpenseDrugs,
  },
  {
    id: 6,
    KindOfExpenses: 'הימורים',
    sumOfExpense: SumOfExpenseCasino,
  }
];
const DataPrecent = [
  {
    id: 1,
    KindOfExpenses: 'אטרקציות',
    sumOfExpense: parseInt(SumOfExpenseAtraction/sumExpense*100),
  },
  {
    id: 2,
    KindOfExpenses: 'לינה',
    sumOfExpense: parseInt(SumOfExpenseSleep/sumExpense*100),
  },
  {
    id: 3,
    KindOfExpenses: 'מזון',
    sumOfExpense: parseInt(SumOfExpenseFood/sumExpense*100),
  },
  {
    id: 4,
    KindOfExpenses: 'בילויים',
    sumOfExpense: parseInt(SumOfExpenseParty/sumExpense*100),
  },
  {
    id: 5,
    KindOfExpenses: 'התארגנות',
    sumOfExpense: parseInt(SumOfExpenseDrugs/sumExpense*100),
  },
  {
    id: 6,
    KindOfExpenses: 'הימורים',
    sumOfExpense: parseInt(SumOfExpenseCasino/sumExpense*100),
  }
];
    return (
    <div>
      <TopOfAplication label='ניתוח הוצאות' UserType={props.userFromDB.UserType}/>
      <Card sx={{ minWidth: 275  }} style={{marginTop:'60px'}} >
      <img className="App-logo" src="analysis3.png" style={{marginTop:'15px'}} />
      <CardContent >
      <Chip icon={<Savings/>} style={{color:'ActiveCaption',marginBottom:'30px', height:'60px', width:'255px' }}  label={` ₪ ${userBudget} תקציב הטיול`}   variant="outlined" />

        <Typography variant="body2" >
          <br />
          {''}
          <ProgressBar sumOfexpenses={sumExpense} completed={parseInt((sumExpense/userBudget)*100)}/>
        </Typography>
        <Stack direction="row" spacing={2} style={{marginTop:'35px'}}>
          <Chip icon={<LocalFireDepartment style={{color:'red'}} />} label={` ₪ ${sumExpense} נשרפו`} color="error" variant="outlined" />
          <Chip icon={<PointOfSale/>} label={` ₪ ${userBudget-sumExpense} זמינים`} color="success" variant="outlined" />
          </Stack>
      </CardContent>
      <CardActions >
        <Avatar style={{marginLeft:'auto', marginRight:'auto',backgroundColor:'#598e89',borderRadius:'90%'}} size='small' onClick={() => {booleanop(boolean)}} variant="contained" >
            <QueryStats/>
        </Avatar>
      </CardActions>
    </Card>


    {boolean==true&&<KpiCard SumOfExpenseAtraction={SumOfExpenseAtraction} AvgOfExpenseAtraction={AvgOfExpenseAtraction}
    SumOfExpenseSleep={SumOfExpenseSleep} AvgOfExpenseSleep={AvgOfExpenseSleep}
    SumOfExpenseFood={SumOfExpenseFood} AvgOfExpenseFood={AvgOfExpenseFood}
    SumOfExpenseParty={SumOfExpenseParty} AvgOfExpenseParty={AvgOfExpenseParty}
    SumOfExpenseDrugs={SumOfExpenseDrugs} AvgOfExpenseDrugs={AvgOfExpenseDrugs}
    SumOfExpenseCasino={SumOfExpenseCasino} AvgOfExpenseCasino={AvgOfExpenseCasino}/>}
          


    {boolean==true&&<GraphsBar Data={Data} DataPrecent={DataPrecent}/>}
      <Navigation pagNav={'budget'}/>
    </div>
  )
}
