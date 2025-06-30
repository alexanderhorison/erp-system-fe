import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import TableDebtEmployee from './TableDebtEmployee'

export default function EmployeeDebtInformation({}) {
  const router = useRouter()
  const { id } = router.query

  return (
    <Grid item xs={12} md={12}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          p: 3,
          boxShadow: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <TableDebtEmployee data={[]} />
      </Box>
    </Grid>
  )
}
