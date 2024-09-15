import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import TimeFilter from 'src/pages/components/filter/FilterTime'
import TableAllGoodsOut from 'src/views/adjustment/goods-out/TableAllGoodsOut'

export default function AdjustmentGoodsOut() {
  const [timeFilter, setTimeFilter] = useState({
    month: '',
    year: new Date().getFullYear()
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Daftar Penyesuaian Barang Keluar</Typography>
          <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
        </Box>
        <TableAllGoodsOut timeFilter={timeFilter} />
      </Grid>
    </Grid>
  )
}
