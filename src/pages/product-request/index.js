import { Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import TimeFilter from 'src/pages/components/filter/FilterTime'
import { Box } from '@mui/system'
import { useDispatch } from 'react-redux'
import { fetchAllRequestOrder } from 'src/store/apps/product-request-order'
import TableRequestProduct from 'src/views/product-request/TableProductRequest'

export default function ProductRequest() {
  const dispatch = useDispatch()
  const [timeFilter, setTimeFilter] = useState({
    month: '',
    year: new Date().getFullYear()
  })

  useEffect(() => {
    dispatch(fetchAllRequestOrder())
  }, [dispatch])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Daftar Product Request</Typography>
          <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
        </Box>
        <TableRequestProduct />
      </Grid>
    </Grid>
  )
}
