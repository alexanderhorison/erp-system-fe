
import { Button, Card, CardContent, Grid, Typography } from '@mui/material'
import {  useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import 'react-datepicker/dist/react-datepicker.css'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'

import {  fetchDetailStockOpname } from 'src/store/apps/stock-opname'
import TableDetailStockOpname from './TableDetailStockOpname'

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

  return (
    // <form onSubmit={e => onSubmit(e)}>
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container gap={4}>

              <Grid container display='flex' gap={4} justifyContent={'space-between'}>
                <Grid item xs={12} md={5}>
                  <CustomTextField
                    fullWidth
                    value={detailStockOpname?.warehouseName || "-"}
                    label='Nama Gudang'
                    disabled
                    aria-describedby='validation-schema-name'
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <CustomTextField
                    fullWidth
                    value={detailStockOpname?.createdAt || "-"}
                    label='Tanggal Stock Opname'
                    placeholder=''
                    disabled
                    aria-describedby='validation-schema-name'
                  />
                </Grid>
              </Grid>
              <Grid container gap={2} flexDirection={'column'}>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  Code: {detailStockOpname?.code || "-"}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  Dibuat Oleh: {detailStockOpname?.creatorName || "-"}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  Status: {detailStockOpname?.status || "-"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
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
        <Button variant='tonal' color='primary' onClick={() => router.back()} startIcon={<Icon icon='tabler:back' />}>
          Back
        </Button>
      </Grid>
    </Grid>
    // </form>
  )
}
