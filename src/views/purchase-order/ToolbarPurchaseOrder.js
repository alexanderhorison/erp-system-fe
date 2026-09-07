import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Helpers & Store
import { UseAuth } from 'src/hooks/useAuth'
import { updatePurchaseOrder } from 'src/store/apps/purchase-order'
import { sendEmail } from 'src/store/apps/sales-order'
import { priceFormat } from 'src/helpers/priceFormatter'
import { swalInfo, swalNotifError, swalNotifSuccess } from 'src/helpers/swalFunction'
import { pdfFormData } from 'src/helpers/generatePdfFormData'
import GeneratePdfPurchaseOrder from './GeneratePdfPurchaseOrder'

// ** Shared Components
import ConfirmDialog from 'src/views/common/ConfirmDialog'
import DownloadButton from 'src/views/components/buttons/ButtonDownload'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

const surfaceCardSx = {
  borderRadius: `${radii['3xl']}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

const infoChipSx = tone => ({
  height: 20,
  borderRadius: `${radii.full}px`,
  backgroundColor: tone.bg,
  border: `1px solid ${tone.border}`,
  '& .MuiChip-label': {
    px: 1.5,
    fontSize: '0.6875rem',
    fontWeight: 600,
    lineHeight: '16px',
    color: tone.fg
  }
})

const paymentTone = data => {
  if (data?.amountDebt == 0) return { label: 'LUNAS', tone: statusTokens.success }
  if (data?.grandTotal === data?.amountDebt) return { label: 'BELUM LUNAS', tone: statusTokens.danger }
  return { label: 'SEBAGIAN LUNAS', tone: statusTokens.warning }
}

const ToolbarPurchaseOrder = ({ id, data }) => {
  const auth = UseAuth()
  const dispatch = useDispatch()
  const router = useRouter()
  const [sending, setIsSending] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const cardRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

  const handleClick = () => {
    setIsShow(true)
  }

  const generatePdf = async cardElement => {
    if (!sending && cardElement) {
      const additionSubjectText = `Vendor ${data?.vendor?.name}`
      const generatePdf = await pdfFormData(cardElement, 'Purchase Order', id, 'purchase-order', additionSubjectText)
      dispatch(sendEmail(generatePdf))
      setIsSending(true)
    }
    setIsShow(false) // Hide the component after capture
    if (sending) {
      swalInfo() // info that email has been sent
    }
  }

  useEffect(() => {
    if (isShow) {
      const timer = setTimeout(() => {
        if (cardRef.current) {
          swalNotifSuccess({ message: 'Generating PDF...' })
          generatePdf(cardRef.current)
        } else {
          swalNotifError({ message: 'Gagal generate pdf' })
        }
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [isShow])

  const onUpdatePurchaseOrder = (code, type) => {
    dispatch(updatePurchaseOrder({ code, type, router }))
    setConfirmAction(null)
  }

  const canApprove = [1, 3].includes(auth?.user?.roleId) && data?.status === 'PENDING'
  const payment = data?.status === 'APPROVED' && data?.id ? paymentTone(data) : null
  const paidPercent = data?.grandTotal
    ? Math.min(100, Math.round(((data.amountPaid || 0) / data.grandTotal) * 100))
    : 0

  return (
    <>
      <Card elevation={0} sx={surfaceCardSx}>
        <CardContent>
          <DownloadButton url={'purchase-order'} id={id} setIsLoading={setIsLoading} isLoading={isLoading} />

          <Button
            fullWidth
            variant='contained'
            onClick={handleClick}
            startIcon={<Icon fontSize='1.125rem' icon='tabler:mail' />}
            sx={{ mb: 2 }}
          >
            Kirim Email
          </Button>

          {canApprove && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Button
                fullWidth
                variant='contained'
                color='error'
                onClick={() => setConfirmAction('reject')}
                startIcon={<Icon fontSize='1.125rem' icon='tabler:x' />}
              >
                Tolak
              </Button>
              <Button
                fullWidth
                variant='contained'
                color='success'
                onClick={() => setConfirmAction('approve')}
                startIcon={<Icon fontSize='1.125rem' icon='tabler:check' />}
              >
                Terima
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {payment && (
        <Card elevation={0} sx={{ ...surfaceCardSx, mt: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
              <Typography
                sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground }}
              >
                Status Pembayaran
              </Typography>
              <Chip size='small' label={payment.label} sx={infoChipSx(payment.tone)} />
            </Box>

            <LinearProgress
              variant='determinate'
              value={paidPercent}
              sx={{
                height: 6,
                borderRadius: `${radii.full}px`,
                backgroundColor: colors.border,
                mb: 1,
                '& .MuiLinearProgress-bar': { borderRadius: `${radii.full}px`, backgroundColor: statusTokens.success.fg }
              }}
            />
            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground, mb: 3 }}>
              {paidPercent}% dari Rp {priceFormat(data?.grandTotal)}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>Total sudah bayar</Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.foreground }}>
                Rp {priceFormat(data?.amountPaid)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>Total belum bayar</Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: statusTokens.danger.fg }}>
                Rp {priceFormat(data?.amountDebt)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card elevation={0} sx={{ ...surfaceCardSx, mt: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground }}>
              Informasi Tambahan
            </Typography>
            <Chip size='small' label='Important!' sx={infoChipSx(statusTokens.warning)} />
          </Box>
          <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground }}>
            Jika purchase order diterima, maka barang akan langsung masuk ke gudang. Jika barang tidak ada, maka
            barang akan di inisialisasi.
          </Typography>
        </CardContent>
      </Card>

      {isShow && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <GeneratePdfPurchaseOrder id='print-purchase-order' data={data} ref={cardRef} />
        </div>
      )}

      <ConfirmDialog
        open={confirmAction === 'approve'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => onUpdatePurchaseOrder(id, 'approve')}
        title='Terima Purchase Order'
        description='Purchase order ini akan diterima dan barang akan langsung masuk ke gudang. Lanjutkan?'
        confirmLabel='Terima'
        confirmIcon='tabler:check'
        destructive={false}
      />

      <ConfirmDialog
        open={confirmAction === 'reject'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => onUpdatePurchaseOrder(id, 'reject')}
        title='Tolak Purchase Order'
        description='Purchase order ini akan ditolak. Lanjutkan?'
        confirmLabel='Tolak'
        confirmIcon='tabler:x'
        destructive
      />
    </>
  )
}

export default ToolbarPurchaseOrder
