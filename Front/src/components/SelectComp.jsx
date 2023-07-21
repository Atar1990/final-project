import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function CountrySelect(props) {
    return (
        <Autocomplete
            id="country-select-demo"
            sx={{ width: 300 }}
            options={countries}
            autoHighlight
            onChange={ev => props.onChange(ev.target.innerText)}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 1 } }} {...props}>
                    {option.label}
                </Box>
            )}

            renderInput={(params) => (
                <TextField
                    {...params}
                    label="בחר אזור"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                    }}

                />
            )}
        />
    )
}

export default CountrySelect;

const countries = [
    {
        label: 'הודו',
    },
    {
        label: 'אווקודור',
    },
    {
        label: 'ברזיל',
    },
    {
        label: 'מקסיקו',
    }
]