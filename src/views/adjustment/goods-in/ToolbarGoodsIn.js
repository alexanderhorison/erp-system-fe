import { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store & Hooks
import { UseAuth } from 'src/hooks/useAuth'
import { updateAdjustmentGoodsIn } from 'src/store/apps/adjustment/goods-in'

// ** Shared Components
import ConfirmDialog from 'src/views/common/ConfirmDialog'
import DownloadButton from 'src/views/components/buttons/ButtonDownload'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

const surfaceCardSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

const ToolbarGoodsIn = ({ id, status }) => {
  const auth = UseAuth()
  const dispatch = useDispatch()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

  const { loadingUpdateAdjustmentGoodsIn } = useSelector(state => state.adjustmentGoodsIn)

  // ** `swalConfirmationAdd` used to prompt before sending; it no longer does
  // (see docs/REVAMP_BASELINE.md §4), so approving/rejecting is confirmed here.
  const onConfirm = () => {
    dispatch(updateAdjustmentGoodsIn({ code: id, type: confirmAction, router }))
    setConfirmAction(null)
  }

  const canApprove = [1, 3].includes(auth?.user?.roleId) && status === 'PENDING'

  return (
    <>
      <Card elevation={0} sx={surfaceCardSx}>
        <CardContent>
          <DownloadButton url={'adjustment-goods-in'} id={id} setIsLoading={setIsLoading} isLoading={isLoading} />

          {canApprove && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
              <Button
                fullWidth
                variant='contained'
                onClick={() => setConfirmAction('approve')}
                startIcon={<Icon icon='tabler:check' fontSize='1rem' />}
                sx={{
                  backgroundColor: statusTokens.success.fg,
                  '&:hover': { backgroundColor: statusTokens.success.fg, filter: 'brightness(0.92)' }
                }}
              >
                Terima Barang Masuk
              </Button>
              <Button
                fullWidth
                variant='outlined'
                onClick={() => setConfirmAction('reject')}
                startIcon={<Icon icon='tabler:x' fontSize='1rem' />}
                sx={{
                  color: colors.destructive,
                  borderColor: colors.destructive,
                  boxShadow: shadows.xs,
                  '&:hover': { borderColor: colors.destructive, backgroundColor: statusTokens.danger.bg }
                }}
              >
                Tolak Barang Masuk
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ ...surfaceCardSx, mt: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground }}>
              Informasi Tambahan
            </Typography>
            <Chip
              size='small'
              label='Important!'
              sx={{
                height: 20,
                borderRadius: `${radii.full}px`,
                backgroundColor: statusTokens.warning.bg,
                border: `1px solid ${statusTokens.warning.border}`,
                '& .MuiChip-label': {
                  px: 1.5,
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  lineHeight: '16px',
                  color: statusTokens.warning.fg
                }
              }}
            />
          </Box>
          <Box component='ol' sx={{ m: 0, pl: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography
              component='li'
              sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground }}
            >
              Jika barang sudah ada di gudang, maka barang akan masuk ke rak yg sama.
            </Typography>
            <Typography
              component='li'
              sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground }}
            >
              Jika barang tidak ada di gudang, maka barang akan masuk ke rak default.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={onConfirm}
        title={confirmAction === 'approve' ? 'Terima Barang Masuk' : 'Tolak Barang Masuk'}
        description={
          confirmAction === 'approve'
            ? `Anda akan menerima surat barang masuk ${id}. Stok gudang akan bertambah.`
            : `Anda akan menolak surat barang masuk ${id}.`
        }
        confirmLabel={confirmAction === 'approve' ? 'Terima' : 'Tolak'}
        cancelLabel='Batal'
        confirmIcon={confirmAction === 'approve' ? 'tabler:check' : 'tabler:x'}
        destructive={confirmAction === 'reject'}
        loading={loadingUpdateAdjustmentGoodsIn}
        loadingLabel='Memproses...'
      />
    </>
  )
}

export default ToolbarGoodsIn
