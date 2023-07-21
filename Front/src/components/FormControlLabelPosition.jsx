import * as React from 'react';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function FormControlLabelPosition() {
  return (
    <FormControl component="fieldset" style={{color:'black'}}>
      <FormGroup aria-label="position" row >
        <FormControlLabel
          value="bottom"
          control={<Switch color="primary" />}
          label="מזרח"
          labelPlacement="bottom"
        />
          <FormControlLabel
          value="bottom"
          control={<Switch color="primary" />}
          label="דרום-מרכז אמריקה"
          labelPlacement="bottom"
        />
      </FormGroup>
    </FormControl>
  );
}