import { Grid } from '@mui/material'
import ButtonBack from 'src/views/common/ButtonBack'
import AddSalesOrderLoan from 'src/views/sales-order/AddSalesOrderLoan'

export default function AddSalesOrderLoanPage() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ButtonBack paddingY={3} name='Pembuatan Sales Order Loan' />
        <AddSalesOrderLoan />
      </Grid>
    </Grid>
  )
}
