import { useState } from 'react'

// ** MUI Imports
import Typography from '@mui/material/Typography'

// ** Helpers
import isNumberCustom from 'src/helpers/isNumberCustom'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'

// ** Design Tokens
import { colors, status as statusTokens } from 'src/configs/designTokens'

export default function TableDetailStockOpname({ data, status, setSelectedRows }) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  return (
    <DataTable
      itemLabel='products'
      getRowId={row => row.id}
      checkboxSelection={status === 'APPROVED'}
      getRowClassName={params => (params.row.isAdjustment ? 'stock-opname-adjustment' : '')}
      {...(status === 'APPROVED' && {
        onRowSelectionModelChange: rowSelection => setSelectedRows(rowSelection)
      })}
      columns={[
        {
          flex: 0.24,
          minWidth: 220,
          field: 'productName',
          headerName: 'Produk',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.productName} {params.row.isAdjustment ? '(Adjustment)' : ''}
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
          field: 'rack',
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
          field: 'systemStock',
          headerName: 'Stock',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.systemStock}
            </Typography>
          )
        },
        {
          flex: 0.12,
          minWidth: 120,
          sortable: false,
          field: 'actualStock',
          headerName: 'Actual Stock',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {isNumberCustom(params.row.actualStock)}
            </Typography>
          )
        },
        {
          flex: 0.09,
          minWidth: 90,
          sortable: false,
          field: 'diff',
          headerName: 'Selisih',
          renderCell: params => {
            const selisih = params.row.diff
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
        // ** Rows that produced a stock adjustment. The old `stock-opname-quantity`
        // class was never defined in any stylesheet, so these rows rendered
        // unhighlighted; the tint is defined here against the shared token.
        '& .stock-opname-adjustment': {
          backgroundColor: statusTokens.success.bg,
          '&:hover': { backgroundColor: statusTokens.success.bg }
        }
      }}
    />
  )
}
