import { Grid, Skeleton, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchListProductByWarehouse } from 'src/store/apps/product-warehouse'
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

  // if (loading) {
  //   return (
  //     <Grid container marginTop={-25}>
  //       <Grid item xs={12}>
  //         <Skeleton height={500} width={'full'}></Skeleton>
  //       </Grid>
  //     </Grid>
  //   )
  // }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          {`Daftar Produk di ${data?.warehouseName}`}
        </Typography>
        <TableProduct loading={loading} data={data.data} warehouseId={id} />
      </Grid>
    </Grid>
  )
}
