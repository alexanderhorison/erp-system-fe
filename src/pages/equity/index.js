import Grid from '@mui/material/Grid'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import TableEquity from 'src/views/equity/TableEquity'

export default function Equity() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader title='Ekuitas Bulanan' breadcrumbs={[{ label: 'Monthly Equity' }, { label: 'Equity' }]} />
        <TableEquity />
      </Grid>
    </Grid>
  )
}
