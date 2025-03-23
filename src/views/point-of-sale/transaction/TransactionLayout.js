import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TimeFilter from 'src/pages/components/filter/FilterTime'
import { fetchAllPointOfSaleByWarehouseId } from 'src/store/apps/pos'
import TablePointOfSale from './TablePointOfSale'

export default function TransactionLayout({ warehouseId }) {
  const dispatch = useDispatch()
  const [timeFilter, setTimeFilter] = useState({
    month: '',
    year: new Date().getFullYear()
  })

  useEffect(() => {
    if (warehouseId) {
      dispatch(fetchAllPointOfSaleByWarehouseId(warehouseId))
    }
  }, [warehouseId])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20} sx={{ ml: '10px' }}>
            Daftar Point of Sale
          </Typography>
          <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
        </Box>
        <TablePointOfSale timeFilter={timeFilter} />
      </Grid>
    </Grid>
  )
}
