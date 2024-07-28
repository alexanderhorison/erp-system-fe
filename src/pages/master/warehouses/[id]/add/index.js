import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMasterDataWarehouseDetail } from 'src/store/apps/master/warehouse'
import TableAddMasterWarehouseRack from 'src/views/master/warehouses-rack/TableAddMasterWarehouseRack'

export default function AddMasterDataWarehouseRack() {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const { detail } = useSelector(state => state.warehouse)

  useEffect(() => {
    if (id) {
      dispatch(fetchMasterDataWarehouseDetail(id))
    }
  }, [id, dispatch])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Tambahkan Rak pada gudang "{detail?.name}"
        </Typography>
        <TableAddMasterWarehouseRack warehouse={detail} typeModal={'ADD'} />
      </Grid>
    </Grid>
  )
}
