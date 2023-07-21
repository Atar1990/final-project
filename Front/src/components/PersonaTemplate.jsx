import { Box, Paper } from '@mui/material';
import React from 'react'
import TopOfAplication from './TopOfAplication';

export default function PersonaTemplate(props) {


  const PersonaArr=[];
  PersonaArr['mucillar']=<u style={{color:'green'}}>מוצ'ילר</u>;
  PersonaArr['balyanim']=<u style={{color:'blue'}}>בליין</u>;
  PersonaArr['chill']=<u style={{color:'red'}}>צ'יל</u>;

  return (
    <>  
<img className="persona-logo" src={props.pageNum+'.jpg'} alt='persona-logo' />
<Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
  <h3 style={{color:'black', fontSize:'20px', 
  textAlign:'center', marginLeft:'auto', marginRight:'auto', marginTop:'80px' } }>  {props.name} , שמחים  לעדכן כי תהליך האפיון הסתיים<br /> </h3>
<h5 style={
  {color:'black', fontSize:'15px', 
   textAlign:'center', marginLeft:'auto', 
   marginRight:'auto'}}> 
אין שאלה, אתה {PersonaArr[props.pageNum]} אמיתי <br /> עכשיו אחרי שהכרנו, תוכל להתחיל לתכנן את הטיול שלך בנחת, אנחנו כבר נדאג לעדכן ולשתף איתך את ההמלצות הטובות ביותר שמתאימות בדיוק לך<br /> 
</h5>
</Box>
    </>
  )
}
