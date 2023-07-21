import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import OptionsCard from './OptionsCard';
import { useSlotProps } from '@mui/base';

export default function OptionsCom(props) {
  const [dataCard, setDataCard] = React.useState();
  const renderCard = (value) => {
    setDataCard(value)
  }

  const handleChange = (event, newValue) => {
    props.tabChanged(newValue)
  };
  return (
    <Box sx={{ maxWidth: { xs: 330 }, bgcolor: 'background.paper', mb: 5 }}>
      <Tabs
        value={props.value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
      >
        <Tab label="חירום" onClick={() => { renderCard("חירום") }} />
        <Tab label="טיולים" onClick={() => { renderCard("טיולים") }} />
        <Tab label="הוסטלים" onClick={() => { renderCard("הוסטלים") }} />
        <Tab label="אטרקציות" onClick={() => { renderCard("אטרקציות") }} />
      </Tabs>
      <Box>

        {props.data[props.value].map((item, index) => {
          return (<div className="mapCard" key={'card' + index} onClick={() => {
            console.log({ item })
            // navigate to item page
          }}>
            <OptionsCard selected={props.selected} userFromDB={props.userFromDB} tabIndex={props.value} item={item} index={index} />
          </div>)
        })}
      </Box>
    </Box>
  )
};