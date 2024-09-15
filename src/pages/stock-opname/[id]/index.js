import { Button, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetailStockOpname } from 'src/store/apps/stock-opname'
import DetailStockOpname from 'src/views/stock-opname/DetailStockOpname'
import Icon from 'src/@core/components/icon'
import ButtonBack from 'src/views/common/ButtonBack'

export default function HomeDetailStockOpname() {
  const { id } = useRouter().query
  const dispatch = useDispatch()
  const router = useRouter()

  const { detailStockOpname } = useSelector(state => state.stockOpname)

  useEffect(() => {
    dispatch(fetchDetailStockOpname(id))
  }, [id, dispatch])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid container alignContent={'center'} justifyContent={'space-between'}>
          <Grid item>
            <ButtonBack name='Detail Stok Opname' />
          </Grid>
          {detailStockOpname?.status === 'DRAFT' &&
            <Grid item sx={{ alignContent: 'center' }}>
              <Button
                sx={{ mr: 1 }}
                variant='tonal'
                color='primary' onClick={() => router.push(`/stock-opname/${id}/edit`)}
                startIcon={<Icon icon='tabler:edit' />}
              >
                Edit
              </Button>
            </Grid>
          }
        </Grid>
        <DetailStockOpname stockOpnameId={id} detailStockOpname={detailStockOpname} />
      </Grid>
    </Grid>
  )
}
