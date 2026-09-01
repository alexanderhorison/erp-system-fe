// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import TableAllLoanStock from 'src/views/loan-stock/TableAllLoanStock'

export default function LoanStock() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Daftar Pinjaman Stok'
          breadcrumbs={[{ label: 'Inventory' }, { label: 'Loan Stock' }]}
        />
        <TableAllLoanStock />
      </Grid>
    </Grid>
  )
}
