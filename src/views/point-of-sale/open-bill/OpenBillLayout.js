import Box from '@mui/material/Box'

import TableOpenBill from './TableOpenBill'

export default function OpenBillLayout({ setSelectedMenu, warehouse, isMobile, isTablet, isLowHeight }) {
  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <TableOpenBill
        setSelectedMenu={setSelectedMenu}
        warehouse={warehouse}
        isMobile={isMobile}
        isTablet={isTablet}
        isLowHeight={isLowHeight}
      />
    </Box>
  )
}
