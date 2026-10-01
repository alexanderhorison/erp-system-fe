import React from 'react'
import { Alert, CircularProgress, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { Box } from '@mui/system'
import AppModal from 'src/views/common/AppModal'
import DetailRequestProduct from 'src/views/point-of-sale/request-product/DetailRequestProduct'
import { radii } from 'src/configs/designTokens'

export default function ModalViewRequestProduct({ open, setOpen }) {
  const {
    detailRequestOrder: data,
    errorDetailRequestOrder,
    loadingDetailRequestOrder
  } = useSelector(state => state.productRequest)

  return (
    <AppModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={event => event.preventDefault()}
      title='Detail Product Request'
      size='md'
      showActions={false}
    >
      {loadingDetailRequestOrder ? (
        <Box sx={{ py: 8, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <CircularProgress sx={{ mb: 4 }} />
          <Typography>Loading...</Typography>
        </Box>
      ) : errorDetailRequestOrder ? (
        <Alert severity='error' sx={{ borderRadius: `${radii['3xl']}px` }}>
          Request Product: {data?.code || ''} Tidak Ditemukan.
        </Alert>
      ) : (
        <DetailRequestProduct data={data} />
      )}
    </AppModal>
  )
}
