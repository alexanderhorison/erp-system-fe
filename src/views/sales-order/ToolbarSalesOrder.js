import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import Script from 'next/script'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Helpers & Store
import { UseAuth } from 'src/hooks/useAuth'
import { sendEmail, updateSalesOrder } from 'src/store/apps/sales-order'
import { priceFormat } from 'src/helpers/priceFormatter'
import { swalInfo, swalNotifError, swalNotifSuccess } from 'src/helpers/swalFunction'
import { pdfFormData } from 'src/helpers/generatePdfFormData'
import { printSalesOrder } from 'src/utils/printerDotMatrix'
import GeneratePdfSalesOrder from './GeneratePdfSalesOrder'

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

const ToolbarSalesOrder = ({ id, data }) => {
  const auth = UseAuth()
  const dispatch = useDispatch()
  const router = useRouter()
  const [sending, setIsSending] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const cardRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

  // Get printer status from Redux store
  const { printerStatus } = useSelector(state => state.printer)
  const handleClick = async () => {
    setIsShow(true)
  }

  const generatePdf = async cardElement => {
    if (!sending && cardElement) {
      const additionSubjectText = `Customer ${data?.customer?.name}`
      const generatePdf = await pdfFormData(cardElement, 'Sales Order', id, 'sales-order', additionSubjectText)
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

  const onUpdateSalesOrder = (code, type) => {
    dispatch(updateSalesOrder({ code, type, router }))
    setConfirmAction(null)
  }

  const handlePrint = async () => {
    printSalesOrder(dispatch, id)
  }

  const canApprove = [1, 3].includes(auth?.user?.roleId) && data?.status === 'PENDING'
  const payment = data?.status === 'APPROVED' && data?.id ? paymentTone(data) : null

  return (
    <>
      <Card elevation={0} sx={surfaceCardSx}>
        <CardContent>
          <Button
            fullWidth
            variant='contained'
            onClick={handlePrint}
            disabled={printerStatus?.printing}
            startIcon={
              printerStatus?.printing ? (
                <CircularProgress size={16} thickness={4} color='inherit' />
              ) : (
                <Icon fontSize='1.125rem' icon='tabler:printer' />
              )
            }
            sx={{ mb: 2 }}
          >
            {printerStatus?.printing ? 'Mencetak...' : 'Cetak / Print'}
          </Button>

          <DownloadButton url={'sales-order'} id={id} setIsLoading={setIsLoading} isLoading={isLoading} />

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

      <Card elevation={0} sx={{ ...surfaceCardSx, mt: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground }}>
              Informasi Tambahan
            </Typography>
            <Chip size='small' label='Important!' sx={infoChipSx(statusTokens.warning)} />
          </Box>
          <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground }}>
            Jika sales order diterima, barang akan dilakukan pengecekan stock, Jika cukup maka surat akan diterima
            dan stock di gudang akan dikurangi.
          </Typography>
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
            <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground, mb: 1 }}>
              Total yang sudah dibayar: Rp {priceFormat(data?.amountPaid)}
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground }}>
              Total yang belum dibayar: Rp {priceFormat(data?.amountDebt)}
            </Typography>
          </CardContent>
        </Card>
      )}

      {isShow && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <GeneratePdfSalesOrder id='print-sales-order' data={data} ref={cardRef} />
        </div>
      )}
      <Script src='https://cdn.jsdelivr.net/npm/qz-tray/qz-tray.js'></Script>

      <ConfirmDialog
        open={confirmAction === 'approve'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => onUpdateSalesOrder(id, 'approve')}
        title='Terima Sales Order'
        description='Sales order ini akan diterima dan stock di gudang akan dikurangi. Lanjutkan?'
        confirmLabel='Terima'
        confirmIcon='tabler:check'
        destructive={false}
      />

      <ConfirmDialog
        open={confirmAction === 'reject'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => onUpdateSalesOrder(id, 'reject')}
        title='Tolak Sales Order'
        description='Sales order ini akan ditolak. Lanjutkan?'
        confirmLabel='Tolak'
        confirmIcon='tabler:x'
        destructive
      />
    </>
  )
}

export default ToolbarSalesOrder
