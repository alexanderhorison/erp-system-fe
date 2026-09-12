import Grid from '@mui/material/Grid'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import TableMasterNonCurrentAsset from 'src/views/asset/master-non-current/TableMasterNonCurrentAsset'

export default function MasterNonCurrentAsset() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Master Data Aset Tidak Lancar'
          breadcrumbs={[
            { label: 'Assets' },
            { label: 'Non-Current Assets' },
            { label: 'Master Non-Current Assets' }
          ]}
        />
        <TableMasterNonCurrentAsset />
      </Grid>
    </Grid>
  )
}
