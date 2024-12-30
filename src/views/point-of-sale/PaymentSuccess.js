import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

export default function PaymentSuccess({ alreadyPayment, totalPayment, change = 0, setOpen, resetAll }) {
  const handlePrintReceipt = () => {
    console.log('Print Receipt clicked!');
  };

  const handleNewSale = () => {
    resetAll()
    setOpen(false)
  };

  return (
    alreadyPayment && (
      <Box
        sx={{
          textAlign: 'center',
          // padding: 3,
          // backgroundColor: '#f0f4ff',
          // borderRadius: 2,
          // boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          // maxWidth: 400,
          margin: '20px auto',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50', mb: 2 }}>
          Pembayaran Berhasil!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#6c757d' }}>
          Terima kasih atas pembayarannya. Anda dapat mencetak struk atau memulai transaksi baru.
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
            Total Payment:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
            Rp {totalPayment.toLocaleString('id-ID')}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333', mt: 1 }}>
            Change:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
            Rp {change.toLocaleString('id-ID')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrintReceipt}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Print Receipt
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleNewSale}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            New Sale
          </Button>
        </Stack>
      </Box>
    )
  );
};

