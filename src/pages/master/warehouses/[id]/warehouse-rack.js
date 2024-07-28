import { Grid, IconButton, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TableMasterWarehouseRack from 'src/views/master/warehouses-rack/TableMasterWarehouseRack'
import { fetchMasterDataWarehouseDetail } from 'src/store/apps/master/warehouse'

export default function MasterWarehouseRack() {
  const router = useRouter()
  const dispatch = useDispatch()

  const id = router.query.id

  const { detail } = useSelector(state => state.warehouse)

  // Fetch Detail warehouse
  useEffect(() => {
    if (id) {
      dispatch(fetchMasterDataWarehouseDetail(id))
    }
  }, [id, dispatch])

  const goBack = () => {
    router.back()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box>
          <IconButton onClick={goBack}>
            <Icon icon='tabler:arrow-left' />
          </IconButton>
        </Box>
        <Typography paddingY={3} fontSize={20}>
          Master Rak Gudang "{detail.name}"
        </Typography>
        <TableMasterWarehouseRack warehouseId={detail.id}/>
      </Grid>
    </Grid>
  )
}
