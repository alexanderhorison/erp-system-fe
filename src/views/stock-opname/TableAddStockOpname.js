import { useState } from 'react'

// ** MUI Imports
import Typography from '@mui/material/Typography'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

export default function TableAddStockOpname({ data, handleChange, type = 'add', loading }) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  return (
    <DataTable
      itemLabel='products'
      loading={loading}
      getRowId={row => row.productWarehouseId}
      columns={[
        {
          flex: 0.24,
          minWidth: 220,
          field: 'productName',
          headerName: 'Produk',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.productName}
            </Typography>
          )
        },
        {
          flex: 0.1,
          minWidth: 100,
          field: 'unitName',
          headerName: 'Unit',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.unitName}
            </Typography>
          )
        },
        {
          flex: 0.13,
          minWidth: 130,
          field: 'companyName',
          headerName: 'Perusahaan',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.companyName}
            </Typography>
          )
        },
        {
          flex: 0.1,
          minWidth: 100,
          field: 'rackName',
          headerName: 'Rak',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.rackName || '-'}
            </Typography>
          )
        },
        {
          flex: 0.09,
          minWidth: 90,
          field: 'quantity',
          headerName: 'Stock',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {type === 'add' ? params.row.quantity : params.row.systemStock}
            </Typography>
          )
        },
        {
          flex: 0.14,
          minWidth: 140,
          sortable: false,
          field: 'actualStock',
          headerName: 'Actual Stock',
          renderCell: params => (
            <CustomTextField
              fullWidth
              size='small'
              value={params.row.actualStock ?? ''}
              onChange={e => {
                handleChange(`${e?.target?.value}`, params.row.productWarehouseId)
              }}
              type='number'
              inputProps={{ min: 0 }}
              sx={{ display: 'block' }}
            />
          )
        },
        {
          flex: 0.09,
          minWidth: 90,
          sortable: false,
          field: 'actions',
          headerName: 'Selisih',
          renderCell: params => {
            const stock = type === 'add' ? params.row.quantity : params.row.systemStock
            const actualStock = params.row.actualStock
            let selisih = stock - actualStock
            if (actualStock === null || actualStock === '') {
              selisih = '-'
            }
            return (
              <Typography variant='body2' sx={{ color: colors.mutedForeground }}>
                {Math.abs(selisih) || '-'}
              </Typography>
            )
          }
        }
      ]}
      pageSizeOptions={[25, 50, 100]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      rows={data || []}
      sx={{
        '& .MuiDataGrid-overlayWrapper': {
          zIndex: 0
        }
      }}
    />
  )
}
