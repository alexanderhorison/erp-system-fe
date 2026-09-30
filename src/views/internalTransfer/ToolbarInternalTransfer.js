import { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store & Hooks
import { UseAuth } from 'src/hooks/useAuth'
import { updateInternalTransfer } from 'src/store/apps/internal-transfer'

// ** Shared Components
import HeaderedCard from 'src/views/common/HeaderedCard'
import ConfirmDialog from 'src/views/common/ConfirmDialog'
import DownloadButton from 'src/views/components/buttons/ButtonDownload'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

const ToolbarInternalTransfer = ({ id, status }) => {
  const auth = UseAuth()
  const dispatch = useDispatch()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

  const { loadingUpdateInternalTransfer } = useSelector(state => state.internalTransfer)

  // ** `swalConfirmationAdd` used to prompt before sending; it no longer does
  // (see docs/REVAMP_BASELINE.md §4), so approving/rejecting is confirmed here.
  const onConfirm = () => {
    dispatch(updateInternalTransfer({ code: id, type: confirmAction, router }))
    setConfirmAction(null)
  }

  const canApprove = [1, 3].includes(auth?.user?.roleId) && status === 'PENDING'

  return (
    <>
      <HeaderedCard title='Action'>
        <DownloadButton url={'internal-transfer'} id={id} setIsLoading={setIsLoading} isLoading={isLoading} />

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
              Terima Internal Transfer
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
              Tolak Internal Transfer
            </Button>
          </Box>
        )}
      </HeaderedCard>

      <HeaderedCard
        title='Informasi Tambahan'
        action={
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
        }
        sx={{ mt: 4 }}
      >
        <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground }}>
          Jika internal transfer diterima, barang akan langsung berpindah ke rak tujuan.
        </Typography>
      </HeaderedCard>

      <ConfirmDialog
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={onConfirm}
        title={confirmAction === 'approve' ? 'Terima Internal Transfer' : 'Tolak Internal Transfer'}
        description={
          confirmAction === 'approve'
            ? `Anda akan menerima surat internal transfer ${id}. Barang akan langsung berpindah ke rak tujuan.`
            : `Anda akan menolak surat internal transfer ${id}.`
        }
        confirmLabel={confirmAction === 'approve' ? 'Terima' : 'Tolak'}
        cancelLabel='Batal'
        confirmIcon={confirmAction === 'approve' ? 'tabler:check' : 'tabler:x'}
        destructive={confirmAction === 'reject'}
        loading={loadingUpdateInternalTransfer}
        loadingLabel='Memproses...'
      />
    </>
  )
}

export default ToolbarInternalTransfer
