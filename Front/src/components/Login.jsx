import React, { useEffect, useState } from 'react';
import '../App.css';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { validateEmail } from '../utils/helpers'
import { Button, Link } from '@mui/material';
import { Snackbar } from './Snackbar';
import { login } from '../utils/api'
import { useNavigate } from 'react-router-dom';
import { AlternateEmail } from '@mui/icons-material';
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer,rtlPlugin],
});

function Login(props) {

 
    const nav = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loginFields, setLoginFields] = useState({
        password: '',
        email: ''
    })
    const [snackbar, setSnackbar] = useState({
        severity: 'success',
        open: false,
        message: ''
    })
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        const user= JSON.parse(localStorage.getItem('user'))
        if(user){
          nav('/profile')
        }
      }, [])
    return (
        <>
        <CacheProvider value={cacheRtl}>

            <div className="App-login" style={{direction:'rtl'}}>
                <img className="App-logo" src="logo.png" alt="sad" />
                <FormControl sx={{ m: 1, width: 'calc(100% - 16px)' }} variant="outlined">
                    <InputLabel  htmlFor="outlined-adornment-email">אימייל</InputLabel>
                    <OutlinedInput
                        error={!!loginFields.email && !validateEmail(loginFields.email)}
                        onBlur={ev => { setLoginFields({ ...loginFields, email: ev.target.value }) }}
                        id="outlined-adornment-email"
                        type="email"
                        label="Email"
                        startAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    edge="end"
                                >
                                    {<AlternateEmail/>}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: 'calc(100% - 16px)' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">סיסמא</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        startAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        onBlur={ev => { setLoginFields({ ...loginFields, password: ev.target.value }) }}
                        label="Password"
                    />
                </FormControl>
                <Button style={{backgroundColor: '#598e89'}} onClick={async () => {
                    //send loginFields to server and validate that user exist

                    const res = await login(loginFields);
                    const user = JSON.parse(res);

                    if (user) {
                        console.log({ user })
                        localStorage.setItem('user', JSON.stringify(user))
                        // if user exist - login
                        setSnackbar({
                            severity: 'success',
                            message: "WOWWWW",
                            open: true
                        })

                        /////////////////////
                        const sendEmail = () => { props.getEmail(user.UserEmail) }
                        sendEmail();///// העברת מייל לקומפוננטת האבא APP על מנת שנוכל לעבוד איתה בשאר האפליקציה
                        const sendUser = () => { props.getUser(user) }
                        sendUser();/// העברת המשתמש כולו
                        ////////////////////
                        /////////ניהול עבודה של אדמין
                        if (user.UserEmail==='admin@gmail.com') {
                            nav('UserProfileAdmin')
                        }
                        else{
                            nav('userProfile')
                        }
                        /////////
      
                    }
                    else {
                        console.log("users wasnt found!")

                        // else show error message and do nothing
                        setSnackbar({
                            severity: 'error',
                            message: "טעות אח שלי",
                            open: true
                        })
                    }


                }
                } variant="contained">התחברות</Button>
            </div>
            <Link onClick={() => { nav('signup') }}>עדיין לא נרשמתי</Link>
            <br />
            <Link onClick={() => { nav('ChangePassword') }}>שכחתי סיסמא</Link>
            <Snackbar snackbar={snackbar}></Snackbar>
            </CacheProvider>

        </>
    );
}

export default Login;
