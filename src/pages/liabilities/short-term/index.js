import Grid from '@mui/material/Grid'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import TableShortTerm from 'src/views/liabilities/short-term/TableShortTerm'

export default function ShortTermLiabilities() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Liabilitas Jangka Pendek Bulanan'
          breadcrumbs={[{ label: 'Monthly Liabilities' }, { label: 'Short Term' }]}
        />
        <TableShortTerm />
      </Grid>
    </Grid>
  )
}
