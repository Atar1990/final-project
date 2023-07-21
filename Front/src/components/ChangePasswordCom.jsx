import React, { useState, useEffect } from 'react';
import '../App.css';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { validateEmail } from '../utils/helpers'
import { Button } from '@mui/material';
import { Snackbar } from './Snackbar'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { signup } from '../utils/api';
import { signup2 } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import TopOfAplication from './TopOfAplication';
import Navigation from './Navigation';
import { AccountCircle } from '@mui/icons-material';
import Swal from 'sweetalert2';
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer,rtlPlugin],
});

function ChangePasswordCom(props) {
    const nav=useNavigate();
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [loginFields, setLoginFields] = useState({
        first_name: '',
        last_name: '',
        password1: '',
        password2: '',
        tos: false
    });
    const [snackbar, setSnackbar] = useState({
        severity: 'success',
        open: false,
        message: ''
    })
    const handleClickShowPassword1 = () => setShowPassword1((show) => !show);
    const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const formValidated = () => {
        const { first_name, last_name, tos, password1, password2 } = loginFields;
        const isValid = first_name && last_name && tos && password1 === password2;
        return isValid;
    }


    return (
        <>
        <CacheProvider value={cacheRtl}>
        <TopOfAplication label='שינוי פרטים אישיים' UserType={props.userFromDB.UserType}/>

        <div className="App-login" style={{direction:'rtl'}}>
            <img className="App-logo" src="changeDetels.png" />
            <FormControl sx={{ m: 1, width: 'calc(100% - 16px)' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-first_name">שם פרטי</InputLabel>
                <OutlinedInput
                    error={!loginFields.first_name && loginFields.first_name !== ''}
                    onBlur={ev => { setLoginFields({ ...loginFields, first_name: ev.target.value }) }}
                    id="outlined-adornment-first_name"
                    type="text"
                    label="First name"
                    //
                    startAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                // aria-label="toggle password visibility"
                                edge="end"
                            >
                                {<AccountCircle/>}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <FormControl sx={{ m: 1, width: 'calc(100% - 16px)' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-last_name">שם משפחה</InputLabel>
                <OutlinedInput
                    error={!loginFields.last_name && loginFields.last_name !== ''}
                    onBlur={ev => { setLoginFields({ ...loginFields, last_name: ev.target.value }) }}
                    id="outlined-adornment-last_name"
                    type="text"
                    label="Last name"
                    //
                    startAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                // aria-label="toggle password visibility"
                                edge="end"
                            >
                                {<AccountCircle/>}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>

            <FormControl sx={{ m: 1, width: 'calc(100% - 16px)' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password1">סיסמא חדשה</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password1"
                    type={showPassword1 ? 'text' : 'password'}
                    // endAdornment
                    startAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword1}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword1 ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    onBlur={ev => { setLoginFields({ ...loginFields, password1: ev.target.value }) }}
                    label="Password"
                />
            </FormControl>
            <FormControl sx={{ m: 1, width: 'calc(100% - 16px)' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password2">אימות סיסמא</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password2"
                    type={showPassword2 ? 'text' : 'password'}
                    startAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword2}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword2 ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    onBlur={ev => { setLoginFields({ ...loginFields, password2: ev.target.value }) }}
                    label="Password"
                    error={loginFields.password1 !== loginFields.password2 && loginFields.password1 !== ''}
                />
            </FormControl>
            <FormGroup>
                <FormControlLabel style={{ color: "#333" }} control={<Checkbox onChange={(ev) => { setLoginFields({ ...loginFields, tos: ev.target.checked }) }} />} label="אני מאשר את שינוי הפרטים" />
            </FormGroup>
            <Button style={{backgroundColor: '#598e89'}} disabled={!formValidated()} onClick={async () => {
                const msg = await signup2(loginFields,props.userEmailFromDB,props.userFromDB);
                if (!msg.includes('exist')) {
                    // if user created - login
                    setSnackbar({
                        severity: 'success',
                        message: "WOWWWW",
                        open: true
                    })
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'פרטים עודכנו בהצלחה',
                        showConfirmButton: false,
                        timer: 2000
                      })
                          nav('/userProfile')
                } else {
                    // else show error message and do nothing
                    setSnackbar({
                        severity: 'error',
                        message: "טעות אח שלי",
                        open: true
                    })
                }

            }} variant="contained">שינוי פרטים</Button>
            <Snackbar snackbar={snackbar}></Snackbar>
        </div>
        <Navigation pagNav={'profile'} />
        </CacheProvider>

        </>

    );
}

export default ChangePasswordCom;
