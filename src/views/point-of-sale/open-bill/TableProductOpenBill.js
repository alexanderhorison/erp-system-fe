import { Box, Typography } from '@mui/material'

import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

export default function TablePorductOpenBill({ data = [] }) {
  return (
    <DataTable
      getRowHeight={() => 'auto'}
      columns={[
        {
          flex: 0.4,
          minWidth: 200,
          field: 'productName',
          headerName: 'Nama Produk',
          valueGetter: params => params?.row?.productName || params?.row?.title || '',
          renderCell: params => {
            const productName = params?.row?.productName || params?.row?.title
            const notes = params?.row?.notes

            return (
              <Box sx={{ py: 2, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.3 }}>
                <Typography variant='body2' sx={{ fontWeight: 500, color: colors.foreground }}>
                  {productName}
                </Typography>
                {notes && (
                  <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>Notes: {notes}</Typography>
                )}
              </Box>
            )
          }
        },
        {
          flex: 0.15,
          minWidth: 100,
          field: 'quantity',
          headerName: 'Kuantiti',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: colors.foreground }}>
              {params?.row?.quantity}
            </Typography>
          )
        },
        {
          flex: 0.22,
          minWidth: 130,
          field: 'price',
          headerName: 'Price',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: colors.foreground }}>
              {priceFormatWIthCurrency(params.row.price)}
            </Typography>
          )
        },
        {
          flex: 0.23,
          minWidth: 130,
          field: 'subTotal',
          headerName: 'Total',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: colors.foreground }}>
              {priceFormatWIthCurrency(params.row.subTotal || 0)}
            </Typography>
          )
        }
      ]}
      rows={data}
    />
  )
}
