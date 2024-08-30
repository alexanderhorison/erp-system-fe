
import { Button, Card, CardContent, Grid } from '@mui/material'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import 'react-datepicker/dist/react-datepicker.css'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'

import { confirmStockOpname, updateStatusStockOpname } from 'src/store/apps/stock-opname'
import TableDetailStockOpname from './TableDetailStockOpname'
import HeaderDetailStockOpname from './HeaderDetailStockOpname'

export default function DetailStockOpname({ stockOpnameId, detailStockOpname }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [selectedRows, setSelectedRows] = useState([])

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

  const handleConfirm = () => {
    dispatch(confirmStockOpname({ stockOpnameId, listProduct: selectedRows, router }))
  }

  return (
    <Grid container spacing={6}>
      <HeaderDetailStockOpname
        warehouseName={detailStockOpname?.warehouseName}
        createdAt={detailStockOpname?.createdAt}
        code={detailStockOpname?.code}
        status={detailStockOpname?.status}
        creatorName={detailStockOpname?.creatorName}
        updaterName={detailStockOpname?.updaterName}
        id={detailStockOpname?.id}
        type={"DETAIL"}
      />
      {
        (detailStockOpname?.status !== 'DRAFT') && (
          <Grid item xs={12}>
            <Card>
              <CardContent>Notes</CardContent>
              <CardContent>{detailStockOpname?.notes || '-'}</CardContent>
            </Card>
          </Grid>
        )
      }
      <Grid item xs={12}>
        <TableDetailStockOpname data={listProduct} status={detailStockOpname?.status} setSelectedRows={setSelectedRows} />
      </Grid>
      {
        (detailStockOpname?.status === 'DRAFT') && (
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
        )
      }
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
        {
          detailStockOpname?.status === 'APPROVED' &&
          <Button variant='tonal' color='success' onClick={() => handleConfirm()} startIcon={<Icon icon='tabler:circle-dashed-check' />}>
            Confirm
          </Button>
        }
      </Grid>
    </Grid>
  )
}
