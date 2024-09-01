import { Card, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useState } from 'react'
import isNumberCustom from 'src/helpers/isNumberCustom';

export default function TableDetailStockOpname({ data, status, setSelectedRows }) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

  return (
    <Card>
      <DataGrid
        autoHeight
        getRowId={(row) => row.id}
        checkboxSelection={status === 'APPROVED'}
        getRowClassName={params => getRowClassName(params)}
        {...(status === 'APPROVED' && { onRowSelectionModelChange: (rowSelection) => setSelectedRows(rowSelection) })}
        columns={[
          {
            flex: 0.2,
            minWidth: 200,
            field: 'productName',
            headerName: 'Produk',
            renderCell: (params) => (
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {params.row.productName} {params.row.isAdjustment ? '(Adjustment)' : ''}
              </Typography>
            ),
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'unitName',
            headerName: 'Unit',
            renderCell: (params) => (
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {params.row.unitName}
              </Typography>
            ),
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'companyName',
            headerName: 'Company',
            renderCell: (params) => (
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {params.row.companyName}
              </Typography>
            ),
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'rack',
            headerName: 'Rak',
            renderCell: (params) => (
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {params.row.rackName || "-"}
              </Typography>
            ),
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'systemStock',
            headerName: 'Stock',
            renderCell: (params) => (
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {params.row.systemStock}
              </Typography>
            ),
          },
          {
            flex: 0.1,
            minWidth: 120,
            sortable: false,
            field: 'actualStock',
            headerName: 'Actual Stock',
            renderCell: (params) => (
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {isNumberCustom(params.row.actualStock)}
              </Typography>
            ),
          },
          {
            flex: 0.1,
            minWidth: 120,
            sortable: false,
            field: 'diff',
            headerName: 'Selisih',
            renderCell: (params) => {
              const selisih = params.row.diff
              return (
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {Math.abs(selisih) || "-"}
                </Typography>
              );
            },
          },

        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={data}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem',
          },
        }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined',
          },
        }}
      />
    </Card>
  );
}

const getRowClassName = params => {
  if (params.row.isAdjustment) {
    return 'stock-opname-quantity'
  }
  return ''
}
