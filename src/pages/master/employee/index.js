import { Grid, Typography } from '@mui/material'
import TableMasterEmployee from 'src/views/master/employee/TableMasterEmployee'

export default function homeMasterEmployee() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Master Data Karyawan
        </Typography>
        <TableMasterEmployee />
      </Grid>
    </Grid>
  )
}
