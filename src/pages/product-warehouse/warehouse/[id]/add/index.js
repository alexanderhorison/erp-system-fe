import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMasterDataWarehouseDetail } from 'src/store/apps/master/warehouse'
import TableAddProductWarehouseV2 from 'src/views/product-warehouse/warehouse/TableAddProductWarehouseV2'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'

export default function AddProductWarehouse() {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const { detail: masterDataWarehouseDetail } = useSelector(state => state.warehouse)

  useEffect(() => {
    if (id) {
      dispatch(fetchMasterDataWarehouseDetail(id))
    }
  }, [id, dispatch])

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Add Product'
          subtitle={
            masterDataWarehouseDetail?.name ? `${masterDataWarehouseDetail.name}` : undefined
          }
          onBack={() => router.push(`/product-warehouse/warehouse/${id}`)}
        />
        <TableAddProductWarehouseV2 warehouse={masterDataWarehouseDetail} />
      </Grid>
    </Grid>
  )
}
