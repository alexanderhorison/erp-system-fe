import { Grid, Typography } from '@mui/material'
import TableAllInternalTransfer from 'src/views/internalTransfer/TableAllInternalTransfer'

export default function internalTransfer() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Daftar Internal Transfer Rak
        </Typography>
        <TableAllInternalTransfer />
      </Grid>
    </Grid>
  )
}