import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableMasterRank from 'src/views/master/rank/TableMasterRank'

export default function homeMasterRank() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Master Data Rank'
          breadcrumbs={[{ label: 'Sales Order' }, { label: 'Data Customer' }, { label: 'Rank' }]}
        />
        <TableMasterRank />
      </Grid>
    </Grid>
  )
}
