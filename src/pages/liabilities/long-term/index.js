import Grid from '@mui/material/Grid'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import TableLongTerm from 'src/views/liabilities/long-term/TableLongTerm'

export default function LongTermLiabilities() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Liabilitas Jangka Panjang Bulanan'
          breadcrumbs={[{ label: 'Monthly Liabilities' }, { label: 'Long Term' }]}
        />
        <TableLongTerm />
      </Grid>
    </Grid>
  )
}
