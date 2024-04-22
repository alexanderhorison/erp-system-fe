import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Grid, Typography } from '@mui/material'
import TableProductView from 'src/views/product-warehouse/product/TableProductView'

import { fetchProduct } from 'src/store/apps/product-warehouse'

export default function HomeProduct() {
  const dispatch = useDispatch()
  const { dataListProductWarehouse: data } = useSelector(state => state.productWarehouse)

  useEffect(() => {
    dispatch(fetchProduct())
  }, [dispatch])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Daftar Produk di gudang "{data?.warehouseName}"
        </Typography>
        <TableProductView data={data?.data} WarehouseId={data?.WarehouseId} />
      </Grid>
    </Grid>
  )
}
