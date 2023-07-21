
import React, { useState } from 'react'
import { FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup } from '@mui/material'
import { useRef } from 'react';

export default function SingelQuestion(props) {
  
  const [totalScore, setTotalScore]=useState(0);

  return (
    <div>
  <Paper style={{border:'solid black 1px',padding:'5px', margin:'25px',backgroundColor:'#eeeeee',padding:'15px'}}>
  <FormControl style={{color:'black', direction:'rtl', right:0}}>
  <FormLabel id="demo-radio-buttons-group-label"><b>{props.q}</b></FormLabel>
  <RadioGroup style={{marginLeft:'auto', marginRight:'auto'}}
  // row
    aria-labelledby="demo-radio-buttons-group-label"
    defaultValue="1"
    name="radio-buttons-group"
  >

  <FormControlLabel  value="1" control={<Radio />} label={props.f}  />
  <FormControlLabel  value="2" control={<Radio />} label={props.s}/>
  <FormControlLabel  value="3" control={<Radio />} label={props.t}/>
  
 
  {props.fo!==undefined?  <FormControlLabel  value="4" control={<Radio />} label={props.fo} /> :""}
  {props.l!==undefined?  <FormControlLabel  value="5" control={<Radio />} label={props.l} /> :""}

  </RadioGroup>
  </FormControl>
  </Paper>
    </div>
  )
}
