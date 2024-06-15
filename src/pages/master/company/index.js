import { Grid, Typography } from '@mui/material'
import TableMasterCompany from 'src/views/master/company/TableMasterCompany'

export default function homeMasterCompany() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Master Data Company
        </Typography>
        <TableMasterCompany />
      </Grid>
    </Grid>
  )
}
