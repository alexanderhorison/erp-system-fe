import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import TableAllLoanStock from 'src/views/loan-stock/TableAllLoanStock'

export default function LoanStock() {

  return (
    <Grid container spacing={3}>
      {/* Table Loan Stock */}
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Daftar Loan Stock</Typography>
        </Box>
        <TableAllLoanStock />
      </Grid>
    </Grid>
  )
}
