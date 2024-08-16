import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMasterDataWarehouseDetail } from 'src/store/apps/master/warehouse'
import TableAddProductWarehouse from 'src/views/product-warehouse/warehouse/TableAddProductWarehouse'
import TableAddProductWarehouseV2 from 'src/views/product-warehouse/warehouse/TableAddProductWarehouseV2'

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
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Tambahkan barang pada gudang "{masterDataWarehouseDetail?.name}"
        </Typography>
        {/* <TableAddProductWarehouse warehouse={masterDataWarehouseDetail} /> */}
        <TableAddProductWarehouseV2 warehouse={masterDataWarehouseDetail} />
      </Grid>
    </Grid>
  )
}
