import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableMasterCompany from 'src/views/master/company/TableMasterCompany'

export default function homeMasterCompany() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Master Data Company'
          breadcrumbs={[{ label: 'Inventory' }, { label: 'Data Inventory' }, { label: 'Companies' }]}
        />
        <TableMasterCompany />
      </Grid>
    </Grid>
  )
}
