import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHistoryProduct } from 'src/store/apps/product-warehouse'
import TableHistoryProduct from 'src/views/product-warehouse/product/TableHistoryProduct'
export default function HomeProduct() {
  const router = useRouter()
  const dispatch = useDispatch()
  const id = router.query.id

  const { listHistory: data } = useSelector(state => state.productWarehouse)

  useEffect(() => {
    dispatch(fetchHistoryProduct({ id }))
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          {data?.product?.productName} - {data?.product?.unitName}
        </Typography>
        <TableHistoryProduct history={data.history} product={data.product} />
      </Grid>
    </Grid>
  )
}
