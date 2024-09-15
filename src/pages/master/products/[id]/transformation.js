import { Grid, IconButton, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMasterDataProductDetail } from 'src/store/apps/master/product'
import TableMasterTransformation from 'src/views/master/transformation/TableMasterTransformation'
import ButtonBack from 'src/views/common/ButtonBack'

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
        <ButtonBack paddingY={3} name={`Master Transformasi ${detail.name}`} />
        <TableMasterTransformation product={detail} />
      </Grid>
    </Grid>
  )
}
