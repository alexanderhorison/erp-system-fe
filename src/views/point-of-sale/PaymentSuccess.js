import React, { useState } from 'react'
import { Box, Typography, Button, Stack } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import ModalSendEmailCustomer from './ModalSendEmailCustomer'
import PrintConfirmDialog from './PrintConfirmDialog'
import { printPos } from 'src/store/apps/pos'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens, stone } from 'src/configs/designTokens'

export default function PaymentSuccess({
  alreadyPayment,
  totalPayment,
  change = 0,
  setOpen,
  resetAll,
  totalAmount,
  dataPayment,
  customer
}) {
  const dispatch = useDispatch()
  // Which print was asked for, while the cashier answers the confirmation
  const [printMode, setPrintMode] = useState(null)

  const handlePrintReceipt = () => {
    dispatch(printPos({ code: dataPayment.code, skipPrompt: true }))
  }

  const handlePrintReceipt2x = async () => {
    try {
      const result1 = await dispatch(printPos({ code: dataPayment.code, skipPrompt: true })).unwrap()
      if (result1 && !result1.cancelled) {
        // Jika pertama berhasil, print kedua dengan flag isCopy
        await dispatch(printPos({ code: dataPayment.code, isCopy: true, skipPrompt: true })).unwrap()
      }
    } catch (error) {
      console.error('Error printing 2x:', error)
    }
  }

  const handleConfirmPrint = () => {
    const mode = printMode
    setPrintMode(null)
    if (mode === 'double') handlePrintReceipt2x()
    else handlePrintReceipt()
  }

  const [openModalEmail, setOpenModalEmail] = useState(false)

  const handleEmailReceipt = () => {
    setOpenModalEmail(true)
  }

  const handleNewSale = () => {
    resetAll()
    setOpen(false)
  }

  const stats = [
    { label: 'Total Payment', icon: 'tabler:wallet', value: Number(totalAmount || 0).toLocaleString('id-ID') },
    { label: 'Paid', icon: 'tabler:receipt', value: Number(totalPayment || 0).toLocaleString('id-ID') },
    {
      label: change >= 0 ? 'Change' : 'Hutang',
      icon: 'tabler:coin',
      value: Math.abs(change || 0).toLocaleString('id-ID')
    }
  ]

  const pillButtonSx = { height: 36, whiteSpace: 'nowrap' }

  return (
    <>
      {alreadyPayment && (
        <Box sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            <Box
              sx={{
                mt: 1,
                width: 32,
                height: 32,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                color: statusTokens.success.fg,
                border: `1px solid ${statusTokens.success.border}`,
                backgroundColor: statusTokens.success.bg
              }}
            >
              <Icon icon='tabler:check' fontSize='1.125rem' />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: '28px', color: colors.foreground }}>
                Pembayaran Berhasil
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>
                Terima kasih atas pembayarannya. Anda dapat mencetak struk atau memulai transaksi baru.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 5,
              p: 4,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
              gap: 4,
              borderRadius: `${radii['3xl']}px`,
              border: `1px solid ${colors.border3}`,
              backgroundColor: stone[100]
            }}
          >
            {stats.map(stat => (
              <Box key={stat.label} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    color: colors.mutedForeground,
                    backgroundColor: stone[200]
                  }}
                >
                  <Icon icon={stat.icon} fontSize='1rem' />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>{stat.label}</Typography>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 500, color: colors.foreground }}>
                    Rp {stat.value}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Stack direction='row' flexWrap='wrap' justifyContent='center' gap={3} sx={{ mt: 5 }}>
            <Button
              variant='contained'
              onClick={() => setPrintMode('double')}
              startIcon={<Icon icon='tabler:printer' fontSize='1rem' />}
              sx={pillButtonSx}
            >
              Print 2x Receipt
            </Button>
            <Button
              variant='contained'
              onClick={() => setPrintMode('single')}
              startIcon={<Icon icon='tabler:printer' fontSize='1rem' />}
              sx={pillButtonSx}
            >
              Print Receipt
            </Button>
            <Button
              variant='contained'
              onClick={handleEmailReceipt}
              startIcon={<Icon icon='tabler:mail' fontSize='1rem' />}
              sx={pillButtonSx}
            >
              Email Receipt
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={handleNewSale}
              startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              sx={{ ...pillButtonSx, color: colors.foreground, borderColor: colors.border3, boxShadow: shadows.xs }}
            >
              New Sale
            </Button>
          </Stack>
        </Box>
      )}
      <PrintConfirmDialog open={Boolean(printMode)} onClose={() => setPrintMode(null)} onConfirm={handleConfirmPrint} />
      {openModalEmail && (
        <ModalSendEmailCustomer
          open={openModalEmail}
          setOpen={setOpenModalEmail}
          customer={customer}
          code={dataPayment.code}
        />
      )}
    </>
  )
}
