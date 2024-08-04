
import { Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import 'react-datepicker/dist/react-datepicker.css'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'

import { fetchDetailStockOpname, updateStatusStockOpname } from 'src/store/apps/stock-opname'
import TableDetailStockOpname from './TableDetailStockOpname'
import HeaderDetailStockOpname from './HeaderDetailStockOpname'

export default function DetailStockOpname({ stockOpnameId }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { detailStockOpname } = useSelector(state => state.stockOpname)
  useEffect(() => {
    dispatch(fetchDetailStockOpname(stockOpnameId))
  }, [stockOpnameId, dispatch])

  const listProduct = useMemo(() => {
    if (detailStockOpname && detailStockOpname.listProduct) {
      return detailStockOpname.listProduct
    }
    return []
  }, [detailStockOpname])

  const handleApprove = () => {
    dispatch(updateStatusStockOpname({ stockOpnameId, status: 'approve', router }))
  }

  const handleReject = () => {
    dispatch(updateStatusStockOpname({ stockOpnameId, status: 'reject', router }))
  }

  return (
    // <form onSubmit={e => onSubmit(e)}>
    <Grid container spacing={6}>
      <HeaderDetailStockOpname
        warehouseName={detailStockOpname?.warehouseName}
        createdAt={detailStockOpname?.createdAt}
        code={detailStockOpname?.code}
        status={detailStockOpname?.status}
        creatorName={detailStockOpname?.creatorName}
        id={detailStockOpname?.id}
        type={"DETAIL"}
      />
      <Grid item xs={12}>
        <TableDetailStockOpname data={listProduct} />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid item xs={12}>

              <CustomTextField
                multiline
                rows={3}
                fullWidth
                label='Catatan'
                placeholder={'Catatan...'}
                value={detailStockOpname?.notes || ''}
                type='text'
                sx={{ display: 'block' }}
                disabled
              />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid
        container
        sx={{ paddingLeft: '25px', marginTop: '20px' }}
        display='flex'
        justifyContent='flex-end'
        gap={6}
      >
        <Button variant='tonal' color='primary' onClick={() => router.push('/stock-opname')} startIcon={<Icon icon='tabler:arrow-left' />}>
          Back
        </Button>
        {
          (detailStockOpname?.status === 'DRAFT' || detailStockOpname?.status === 'PENDING') &&
          <Button variant='tonal' color='error' onClick={() => handleReject()} startIcon={<Icon icon='tabler:ban' />}>
            Reject
          </Button>
        }
        {
          (detailStockOpname?.status === 'DRAFT' || detailStockOpname?.status === 'PENDING') &&
          <Button variant='tonal' color='success' onClick={() => handleApprove()} startIcon={<Icon icon='tabler:send' />}>
            Approve
          </Button>
        }
      </Grid>
    </Grid>
    // </form>
  )
}
