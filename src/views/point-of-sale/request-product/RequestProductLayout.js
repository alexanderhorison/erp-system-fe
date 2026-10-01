import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchAllRequestOrder } from 'src/store/apps/product-request-order'
import TableRequestProduct from './TableRequestProduct'

export default function RequestProductLayout({ warehouseId, isMobile, isTablet, isLowHeight }) {
  const dispatch = useDispatch()
  const [timeFilter, setTimeFilter] = useState({
    month: '',
    year: new Date().getFullYear()
  })

  useEffect(() => {
    if (warehouseId) {
      dispatch(fetchAllRequestOrder({ isPosLayout: true }))
    }
  }, [warehouseId])

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <TableRequestProduct
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        isMobile={isMobile}
        isTablet={isTablet}
        isLowHeight={isLowHeight}
      />
    </Box>
  )
}
