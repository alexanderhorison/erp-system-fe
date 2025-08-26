import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import TimeFilter from 'src/pages/components/filter/FilterTime'
import { fetchAllRequestOrder } from 'src/store/apps/product-request-order'
import TableRequestProduct from './TableRequestProduct'

export default function RequestProductLayout({ warehouseId }) {
  const dispatch = useDispatch()
  const [timeFilter, setTimeFilter] = useState({
    month: '',
    year: new Date().getFullYear()
  })

  useEffect(() => {
    if (warehouseId) {
      dispatch(fetchAllRequestOrder())
    }
  }, [warehouseId])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20} sx={{ ml: '10px' }}>
            Daftar Product Request
          </Typography>
          <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
        </Box>
        <TableRequestProduct timeFilter={timeFilter} />
      </Grid>
    </Grid>
  )
}
