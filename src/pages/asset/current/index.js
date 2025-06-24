import { Grid, Typography } from '@mui/material'
import TableCurrentAsset from 'src/views/asset/current/TableCurrentAsset'

export default function CurrentAsset() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Asset Lancar Bulanan
        </Typography>
        <TableCurrentAsset />
      </Grid>
    </Grid>
  )
}