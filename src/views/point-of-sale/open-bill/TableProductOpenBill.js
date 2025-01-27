import { Box, Typography } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

export default function TablePorductOpenBill({ data }) {
  return (
    <Box height={data.length >= 4 ? '300px' : `${100 + (data.length * 30)}px`}>
      <DataGrid
        autoHeight={false}
        sx={{ maxHeight: 'auto', overflow: 'auto' }}
        scrollbarSize={5}
        stickyHeader
        getRowHeight={params => {
          const productName = params?.model?.productName || params?.model?.title || '';
          const notes = params?.model?.notes || '';
          const totalText = `${productName} ${notes}`;
          // Hitung jumlah baris berdasarkan panjang teks
          const estimatedLines = Math.ceil(totalText.length / 40); // Perkiraan 40 karakter per baris
          const baseHeight = 40; // Tinggi default jika teks pendek
          const lineHeight = 30; // Perkiraan tinggi tiap baris teks
          return Math.max(baseHeight, estimatedLines * lineHeight); // Pilih tinggi terbesar
        }}
        columns={[
          {
            flex: 0.15,
            minWidth: 100,
            field: 'id',
            headerName: 'Product Name',
            cellClassName: 'wrap-text',
            renderCell: params => {
              const productName = params?.row?.productName || params?.row?.title;
              const notes = params?.row?.notes;
              return (
                <div style={{ cursor: 'pointer', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  <Typography variant='body2' sx={{ color: 'text.primary', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {productName}
                  </Typography>
                  {notes && (
                    <Typography variant='caption' sx={{ color: 'text.secondary', whiteSpace: 'normal', wordBreak: 'break-word', display: 'block' }}>
                      Notes: {notes}
                    </Typography>
                  )}
                </div>
              );
            }
          },
          {
            flex: 0.07,
            minWidth: 120,
            field: 'createdAt',
            headerName: 'Quantity',
            renderCell: params => {
              return (
                <Typography style={{ cursor: 'pointer' }} variant='body2' sx={{ color: 'text.primary' }}>
                  {params?.row?.quantity}
                </Typography>
              )
            }
          },
          {
            flex: 0.16,
            minWidth: 120,
            field: 'creator',
            headerName: 'Price',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                      {priceFormatWIthCurrency(params.row.price)}
                    </Typography>
                  </Box>
                </Box>
              )
            }
          },
          {
            flex: 0.16,
            minWidth: 120,
            field: 'grandTotal',
            headerName: 'Total Pembelian',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {priceFormatWIthCurrency(params.row.subTotal || 0)}
                </Typography>
              )
            }
          },
        ]}
        rows={data}
        disableColumnFilter
        hideFooter
      />
    </Box>
  )
}