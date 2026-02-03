import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import TimeFilter from 'src/pages/components/filter/FilterTime'
import TableAllPosTransaction from 'src/views/pos-transaction/TableAllPosTransaction'

export default function PosTransaction() {
  const [timeFilter, setTimeFilter] = useState({
    month: '',
    year: new Date().getFullYear()
  })

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Daftar Transaksi POS</Typography>
          <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
        </Box>
      </Grid>

      {/* Table POS Transaction */}
      <Grid item xs={12}>
        <TableAllPosTransaction timeFilter={timeFilter} />
      </Grid>
    </Grid>
  )
}
