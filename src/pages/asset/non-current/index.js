import Grid from '@mui/material/Grid'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import TableNonCurrentAsset from 'src/views/asset/non-current/TableNonCurrentAsset'

export default function NonCurrentAsset() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Aset Tidak Lancar Bulanan'
          breadcrumbs={[
            { label: 'Assets' },
            { label: 'Non-Current Assets' },
            { label: 'Monthly Non-Current Assets' }
          ]}
        />
        <TableNonCurrentAsset />
      </Grid>
    </Grid>
  )
}
