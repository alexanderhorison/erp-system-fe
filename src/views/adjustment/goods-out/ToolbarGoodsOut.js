import { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store & Hooks
import { UseAuth } from 'src/hooks/useAuth'
import { updateAdjustmentGoodsOut } from 'src/store/apps/adjustment/goods-out'

// ** Shared Components
import ConfirmDialog from 'src/views/common/ConfirmDialog'
import DownloadButton from 'src/views/components/buttons/ButtonDownload'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

const ToolbarGoodsOut = ({ id, status }) => {
  const auth = UseAuth()
  const dispatch = useDispatch()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

  const { loadingUpdateAdjustmentGoodsOut } = useSelector(state => state.adjustmentGoodsOut)

  // ** `swalConfirmationAdd` used to prompt before sending; it no longer does
  // (see docs/REVAMP_BASELINE.md §4), so approving/rejecting is confirmed here.
  const onConfirm = () => {
    dispatch(updateAdjustmentGoodsOut({ code: id, type: confirmAction, router }))
    setConfirmAction(null)
  }

  const canApprove = [1, 3].includes(auth?.user?.roleId) && status === 'PENDING'

  return (
    <>
      <Card
        elevation={0}
        sx={{ borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}
      >
        <CardContent>
          <DownloadButton url={'adjustment-goods-out'} id={id} setIsLoading={setIsLoading} isLoading={isLoading} />

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
                Terima Barang Keluar
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
                Tolak Barang Keluar
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={onConfirm}
        title={confirmAction === 'approve' ? 'Terima Barang Keluar' : 'Tolak Barang Keluar'}
        description={
          confirmAction === 'approve'
            ? `Anda akan menerima surat barang keluar ${id}. Stok gudang akan berkurang.`
            : `Anda akan menolak surat barang keluar ${id}.`
        }
        confirmLabel={confirmAction === 'approve' ? 'Terima' : 'Tolak'}
        cancelLabel='Batal'
        confirmIcon={confirmAction === 'approve' ? 'tabler:check' : 'tabler:x'}
        destructive={confirmAction === 'reject'}
        loading={loadingUpdateAdjustmentGoodsOut}
        loadingLabel='Memproses...'
      />
    </>
  )
}

export default ToolbarGoodsOut
