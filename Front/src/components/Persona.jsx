
import React, { useEffect, useState } from 'react'
import {Button, Paper} from '@mui/material';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import PersonaTemplate from './PersonaTemplate';
import { useNavigate } from 'react-router-dom';

export default function Persona(props) {
  const nav=useNavigate();

  return (
    <>
    <div>

      <Button onClick={()=>{nav('/NewQuestion')}}> <ArrowBackIosNew style={{color:'black',
    position: 'fixed', top: 30, left: 20, right: 0 }}/> </Button>
  </div>
  {props.pageNum=='mucillar' ? <div>
 <PersonaTemplate name={props.userFromDB.UserFirstName} pageNum='mucillar'/>
  </div> : ""}
  {props.pageNum=='balyanim' ? <div>
 <PersonaTemplate name={props.userFromDB.UserFirstName} pageNum='balyanim'/>
  </div> : ""}
  {props.pageNum=='chill' ? <div>
 <PersonaTemplate name={props.userFromDB.UserFirstName} pageNum='chill'/>
  </div> : ""}
  
  <Button style={{backgroundColor:'#598e89'}} onClick={() => {nav('/userProfile')}} variant="contained">אני רוצה להתחיל</Button>

    </>
  )
}






