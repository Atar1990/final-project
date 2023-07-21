import React, { useEffect, useState } from 'react';
import './CreateEpisode.css';
import { Button, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useParams } from 'react-router-dom';
import { chapterService } from '../../services/chapter.service';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { Card } from '@mui/material';
import TopOfAplication from '../TopOfAplication';
import Navigation from '../Navigation';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import Writing from '../../assets/Writing.png';
import { storageService } from '../../services/storage.service';
import yoman from '../../assets/yoman.png';
import Swal from 'sweetalert2';

import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer,rtlPlugin],
});
function CreateEpisode(props) {
  const [form, setForm] = useState();
  const [time, setTime] = useState();
  const [init, setInit] = useState(true);
  const { NameOfChapter } = useParams();
  const navigate = useNavigate();

  const submit = async (ev) => { //ממיר את התאריך לפורמט המתאים בדאטה בייס
    ev.preventDefault();
    form.ChapterDate = new Date(form.ChapterDate).toLocaleDateString('en-us')
    form.ChapterTime = formatAMPM(new Date(form.ChapterTime))
    console.log('before save to server');
    if (NameOfChapter) {
      const res = await chapterService.update(form);
    } else {
      const res = await chapterService.create(form,props.userEmailFromDB);
    }
    console.log('sumbit end');
      Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'פרק עודכן בהצלחה',
      showConfirmButton: false,
      timer: 2000
    })
    navigate('/episodes');
  };


  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    console.log({ hours, minutes });

    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours < 10 ? '0' + hours : hours;
    var strTime = hours + ':' + minutes;
    return strTime;
  }

  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function () {
      await storageService.upload(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  const handleChange = async (ev) => { //לוקח את הפרמטרים ש/מזינים בפורם
    let { name, value } = ev.target;
    if (name === 'ChapterPictures') {

      const file = ev.target.files[0]
      console.log({ file });
      if (file) {
        const url = await storageService.upload(file)
        setForm({ ...form, [name]: url });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  useEffect(() => { //טוען את הפרק לאחר ההוספה

    if (NameOfChapter) {

      loadEpisode();
    }
  }, []);

  useEffect(() => {
    if (form) {
      if (init) {
        const now = new Date()
        if (form.ChapterTime) {
          now.setHours(form.ChapterTime.split(':')[0])
          now.setMinutes(form.ChapterTime.split(':')[1])
          setTime(dayjs(now))
        }
        setInit(false)
      }
    }
  }, [form])

  const loadEpisode = async () => {
    const data = await chapterService.getById(NameOfChapter,props.userEmailFromDB);
    setForm(data);
  };
  return ( //היצירה של הפרק מבחינה ויזואלית
  <CacheProvider value={cacheRtl}>

    <div className='create-episode'>
      <div className='container center'>
        <div className='container center'>
          <TopOfAplication label='יצירה-עדכון פרק' UserType={props.userFromDB.UserType} />
          <br></br>
          {/* 'book-image3' */}
          <img className='App-logo' src={yoman}></img>
          <form onSubmit={submit} >
            <FormControl style={{direction:'rtl'}} className='sty' sx={{ m: 1, width: 'calc(100% - 16px)' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-email">שם הפרק</InputLabel>
              <OutlinedInput
                onInput={handleChange}
                name='NameOfChapter'
                id="outlined-adornment-email"
                label="Title"
                value={form?.NameOfChapter || ''}
              />
            </FormControl>
            <FormControl style={{direction:'rtl'}} className='sty'  sx={{ m: 1, width: 'calc(100% - 16px)' }} variant="outlined">
              <DatePicker
                label="תאריך"
                value={dayjs(form?.ChapterDate)}
                onChange={(ChapterDate) => setForm({ ...form, ChapterDate })}
             
              />
            </FormControl>
            <FormControl style={{direction:'rtl'}} className='sty'  sx={{ m: 1, width: 'calc(100% - 16px)' }} variant="outlined">
              <TimePicker
                label="שעה"
                onChange={(ChapterTime) => setForm({ ...form, ChapterTime })}
                value={time}
              />
            </FormControl>
            <FormControl className='sty'  sx={{ m: 1, width: 'calc(100% - 16px)' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-email">תיאור הפרק</InputLabel>
              <OutlinedInput
                onInput={handleChange}
                cols='50'
                rows='5'
                multiline={true}
                name='ChapterDescription'
                id="outlined-adornment-email"
                label=""
                dir='rtl'
                value={form?.ChapterDescription || ''}
              />
            </FormControl>
            <br></br>
            <div className='input-container'>
              <b style={{fontSize:'13px'}}>תמונה-</b>
              <input className='imginput' type='file' name='ChapterPictures' onChange={handleChange}  ></input>
            </div>
          </form>
          <div className='input-container-button'>
            <Button
              // className='btn btn-create'
              variant='contained'
              onClick={submit}
              style={{ backgroundColor: '#598e89' }}
            >
              שמור פרק
            </Button>
          </div>
          <br></br>
        </div>
        <Navigation pagNav={'diery'}/>
      </div>
    </div>
    </CacheProvider>

  );
};

export default CreateEpisode;
