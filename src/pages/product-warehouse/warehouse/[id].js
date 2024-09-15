import { Grid, Skeleton, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchListProductByWarehouse } from 'src/store/apps/product-warehouse'
import ButtonBack from 'src/views/common/ButtonBack'
import TableProduct from 'src/views/product-warehouse/warehouse/TableProduct'

export default function HomeProductWarehouseId() {
  const router = useRouter()
  const id = router.query.id
  const dispatch = useDispatch()

  const { dataListProductWarehouse: data, loadingListProductWarehouse: loading } = useSelector(
    state => state.productWarehouse
  )
  useEffect(() => {
    if (id) {
      dispatch(fetchListProductByWarehouse({ warehouseId: id }))
    }
  }, [id, dispatch])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ButtonBack name={`Daftar Produk di ${data?.warehouseName}`} />
        <TableProduct loading={loading} data={data?.data || []} warehouseId={id} />
      </Grid>
    </Grid>
  )
}
