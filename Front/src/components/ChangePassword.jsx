
import React from 'react'
import { useRef } from 'react'
import emailjs from "@emailjs/browser"
import { Button, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getEnv } from '../utils/env';
import TopOfAplication from './TopOfAplication';
import { useState } from 'react';
import Swal from 'sweetalert2';


export default function ChangePassword() {
    const nav = useNavigate();
    const [email, setEmail] = React.useState('');

    const form =useRef()
    const [msg, setMsg] = useState('')
    const sendEmail = (e) => {
        e.preventDefault();
    
        emailjs.sendForm('service_ahyodaa', 
        'template_l0astq8', form.current, 'TwAIolWQxjj10290K')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
        e.target.reset()
        console.log(email)
       
        const apiUrl = getEnv() + '/users/putemail/password/?email='
        fetch(apiUrl+email,
          {
            method: 'PUT',
            body: JSON.stringify('123456'),
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
              'Accept': 'application/json; charset=UTF-8',
            })

          })
          .then(response => {
            console.log('response= ', response);
            console.log('response statuse=', response.status);
            console.log('response.ok=', response.ok)
          },
            (error) => {
              console.log("err post=", error);
            });
        nav('/')
      };
    return (
        <>              
        <TopOfAplication label='שכחתי סיסמא' />
    <section>
        <div className="App-login" style={{direction:'rtl'}}>
                <img className="App-logo" src="forgetPassword.png" alt="sad" />
            <form ref={form} onSubmit={sendEmail} 
            className="--form-control--card--flex-center --ir-colum">
              <FormControl  sx={{ m: 1, width: 'calc(100% - 16px)' }} variant="outlined">
                <p className='ps'>שם פרטי</p>
              <InputLabel htmlFor="outlined-adornment-email"> </InputLabel>
              <OutlinedInput
                placeholder='שם פרטי'
                type="text"
                cols='50'
                rows='1'
                name='user_name' required
                id="outlined-adornment-email"
                label=""
                dir='rtl'
              />
            </FormControl>
                <br />
                <br />
                <FormControl  sx={{ m: 1, width: 'calc(100% - 16px)' }} variant="outlined">
                <p className='ps'>כתובת מייל איתה נרשמת </p>
              <InputLabel htmlFor="outlined-adornment-email"> </InputLabel>
              <OutlinedInput
                placeholder='כתובת מייל איתה נירשמת'
                type="email"
                cols='50'
                rows='1'
                name='user_email' required onChange={(event) => { setEmail(event.target.value) }}
                id="outlined-adornment-email"
                label=""
                dir='rtl'
              />
            </FormControl>
               <br />
               <br />
               
               <div className='btns'>
               <Button onClick={() => {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'סיסמא חדשה מחכה לך במייל',
                  showConfirmButton: false,
                  timer: 2200
                })

              }}
              className='btncreate'
              variant='contained'
              type='submit'
            >
               שלחו אליי סיסמא חדשה

            </Button>
            <Button onClick={() => nav("/")}
              className='btncreate'
              variant='contained'
              >
             תחזירו אותי להתחברות

            </Button>
               </div>
            <p>
                {msg && <div className="msg">{msg}</div>}
                </p>
            </form>
        </div>
    </section>
    </>
  )
}
