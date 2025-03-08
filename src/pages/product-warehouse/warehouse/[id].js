import { Box, Button, CircularProgress, Grid, IconButton, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { exportAllStock, fetchListProductByWarehouse } from 'src/store/apps/product-warehouse'
import TableProduct from 'src/views/product-warehouse/warehouse/TableProduct'
import Icon from 'src/@core/components/icon'

export default function HomeProductWarehouseId() {
  const router = useRouter()
  const id = router.query.id
  const dispatch = useDispatch()

  const { dataListProductWarehouse: data, loadingListProductWarehouse: loading } = useSelector(
    state => state.productWarehouse
  )

  const { isExporting } = useSelector(state => state.productWarehouse)

  useEffect(() => {
    if (id) {
      dispatch(fetchListProductByWarehouse({ warehouseId: id }))
    }
  }, [id, dispatch])

  const handleExport = () => {
    dispatch(exportAllStock({ warehouseId: id }))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', mb: 2 }}>
          <Typography fontSize={20}>
            <IconButton onClick={() => router.back()}>
              <Icon icon='tabler:arrow-left' />
            </IconButton>
            {`Daftar Produk di ${data?.warehouseName}`}
          </Typography>
          <Button sx={{ '& svg': { mr: 2 } }} variant='contained' onClick={handleExport}>
            {isExporting ? (
              <CircularProgress size={21} color='inherit' />
            ) : (
              <>
                <Icon fontSize='1.125rem' icon='tabler:download' />
                Export Current Stock
              </>
            )}
          </Button>
        </Box>
        <TableProduct loading={loading} data={data?.data || []} warehouseId={id} />
      </Grid>
    </Grid>
  )
}
