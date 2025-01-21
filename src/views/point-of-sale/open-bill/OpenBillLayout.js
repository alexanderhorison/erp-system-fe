import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'

import TableOpenBill from './TableOpenBill'

export default function OpenBillLayout({ setSelectedMenu }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20} sx={{ ml: '10px' }}>
            Daftar Open Bill
          </Typography>
        </Box>
        <TableOpenBill
          setSelectedMenu={setSelectedMenu}
        />
      </Grid>
    </Grid>
  )
}
