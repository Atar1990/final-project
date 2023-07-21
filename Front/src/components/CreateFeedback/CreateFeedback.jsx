import React, { useEffect, useState } from 'react';
import './CreateFeedback.css';
import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { feedbackService } from '../../services/feedback.service';
import { TextField } from '@mui/material';
import TopOfAplication from '../TopOfAplication';
import Navigation from '../Navigation';
import { storageService } from '../../services/storage.service';
import Swal from 'sweetalert2';

import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer,rtlPlugin],
});

function CreateFeedback({ userFromDB }) {
  const [form, setForm] = useState();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState()
  const submit = async (ev) => { //לאחר ההוספה של הפרק העמוד מובל לעמוד תודה למשתמש
    ev.preventDefault();
    const res = await feedbackService.createfromuser(form, userFromDB);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'אנחנו מודים לך על השיתוף, נוסיף את ההצעה בהקדם',
      showConfirmButton: false,
      timer: 3000
    })
    // navigate('/ThanksPage');
    navigate('/userProfile');

  };

  const handleChange = async (ev) => { //לוקח את הפרמטרים ש/מזינים בפורם
    let { name, value } = ev.target;
    if (name === 'FeedbackPhoto') {

      const file = ev.target.files[0]
      console.log({ file });
      setLoading(true)
      if (file) {
        const url = await storageService.upload(file)
        setLoading(false)
        setForm({ ...form, [name]: url });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };


  return ( //יצירה של הפידבק
  <CacheProvider value={cacheRtl}>

    <div className='create-episode'>
      <div className='container center'>
        <TopOfAplication label='הוספת נקודה חדשה' UserType={userFromDB.UserType} />
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <form onSubmit={submit}>
          <div className='input-container'>
            <FormControl sx={{ m: 1, width: 'calc(100% - 16px)', height: 'calc(90% - 16px)' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-email">שם מלא (כפי שמופיע בגוגל)</InputLabel>
              <OutlinedInput
                cols='50'
                rows='1'
                onInput={handleChange}
                name='FeedbackTitle'
                id="fullWidth"
                label="Title"
                value={form?.FeedbackTitle}
              />
            </FormControl>
          </div>
          <div className='input-container'>
            <FormControl sx={{ m: 1, width: 'calc(100% - 16px)', height: 'calc(90% - 16px)' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-email">תיאור</InputLabel>
              <OutlinedInput
                cols='50'
                rows='2'
                onInput={handleChange}
                name='FeedbackDescription'
                id="fullWidth"
                label="Description"
                value={form?.FeedbackDescription}
                multiline={true}
              />
            </FormControl>
          </div>
          <div className='input-container'>
            
          <FormControl fullWidth>
          <InputLabel htmlFor="outlined-adornment-email">שם המדינה</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={form?.FeedbackCountry}
              label="Age"
              name='FeedbackCountry'
              fullWidth
              onChange={handleChange}
            >
              <MenuItem value={"אווקודור"}>אווקודור</MenuItem>
              <MenuItem value={"ארגנטינה"}>ארגנטינה</MenuItem>
              <MenuItem value={"בוליביה"}>בוליביה</MenuItem>
              <MenuItem value={"בורמה"}>בורמה</MenuItem>
              <MenuItem value={"ברזיל"}>ברזיל</MenuItem>
              <MenuItem value={"גוואטמלה"}>גוואטמלה</MenuItem>
              <MenuItem value={"הודו"}>הודו</MenuItem>
              <MenuItem value={"ויאטנם"}>ויאטנם</MenuItem>
              <MenuItem value={"לאוס"}>לאוס</MenuItem>
              <MenuItem value={"מקסיקו"}>מקסיקו</MenuItem>
              <MenuItem value={"נאפל"}>נאפל</MenuItem>
              <MenuItem value={"סרילנקה"}>סרילנקה</MenuItem>
              <MenuItem value={"פיליפינים"}>פיליפינים</MenuItem>
              <MenuItem value={"פנמה"}>פנמה</MenuItem>
              <MenuItem value={"פרו"}>פרו</MenuItem>
              <MenuItem value={"צילה"}>צילה</MenuItem>
              <MenuItem value={"קולומביה"}>קולומביה</MenuItem>
              <MenuItem value={"קוסטה ריקה"}>קוסטה ריקה</MenuItem>
              <MenuItem value={"קמבודיה"}>קמבודיה</MenuItem>
              <MenuItem value={"תאילנד"}>תאילנד</MenuItem>
            </Select>
          </FormControl>


          </div>
          <div className='input-container'>
            <FormControl sx={{ m: 1, width: 'calc(100% - 16px)', height: 'calc(90% - 16px)' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-email">איזור במדינה  </InputLabel>
              <OutlinedInput
                cols='50'
                rows='1'
                onInput={handleChange}
                name='FeedbackRegionOfTheCountry'
                id="fullWidth"
                label="RegionOfTheCountry"
                value={form?.FeedbackRegionOfTheCountry}
              />
            </FormControl>
          </div>
          <FormControl fullWidth>
          <InputLabel htmlFor="outlined-adornment-email">איזה סוג של המלצה זו</InputLabel>
            {/* <label>סוג</label> */}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={form?.KindOfFeedback}
              label="Age"
              name='KindOfFeedback'
              fullWidth
              onChange={handleChange}
            >
              <MenuItem value={"Attractions"}>Attractions</MenuItem>
              <MenuItem value={"Trips"}>Trips</MenuItem>
              <MenuItem value={"SleepingComplexes"}>SleepingComplexes</MenuItem>
              <MenuItem value={"AidComplexes"}>AidComplexes</MenuItem>
            </Select>
          </FormControl>
          <div className="seperator"></div>

          <div className='input-container'>
            <input className='imginput' type='file' name='FeedbackPhoto' onChange={handleChange}></input>
            {loading && <div className="loading"> loading...</div>}
          </div>
          <div className='input-container-button'>
            <Button
              // className='btn btn-create'
              variant='contained'
              style={{ backgroundColor: '#598e89' }}
              onClick={submit}
            >
              הוספה
            </Button>
          </div>
          <br></br>
          <br></br>
        </form>
      </div>
      <Navigation></Navigation>
    </div>
    </CacheProvider>

  );
}

export default CreateFeedback;
