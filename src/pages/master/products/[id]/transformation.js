import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMasterDataProductDetail } from 'src/store/apps/master/product'
import TableMasterTransformation from 'src/views/master/transformation/TableMasterTransformation'

export default function MasterProductTransformation() {
  const router = useRouter()
  const dispatch = useDispatch()

  const id = router.query.id

  const { detail } = useSelector(state => state.masterProduct)

  // Fetch Detail product
  useEffect(() => {
    if (id) {
      dispatch(fetchMasterDataProductDetail(id))
    }
  }, [id, dispatch])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Master Transformasi {detail.name}
        </Typography>
        <TableMasterTransformation product={detail}/>
      </Grid>
    </Grid>
  )
}
