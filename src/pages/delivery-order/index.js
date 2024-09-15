import { Grid, Typography } from '@mui/material'
import TableAllInvoice from 'src/views/delivery-order/TableAllInvoice'
import { useState } from 'react'
import TimeFilter from 'src/pages/components/filter/FilterTime'
import { Box } from '@mui/system'

export default function HomeProductWarehouse() {
  const [timeFilter, setTimeFilter] = useState({
    month: '',
    year: new Date().getFullYear()
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Daftar Surat Jalan</Typography>
          <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
        </Box>
        <TableAllInvoice timeFilter={timeFilter} />
      </Grid>
    </Grid>
  )
}
