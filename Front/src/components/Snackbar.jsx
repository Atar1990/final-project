import { Snackbar as Snack, Alert } from '@mui/material'

export function Snackbar({ snackbar }) {
    return (
        <Snack open={snackbar.open} autoHideDuration={6000}>
            <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
            </Alert>
        </Snack>
    )
}