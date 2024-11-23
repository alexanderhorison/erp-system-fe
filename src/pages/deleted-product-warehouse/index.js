import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchListDeletedProductWarehouse } from 'src/store/apps/deleted-product-warehouse'
import ButtonBack from 'src/views/common/ButtonBack'
import TableDeletedProductWarehouse from 'src/views/deleted-product-warehouse/TableDeletedProductWarehouse'

export default function HomeDeletedProductWarehouse() {
  const router = useRouter()
  const dispatch = useDispatch()

  const { dataListDeletedProduct: data, loadingListDeletedProduct: loading } = useSelector(
    state => state.deletedProductWarehouse
  )

  useEffect(() => {
    if (!Object.keys(router.components).includes("/product-warehouse/product/[id]")) {
      dispatch(fetchListDeletedProductWarehouse({}))
    }
  }, [dispatch])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ButtonBack name={`Daftar Produk terhapus`} />
        <TableDeletedProductWarehouse loading={loading} data={data || []} />
      </Grid>
    </Grid>
  )
}
