import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

import Icon from 'src/@core/components/icon'

// ** Store Imports
import { exportStockOpname, fetchDetailStockOpname } from 'src/store/apps/stock-opname'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import ExportButton from 'src/views/common/ExportButton'
import DetailStockOpname from 'src/views/stock-opname/DetailStockOpname'

// ** Design Tokens
import { colors, shadows } from 'src/configs/designTokens'

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

  const status = detailStockOpname?.status

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Detail Stock Opname'
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Inventory' },
            { label: 'Stock Opname', href: '/stock-opname' },
            { label: detailStockOpname?.code || 'Detail' }
          ]}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              {status === 'DRAFT' && (
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => router.push(`/stock-opname/${id}/edit`)}
                  startIcon={<Icon icon='tabler:edit' fontSize='1rem' />}
                  sx={{
                    color: colors.foreground,
                    borderColor: colors.border3,
                    boxShadow: shadows.xs,
                    '&:hover': { borderColor: colors.border3 }
                  }}
                >
                  Ubah
                </Button>
              )}
              {(status === 'APPROVED' || status === 'CLOSED') && (
                <ExportButton handleExport={handleExport} title='Export Stock Opname' loading={loadingExport} />
              )}
            </Box>
          }
        />
        <DetailStockOpname stockOpnameId={id} detailStockOpname={detailStockOpname} />
      </Grid>
    </Grid>
  )
}
