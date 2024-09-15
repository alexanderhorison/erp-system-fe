import { Grid, Typography } from '@mui/material'
import ButtonBack from 'src/views/common/ButtonBack'
import AddInternalTransfer from 'src/views/internalTransfer/AddInternalTransfer'

export default function InternalTransferAdd() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ButtonBack paddingY={3} name='Pembuatan surat internal transfer' />
        <AddInternalTransfer />
      </Grid>
    </Grid>
  )
}