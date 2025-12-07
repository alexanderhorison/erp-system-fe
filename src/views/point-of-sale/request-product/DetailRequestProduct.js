import {
  Divider,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import { Box } from '@mui/system'
import { useMemo } from 'react'
import { Status } from 'src/@core/components/common'
import { returnFormatDate, returnFormatTime } from 'src/helpers/formatDate'

export default function DetailRequestProduct({ data }) {
  const mappedData = useMemo(() => {
    return {
      code: data?.code,
      dateCreated: data?.dateCreated,
      createdAt: data?.createdAt,
      createdBy: data?.createdBy,
      status: data?.status,
      notes: data?.notes,
      listProducts: data?.listProducts || []
    }
  }, [data])

  return (
    <>
      <Box sx={{ height: '90%', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h4'>Request Product Details</Typography>
        </Box>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* Code with Date */}
          <Grid item xs={12} sm={4}>
            <Typography variant='subtitle' fontWeight='bold'>
              Product Request Code
            </Typography>
            <Typography variant='body1'>{mappedData?.code}</Typography>
            <Typography variant='body2'>
              {returnFormatDate(mappedData?.createdAt)} - {returnFormatTime(mappedData?.createdAt)}
            </Typography>
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={4}>
            <Typography variant='subtitle' fontWeight='bold'>
              Status
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Status status={mappedData?.status} />
            </Box>
          </Grid>

          {/* Created By */}
          <Grid item xs={12} sm={4}>
            <Typography variant='subtitle' fontWeight='bold'>
              Dibuat Oleh
            </Typography>
            <Typography variant='body1'>{mappedData?.createdBy?.name}</Typography>
            <Typography variant='body2' color='text.secondary'>
              {mappedData?.createdBy?.role}
            </Typography>
          </Grid>

          {/* Approved By
          <Grid item xs={12} sm={3}>
            <Typography variant='subtitle' fontWeight='bold'>
              Diproses Oleh
            </Typography>
            <Typography variant='body1'>{mappedData?.approvedBy?.name || '-'}</Typography>
            <Typography variant='body2' color='text.secondary'>
              {mappedData?.approvedBy?.role || '-'}
            </Typography>
          </Grid> */}

          {/* Notes */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Typography variant='subtitle' fontWeight='bold'>
              Catatan
            </Typography>
            <Typography variant='body1'>{mappedData?.notes || '-'}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Products Table */}
        <Box sx={{ mt: 4 }}>
          <Typography variant='h4' sx={{ mb: 3 }}>
            Products
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nama Produk</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Satuan</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Kuantitas Request</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mappedData?.listProducts?.length > 0 ? (
                  mappedData.listProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.unitName}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{product.quantityRequested}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align='center'>
                      Tidak ada produk
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  )
}
