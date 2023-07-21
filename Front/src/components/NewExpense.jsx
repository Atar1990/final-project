
import React, { useEffect } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import TopOfAplication from './TopOfAplication';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select } from '@mui/material';
import Navigation from './Navigation';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEnv } from '../utils/env';
import Swal from 'sweetalert2';
import { Extension } from '@mui/icons-material';

import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer,rtlPlugin],
});

export default function NewExpense(props) {

  const [category, setCategory] = React.useState('קטגוריה');
  const [title, setTitle] = React.useState('תיאור קצר');
  const [price, setPrice] = React.useState('מחיר בש"ח ליחידה');
  const [amount, setAmount] = React.useState('כמות יחידות');
  const numToDel = 0;/// החזקת המפתח שעתיד להמחק/ להערך
  const [key, setKey] = React.useState(0);

  const { state } = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    if (state != undefined) {
      const obj = state;
      console.log(obj.ExpensesKey)
      setKey(obj.ExpensesKey)
      setCategory(obj.KindOfExpenses)
      setTitle(obj.ExpensesTitle)
      setPrice(obj.PricePerOne)
      setAmount(obj.NumberOfRepeatExpenses)
    }
  }, [numToDel])

  const postNewExpenseToDB = () => {
    const apiUrl = getEnv() + '/expenses/post'
    const expense = {
      UserEmail: props.userFromDB.UserEmail,// שונה
      PricePerOne: price,
      NumberOfRepeatExpenses: amount,
      ExpensesTitle: title,
      KindOfExpenses: category,// 
      ExpensesKey: 4,
      TotalPriceToPay: price * amount
    };
    fetch(apiUrl,
      {
        method: 'POST',
        body: JSON.stringify(expense),
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8',
        })

      })
      .then(response => {
        console.log('response= ', response);
        console.log('response statuse=', response.status);
        console.log('response.ok=', response.ok)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'הוצאה חדשה נוספה',
          showConfirmButton: false,
          timer: 2000
        })

        nav('/budget')

      },
        (error) => {
          console.log("err post=", error);
          Swal.fire({
            icon: 'error',
            title: 'אופס...',
            text: 'משהו השתבש, ההוצאה לא נוספה',
          })
        });
  }

  const deleteExpense = () => {
    Swal.fire({
      title: 'מחיקת הוצאה לא ניתנת לשחזור',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'למחוק',
      denyButtonText: `לא למחוק`,
      cancelButtonText:'בטל'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('!נמחק', '', 'success')

    const apiUrl = getEnv() + '/expenses/delete/'
    fetch(apiUrl + state.ExpensesKey,
      {
        method: 'Delete',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8',
        }),
      })
      .then(response => {
        if (response.ok) {
          console.log('response.ok=', response.ok)
          console.log('num of key delete=', state.ExpensesKey)
        }
        nav('/budget')
      },
        (error) => {
          console.log("err post=", error);
        });
      } else if (result.isDenied) {
        Swal.fire('ההוצאה לא נמחקה', '', 'info')
      }
    })
  }

  const putExpense = () => {
    const apiUrl = getEnv() + '/expenses/put/'
    const expense = {
      UserEmail: props.userFromDB.UserEmail,// שונה
      PricePerOne: price,
      NumberOfRepeatExpenses: amount,
      ExpensesTitle: title,
      KindOfExpenses: category,// בעקבות בעיה בדאטה בייס כרגע הערך ישאר קבוע, אחרי סידור של נוי ילקח מהסלקט בהתאמה
      ExpensesKey: state.ExpensesKey,// לא באמת משנה מה ישלח פה
      TotalPriceToPay: price * amount
    };
    Swal.fire({
      title: '?לשמור את השינויים',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'שמור',
      denyButtonText: `אל תשמור`,
      cancelButtonText:'בטל'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('!נשמר', '', 'success')
        fetch(apiUrl + state.ExpensesKey,
          {
            method: 'PUT',
            body: JSON.stringify(expense),
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
              'Accept': 'application/json; charset=UTF-8',
            })
    
          })
          .then(response => {
            console.log('response= ', response);
            console.log('response statuse=', response.status);
            console.log('response.ok=', response.ok)
            nav('/budget')
    
          },
            (error) => {
              console.log("err post=", error);
            });

      } else if (result.isDenied) {
        Swal.fire('השינויים לא נשמרו', '', 'info')
      }
    })
    
  }

  return (
    <>
      <CacheProvider value={cacheRtl}>

      <TopOfAplication label='הוצאה חדשה' UserType={props.userFromDB.UserType} />
      <Paper sx={{ maxWidth: '300' }} style={{ direction: 'rtl'}} >
        <img className="App-logo" src="expense-logo.png" style={{ marginTop: '5px' }} />

        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 2, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >

          <FormControl sx={{ m: 1, width: '25ch' }} size="small">
            <InputLabel color='success' id="demo-select-small">{'סוג ההוצאה'}</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={category}
              label="קטגוריה"
              color="success"
              onChange={(event) => { setCategory(event.target.value) }}
              style={{backgroundColor:'#eeeeee'}}
 
            >
              <MenuItem value={""}>
                <em>אחר</em>
              </MenuItem>
              <MenuItem value={'לינה'}>לינה</MenuItem>
              <MenuItem value={'אטרקציות'}>אטרקציות</MenuItem>
              <MenuItem value={'מזון'}>מזון</MenuItem>
              <MenuItem value={'בילויים'}>בילויים</MenuItem>
              <MenuItem value={'הימורים'}>הימורים</MenuItem>
              <MenuItem value={'סמים'}>התארגנות</MenuItem>
            </Select>
          </FormControl>

          <TextField label={title} color="success" size="small" onChange={(event) => { setTitle(event.target.value) }} style={{backgroundColor:'#eeeeee'}} />
          <TextField type={'number'} label={price} color="success" size="small" onChange={(event) => { setPrice(event.target.value) }} style={{backgroundColor:'#eeeeee'}} />
          <TextField type={'number'} label={amount} color="success" size="small" onChange={(event) => { setAmount(event.target.value) }} style={{backgroundColor:'#eeeeee'}} />
          
        </Box>
        {key === 0 && <Button style={{ marginLeft: 'auto', marginRight: 'auto', margin: '5px', backgroundColor: '#598e89' }} size="small" onClick={postNewExpenseToDB} variant="contained"> הוסף הוצאה</Button>}
        {key !== 0 && <Button style={{ marginLeft: 'auto', marginRight: 'auto', margin: '5px', backgroundColor: '#598e89' }} size="small" onClick={deleteExpense} variant="contained"> לחץ למחיקה</Button>}
        {key !== 0 && <Button style={{ marginLeft: 'auto', marginRight: 'auto', margin: '5px', backgroundColor: '#598e89' }} size="small" onClick={putExpense} variant="contained">לחץ לעדכון</Button>}

      </Paper>
      <Navigation pagNav={'budget'} />
      </CacheProvider>

    </>
  )
}
