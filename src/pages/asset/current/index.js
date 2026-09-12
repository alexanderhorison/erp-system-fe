import Grid from '@mui/material/Grid'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import TableCurrentAsset from 'src/views/asset/current/TableCurrentAsset'

export default function CurrentAsset() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader title='Aset Lancar Bulanan' breadcrumbs={[{ label: 'Assets' }, { label: 'Monthly Current Assets' }]} />
        <TableCurrentAsset />
      </Grid>
    </Grid>
  )
}
