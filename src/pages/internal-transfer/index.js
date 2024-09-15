import { Grid, Typography } from '@mui/material'
import TableAllInternalTransfer from 'src/views/internalTransfer/TableAllInternalTransfer'
import { Box } from '@mui/system'
import { useState } from 'react'
import TimeFilter from 'src/pages/components/filter/FilterTime'

export default function InternalTransfer() {
  const [timeFilter, setTimeFilter] = useState({
    month: '',
    year: new Date().getFullYear()
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Daftar Internal Transfer Rak</Typography>
          <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
        </Box>
        <TableAllInternalTransfer timeFilter={timeFilter}/>
      </Grid>
    </Grid>
  )
}