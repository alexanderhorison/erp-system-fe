import { Grid, Typography } from '@mui/material'
import TableMasterShift from 'src/views/master/shift/TableMasterShift'

export default function homeMasterShift() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Master Data Shift
        </Typography>
        <TableMasterShift />
      </Grid>
    </Grid>
  )
}