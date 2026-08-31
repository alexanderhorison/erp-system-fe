import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { exportAllStock, fetchListProductByWarehouse } from 'src/store/apps/product-warehouse'
import TableProduct from 'src/views/product-warehouse/warehouse/TableProduct'
import PageHeader from 'src/views/common/PageHeader'

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
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Product List'
          subtitle={data?.warehouseName || '-'}
          onBack={() => router.back()}
          breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Management' }, { label: 'Warehouses' }]}
        />
        <TableProduct
          loading={loading}
          data={data?.data || []}
          warehouseId={id}
          onExport={handleExport}
          isExporting={isExporting}
        />
      </Grid>
    </Grid>
  )
}
