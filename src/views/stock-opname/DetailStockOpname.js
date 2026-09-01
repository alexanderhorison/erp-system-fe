import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import 'react-datepicker/dist/react-datepicker.css'
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { confirmStockOpname, updateStatusStockOpname } from 'src/store/apps/stock-opname'

// ** Shared Components
import ConfirmDialog from 'src/views/common/ConfirmDialog'
import FormActionBar from 'src/views/common/FormActionBar'
import TableDetailStockOpname from './TableDetailStockOpname'
import HeaderDetailStockOpname from './HeaderDetailStockOpname'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

const surfaceCardSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

export default function DetailStockOpname({ stockOpnameId, detailStockOpname }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [selectedRows, setSelectedRows] = useState([])
  const [confirmAction, setConfirmAction] = useState(null)
  const { loadingUpdateStatus, loadingConfirm } = useSelector(state => state.stockOpname)

  const listProduct = useMemo(() => {
    if (detailStockOpname && detailStockOpname.listProduct) {
      return detailStockOpname.listProduct
    }
    return []
  }, [detailStockOpname])

  // ** `swalConfirmation*` no longer prompts (see docs/REVAMP_BASELINE.md §4),
  // so approving, rejecting and confirming are confirmed here instead.
  const onConfirm = () => {
    if (confirmAction === 'confirm') {
      dispatch(confirmStockOpname({ stockOpnameId, listProduct: selectedRows, router }))
    } else {
      dispatch(updateStatusStockOpname({ stockOpnameId, status: confirmAction, router }))
    }
    setConfirmAction(null)
  }

  const status = detailStockOpname?.status
  const canDecide = status === 'DRAFT' || status === 'PENDING'

  const confirmCopy = {
    approve: {
      title: 'Setujui Stock Opname',
      description: `Anda akan menyetujui stock opname ${detailStockOpname?.code || ''}.`,
      confirmLabel: 'Setujui',
      loadingLabel: 'Menyetujui...',
      confirmIcon: 'tabler:check',
      destructive: false
    },
    reject: {
      title: 'Tolak Stock Opname',
      description: `Anda akan menolak stock opname ${detailStockOpname?.code || ''}.`,
      confirmLabel: 'Tolak',
      loadingLabel: 'Menolak...',
      confirmIcon: 'tabler:ban',
      destructive: true
    },
    confirm: {
      title: 'Konfirmasi Penyesuaian Stok',
      description: `Anda akan melakukan penyesuaian untuk ${selectedRows.length} produk terpilih. Stok gudang akan berubah.`,
      confirmLabel: 'Konfirmasi',
      loadingLabel: 'Memproses...',
      confirmIcon: 'tabler:discount-check',
      destructive: false
    }
  }

  return (
    <Grid container>
      {/* Left column: the opname record. Right column: its note. */}
      <Grid item xs={12} lg={8.5} sx={{ pr: { lg: 4 } }}>
        <Grid container spacing={4}>
          <HeaderDetailStockOpname
            warehouseName={detailStockOpname?.warehouseName}
            createdAt={detailStockOpname?.createdAt}
            code={detailStockOpname?.code}
            status={detailStockOpname?.status}
            creatorName={detailStockOpname?.creatorName}
            updaterName={detailStockOpname?.updaterName}
            id={detailStockOpname?.id}
            type={'DETAIL'}
          />

          {status === 'APPROVED' && (
            <Grid item xs={12}>
              <Alert severity='info' sx={{ borderRadius: `${radii.lg}px` }}>
                Status telah disetujui. Anda dapat melakukan adjustment dengan mencentang opsi di bawah ini.
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <TableDetailStockOpname
              data={listProduct}
              status={detailStockOpname?.status}
              setSelectedRows={setSelectedRows}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} lg={3.5} sx={{ mt: { xs: 4, lg: 0 } }}>
        <Card elevation={0} sx={surfaceCardSx}>
          <CardContent>
            <Typography
              sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground, mb: 2 }}
            >
              Catatan
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', lineHeight: '20px', color: colors.mutedForeground }}>
              {detailStockOpname?.notes || '-'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Action footer, sharing the add form's pinned bar. `PageHeader` already
          provides the way back, so this bar carries only the decisions — and is
          omitted entirely once there are none left to make. */}
      {(canDecide || status === 'APPROVED') && (
        <Grid item xs={12}>
          <FormActionBar
            showCancel={false}
            onSubmit={() => setConfirmAction(status === 'APPROVED' ? 'confirm' : 'approve')}
            loading={status === 'APPROVED' ? loadingConfirm : loadingUpdateStatus}
            disabled={status === 'APPROVED' && selectedRows.length === 0}
            submitLabel={status === 'APPROVED' ? 'Konfirmasi' : 'Setujui'}
            submitIcon={status === 'APPROVED' ? 'tabler:discount-check' : 'tabler:check'}
            loadingLabel={status === 'APPROVED' ? 'Memproses...' : 'Menyimpan...'}
          >
            {canDecide && (
              <Button
                variant='outlined'
                onClick={() => setConfirmAction('reject')}
                disabled={loadingUpdateStatus}
                startIcon={<Icon icon='tabler:ban' fontSize='1rem' />}
                sx={{
                  color: colors.destructive,
                  borderColor: colors.destructive,
                  boxShadow: shadows.xs,
                  '&:hover': { borderColor: colors.destructive, backgroundColor: statusTokens.danger.bg }
                }}
              >
                Tolak
              </Button>
            )}
          </FormActionBar>
        </Grid>
      )}

      <ConfirmDialog
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={onConfirm}
        title={confirmCopy[confirmAction]?.title}
        description={confirmCopy[confirmAction]?.description}
        confirmLabel={confirmCopy[confirmAction]?.confirmLabel}
        confirmIcon={confirmCopy[confirmAction]?.confirmIcon}
        destructive={confirmCopy[confirmAction]?.destructive ?? true}
        loading={confirmAction === 'confirm' ? loadingConfirm : loadingUpdateStatus}
        loadingLabel={confirmCopy[confirmAction]?.loadingLabel}
      />
    </Grid>
  )
}
