import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchAllPointOfSaleByWarehouseId } from 'src/store/apps/pos'
import TablePointOfSale from './TablePointOfSale'

export default function TransactionLayout({ warehouseId, isMobile, isTablet, isLowHeight }) {
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
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <TablePointOfSale
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        isMobile={isMobile}
        isTablet={isTablet}
        isLowHeight={isLowHeight}
      />
    </Box>
  )
}
