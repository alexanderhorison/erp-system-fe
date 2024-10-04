import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMasterDataProductDetail } from 'src/store/apps/master/product'
import TableMasterTransformation from 'src/views/master/transformation/TableMasterTransformation'
import ButtonBack from 'src/views/common/ButtonBack'
import TableMasterProductPrice from 'src/views/master/product-price/TableMasterProductPrice'
import { fetchMasterDataProductPrice } from 'src/store/apps/master/product-price'

export default function MasterProductTransformation() {
  const router = useRouter()
  const dispatch = useDispatch()

  const id = router.query.id

  const { detail } = useSelector(state => state.masterProduct)

  // Fetch Detail product
  useEffect(() => {
    if (id) {
      dispatch(fetchMasterDataProductDetail(id))
      dispatch(fetchMasterDataProductPrice(id))
    }
  }, [id, dispatch])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ButtonBack paddingY={3} />
        <Typography fontSize={20} paddingY={3}>
          Master Transformasi {detail?.name}
        </Typography>
        <TableMasterTransformation product={detail} />
      </Grid>
      <Grid item xs={12}>
        <Typography fontSize={20} paddingY={3}>
          Master Product Price
        </Typography>
        <TableMasterProductPrice product={detail} />
      </Grid>
    </Grid>
  )
}
