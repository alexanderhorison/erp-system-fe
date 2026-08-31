import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Grid from '@mui/material/Grid'

import { fetchListDeletedProductWarehouse } from 'src/store/apps/deleted-product-warehouse'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import TableDeletedProductWarehouse from 'src/views/deleted-product-warehouse/TableDeletedProductWarehouse'

export default function HomeDeletedProductWarehouse() {
  const router = useRouter()
  const dispatch = useDispatch()

  const { dataListDeletedProduct: data, loadingListDeletedProduct: loading } = useSelector(
    state => state.deletedProductWarehouse
  )

  useEffect(() => {
    // ** Skip the initial fetch when arriving back from a product's detail page,
    // so the filtered list the user left is not replaced by an unfiltered one.
    if (!Object.keys(router.components).includes('/product-warehouse/product/[id]')) {
      dispatch(fetchListDeletedProductWarehouse({}))
    }
    // eslint-disable-next-line
  }, [dispatch])

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Daftar Produk Terhapus'
          breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Management' }, { label: 'Produk Terhapus' }]}
        />
        <TableDeletedProductWarehouse loading={loading} data={data || []} />
      </Grid>
    </Grid>
  )
}
