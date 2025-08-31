import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import TimeFilter from 'src/pages/components/filter/FilterTime'
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
      dispatch(fetchAllRequestOrder())
    }
  }, [warehouseId])

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header Section */}
      <Box sx={{
        flexShrink: 0,
        gap: 1,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingY: isLowHeight ? 1 : { xs: 2, md: 3 },
        marginBottom: isLowHeight ? 1 : 2,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <Typography
          fontSize={isLowHeight ? 14 : { xs: 16, md: 20 }}
          sx={{ ml: { xs: 0, md: '10px' } }}
        >
          Daftar Product Request
        </Typography>
        <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
      </Box>

      {/* Table Section */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <TableRequestProduct
          timeFilter={timeFilter}
          isMobile={isMobile}
          isTablet={isTablet}
          isLowHeight={isLowHeight}
        />
      </Box>
    </Box>
  )
}
