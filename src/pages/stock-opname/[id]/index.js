import { Button, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { exportStockOpname, fetchDetailStockOpname } from 'src/store/apps/stock-opname'
import DetailStockOpname from 'src/views/stock-opname/DetailStockOpname'
import Icon from 'src/@core/components/icon'
import ButtonBack from 'src/views/common/ButtonBack'
import ExportButton from 'src/views/common/ExportButton'

export default function HomeDetailStockOpname() {
  const { id } = useRouter().query
  const dispatch = useDispatch()
  const router = useRouter()

  const { detailStockOpname, loadingExport } = useSelector(state => state.stockOpname)

  useEffect(() => {
    dispatch(fetchDetailStockOpname(id))
  }, [id, dispatch])

  const handleExport = () => {
    dispatch(exportStockOpname({ code: id }))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid container alignContent={'center'} justifyContent={'space-between'}>
          <Grid item>
            <ButtonBack name='Detail Stok Opname' />
          </Grid>
          <Grid item>
            <Grid container>
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
              {
                detailStockOpname?.status === 'APPROVED' || detailStockOpname?.status === 'CLOSED' ? (
                  <Grid item display={'flex'} alignItems={'center'}>
                    <ExportButton handleExport={handleExport} title='Export Stock Opname' loading={loadingExport} />
                  </Grid>
                ) : null
              }
            </Grid>
          </Grid>
        </Grid>
        <DetailStockOpname stockOpnameId={id} detailStockOpname={detailStockOpname} />
      </Grid>
    </Grid>
  )
}
