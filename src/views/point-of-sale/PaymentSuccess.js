import React, { useState } from 'react'
import { Box, Typography, Button, Stack, Avatar } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import ModalSendEmailCustomer from './ModalSendEmailCustomer'
import { printPos } from 'src/store/apps/pos'

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
  const handlePrintReceipt = () => {
    dispatch(printPos(dataPayment.code))
  }

  const [openModalEmail, setOpenModalEmail] = useState(false)

  const handleEmailReceipt = () => {
    setOpenModalEmail(true)
  }

  const handleNewSale = () => {
    resetAll()
    setOpen(false)
  }

  return (
    <>
      {alreadyPayment && (
        <Box sx={{ textAlign: 'center', margin: '18px auto', maxWidth: 760 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: '#e8f0ff',
                width: 88,
                height: 88,
                boxShadow: '0 8px 18px rgba(13,71,161,0.12)'
              }}
            >
              <Icon icon='tabler:circle-check' fontSize='2.75rem' />
            </Avatar>
          </Box>

          <Typography variant='h4' sx={{ fontWeight: 800, color: '#111', mb: 1 }}>
            Pembayaran Berhasil!
          </Typography>
          <Typography variant='body1' sx={{ mb: 4, color: '#6c757d', fontSize: 16 }}>
            Terima kasih atas pembayarannya. Anda dapat mencetak struk atau memulai transaksi baru.
          </Typography>

          <Stack direction='row' spacing={4} justifyContent='center' sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#e6f7ef', width: 44, height: 44, mr: 2 }}>
                <Icon icon='tabler:wallet' fontSize='1.1rem' />
              </Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant='body2' sx={{ color: '#6c757d' }}>
                  Total Payment:
                </Typography>
                <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mt: 0.3 }}>
                  Rp {totalAmount.toLocaleString('id-ID')}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#e6f7ef', width: 44, height: 44, mr: 2 }}>
                <Icon icon='tabler:coin' fontSize='1.1rem' />
              </Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant='body2' sx={{ color: '#6c757d' }}>
                  Paid:
                </Typography>
                <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mt: 0.3 }}>
                  Rp {totalPayment.toLocaleString('id-ID')}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#fff3e0', width: 44, height: 44, mr: 2 }}>
                <Icon icon='tabler:arrows-exchange' fontSize='1.1rem' />
              </Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant='body2' sx={{ color: '#6c757d' }}>
                  {change >= 0 ? `Change:` : 'Hutang:'}
                </Typography>
                <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mt: 0.3 }}>
                  Rp {Math.abs(change || 0).toLocaleString('id-ID')}
                </Typography>
              </Box>
            </Box>
          </Stack>

          {/* Removed full-width CTA per design update */}

          <Stack direction='row' spacing={2} justifyContent='center'>
            <Button
              variant='contained'
              color='primary'
              onClick={handlePrintReceipt}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            >
              Print Receipt
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={handleEmailReceipt}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            >
              Email Receipt
            </Button>
            <Button
              variant='outlined'
              color='primary'
              onClick={handleNewSale}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            >
              New Sale
            </Button>
          </Stack>
        </Box>
      )}
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
