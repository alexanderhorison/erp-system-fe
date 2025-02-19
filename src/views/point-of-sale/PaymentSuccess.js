import React from 'react'
import { Box, Typography, Button, Stack } from '@mui/material'
import { printItem, printPointOfSale } from 'src/utils/printerHelper'
import { useDispatch } from 'react-redux'

export default function PaymentSuccess({
  alreadyPayment,
  totalPayment,
  change = 0,
  setOpen,
  resetAll,
  totalAmount,
  dataPayment
}) {
  const dispatch = useDispatch()
  const handlePrintReceipt = () => {
    printPointOfSale(dispatch, dataPayment.code)
  }

  const handleNewSale = () => {
    resetAll()
    setOpen(false)
  }

  return (
    alreadyPayment && (
      <Box
        sx={{
          textAlign: 'center',
          margin: '20px auto'
        }}
      >
        <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#4caf50', mb: 2 }}>
          Pembayaran Berhasil!
        </Typography>
        <Typography variant='body1' sx={{ mb: 4, color: '#6c757d' }}>
          Terima kasih atas pembayarannya. Anda dapat mencetak struk atau memulai transaksi baru.
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Typography variant='body2' sx={{ fontWeight: 'bold', color: '#333' }}>
            Total Payment:
          </Typography>
          <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#4caf50' }}>
            Rp {totalAmount.toLocaleString('id-ID')}
          </Typography>
          <Typography variant='body2' sx={{ fontWeight: 'bold', color: '#333' }}>
            Paid:
          </Typography>
          <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#4caf50' }}>
            Rp {totalPayment.toLocaleString('id-ID')}
          </Typography>
          <Typography variant='body2' sx={{ fontWeight: 'bold', color: '#333', mt: 1 }}>
            {change > 0 ? `Change:` : 'Hutang: '}
          </Typography>
          <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#4caf50' }}>
            Rp {Math.abs(change || 0).toLocaleString('id-ID')}
          </Typography>
        </Box>
        <Stack direction='row' spacing={2} justifyContent='center'>
          <Button
            variant='contained'
            color='primary'
            onClick={handlePrintReceipt}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Print Receipt
          </Button>
          <Button
            variant='outlined'
            color='primary'
            onClick={handleNewSale}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            New Sale
          </Button>
        </Stack>
      </Box>
    )
  )
}
