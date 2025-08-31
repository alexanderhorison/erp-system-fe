import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'

import TableOpenBill from './TableOpenBill'

export default function OpenBillLayout({ setSelectedMenu, warehouse, isMobile, isTablet, isLowHeight }) {
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
        marginBottom: isLowHeight ? 1 : 2
      }}>
        <Typography
          fontSize={isLowHeight ? 14 : { xs: 16, md: 20 }}
          sx={{ ml: { xs: 0, md: '10px' } }}
        >
          Daftar Open Bill
        </Typography>
      </Box>

      {/* Table Section */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <TableOpenBill
          setSelectedMenu={setSelectedMenu}
          warehouse={warehouse}
          isMobile={isMobile}
          isTablet={isTablet}
          isLowHeight={isLowHeight}
        />
      </Box>
    </Box>
  )
}
