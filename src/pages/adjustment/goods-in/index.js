import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import TableAllGoodsIn from 'src/views/adjustment/goods-in/TableAllGoodsIn'
import { useState } from 'react'
import TimeFilter from 'src/pages/components/filter/FilterTime'

export default function AdjustmentGoodsIn() {
  const [timeFilter, setTimeFilter] = useState({
    month: '',
    year: new Date().getFullYear()
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Daftar Penyesuaian Barang Masuk</Typography>
          <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
        </Box>
        <TableAllGoodsIn timeFilter={timeFilter} />
      </Grid>
    </Grid>
  )
}
