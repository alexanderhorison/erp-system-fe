import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableMasterEmployee from 'src/views/master/employee/TableMasterEmployee'

export default function homeMasterEmployee() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Master Data Karyawan'
          breadcrumbs={[{ label: 'Daily Cost' }, { label: 'Master Data' }, { label: 'Employees' }]}
        />
        <TableMasterEmployee />
      </Grid>
    </Grid>
  )
}
