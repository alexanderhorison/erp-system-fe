import React from 'react'
import { Grid, Typography, Card, Alert, CircularProgress, Dialog, DialogContent } from '@mui/material'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { Box } from '@mui/system'
import { CustomCloseButton } from 'src/views/pages/dialog-examples/DialogEditUserInfo'
import Icon from 'src/@core/components/icon'
import DetailOpenBillAndTransaction from '../open-bill/DetailOpenBillAndTransaction'

export default function ModalViewTransactionV2({ open, setOpen }) {
  const { detailPointOfSale: data, errorDetailPointOfSale, loadingDetailPointOfSale } = useSelector(state => state.pos)

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        scroll='body'
        onClose={() => setOpen(false)}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' }, zoom: 1 }}
      >
        <DialogContent
          sx={{
            height: '85vh',
            overflow: 'auto'
          }}
        >
          <CustomCloseButton onClick={() => setOpen(false)}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='h4' sx={{}}>
              Detail Transaction POS
            </Typography>
          </Box>
          {loadingDetailPointOfSale ? (
            <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Loading...</Typography>
            </Box>
          ) : errorDetailPointOfSale ? (
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Alert severity='error'>
                  Point of sale: {data?.code || ''} Tidak Ditemukan. Mohon cek list point of sale:{' '}
                  <Link href='/point-of-sale'>Point of Sale</Link>
                </Alert>
              </Grid>
            </Grid>
          ) : (
            <>
              <Box sx={{ mt: 7 }}></Box>
              <DetailOpenBillAndTransaction data={data} type={'transaction'} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
