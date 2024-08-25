import { Grid, Typography } from '@mui/material'
import AddInternalTransfer from 'src/views/internalTransfer/AddInternalTransfer'

export default function InternalTransferAdd() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Pembuatan surat internal transfer
        </Typography>
        <AddInternalTransfer />
      </Grid>
    </Grid>
  )
}