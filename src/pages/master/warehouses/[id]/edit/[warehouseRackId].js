import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMasterDataWarehouseDetail } from 'src/store/apps/master/warehouse'
import { fetchMasterDataWarehouseRackDetail } from 'src/store/apps/master/warehouse-rack'
import TableAddMasterWarehouseRack from 'src/views/master/warehouses-rack/TableAddMasterWarehouseRack'

export default function EditMasterDataWarehouseRack() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id, warehouseRackId } = router.query
  const { detail } = useSelector(state => state.warehouse)

  useEffect(() => {
    if (id) {
      dispatch(fetchMasterDataWarehouseDetail(id))
      dispatch(fetchMasterDataWarehouseRackDetail(warehouseRackId))
    }
  }, [id, warehouseRackId, dispatch])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Sunting Rak pada gudang "{detail?.name}"
        </Typography>
        <TableAddMasterWarehouseRack warehouse={detail} typeModal={'EDIT'} />
      </Grid>
    </Grid>
  )
}
