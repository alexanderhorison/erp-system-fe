import { Button, CircularProgress, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import TableProductWarehouse from 'src/views/product-warehouse/warehouse/TableProductWarehouse'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { exportAllStock } from 'src/store/apps/product-warehouse'

export default function homeProductWarehouse() {
  const dispatch = useDispatch()
  const { isExporting } = useSelector(state => state.productWarehouse)

  const handleExport = () => {
    dispatch(exportAllStock())
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', mb: 2 }}>
          <Typography fontSize={20}>Daftar Gudang</Typography>
          <Button sx={{ '& svg': { mr: 2 } }} variant='contained' onClick={handleExport}>
            {isExporting ? (
              <CircularProgress size={24} color='inherit' />
            ) : (
              <>
                <Icon fontSize='1.125rem' icon='tabler:download' />
                Export All Stock
              </>
            )}
          </Button>
        </Box>
        <TableProductWarehouse />
      </Grid>
    </Grid>
  )
}
