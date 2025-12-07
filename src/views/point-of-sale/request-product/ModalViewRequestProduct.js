import React from 'react'
import { Grid, Typography, Card, Alert, CircularProgress, Dialog, DialogContent } from '@mui/material'
import { useSelector } from 'react-redux'
import { Box } from '@mui/system'
import { CustomCloseButton } from 'src/views/pages/dialog-examples/DialogEditUserInfo'
import Icon from 'src/@core/components/icon'
import DetailRequestProduct from 'src/views/point-of-sale/request-product/DetailRequestProduct'

export default function ModalViewRequestProduct({ open, setOpen }) {
  const { detailRequestOrder: data, errorDetailRequestOrder, loadingDetailRequestOrder } = useSelector(
    state => state.productRequest
  )

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
              Detail Request Product
            </Typography>
          </Box>
          {loadingDetailRequestOrder ? (
            <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Loading...</Typography>
            </Box>
          ) : errorDetailRequestOrder ? (
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Alert severity='error'>
                  Request Product: {data?.code || ''} Tidak Ditemukan.
                </Alert>
              </Grid>
            </Grid>
          ) : (
            <>
              <Box sx={{ mt: 7 }}></Box>
              <DetailRequestProduct data={data} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
