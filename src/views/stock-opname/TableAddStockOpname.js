import { Card, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'

export default function TableAddStockOpname({ data, handleChange, type = "add" }) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

  return (
    <form >
      <Card >
        <DataGrid
          autoHeight
          getRowId={(row) => row.productWarehouseId}
          columns={[
            {
              flex: 0.2,
              minWidth: 200,
              field: 'productName',
              headerName: 'Produk',
              renderCell: (params) => (
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {params.row.productName}
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
              flex: 0.2,
              minWidth: 120,
              field: 'rackName',
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
              field: 'quantity',
              headerName: 'Stock',
              renderCell: (params) => (
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {type === "add" ? params.row.quantity : params.row.systemStock}
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
                <CustomTextField
                  fullWidth
                  value={params.row.actualStock}
                  onChange={(e) => {
                    handleChange(e?.target?.value, params.row.productWarehouseId)
                  }}
                  type="number"
                  sx={{ display: 'block' }}
                />
              ),
            },
            {
              flex: 0.1,
              minWidth: 120,
              sortable: false,
              field: 'actions',
              headerName: 'Selisih',
              renderCell: (params) => {
                const stock = type === "add" ? params.row.quantity : params.row.systemStock;
                const actualStock = params.row.actualStock;
                let selisih = stock - actualStock;
                if (!params.row.actualStock) {
                  selisih = '-'
                }
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
            '& .MuiDataGrid-overlayWrapper ': {
              zIndex: 0
            },
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
    </form>
  );
}
