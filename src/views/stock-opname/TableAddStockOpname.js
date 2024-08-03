import { Card, Typography } from '@mui/material'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

const RowOptions = ({productWarehouseId, handleChange}) => (
  
      <CustomTextField
        fullWidth
        onChange={(e) => {
          handleChange(e.target.value, productWarehouseId)
        }}
        type="number"
        sx={{ display: 'block' }}
      />
);

export default function TableAddStockOpname({ data, handleChange }) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })
  
  return (
    <form >
      <Card>
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
              field: 'warehouseName',
              headerName: 'Rak',
              renderCell: (params) => (
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {params.row.warehouseName}
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
                  {params.row.quantity}
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
                <RowOptions
                  handleChange={handleChange}
                  productWarehouseId={params.row.productWarehouseId}
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
                const stock = params.row.quantity;
                const actualStock = params.row.actualStock;
                const selisih = stock - actualStock;
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
    </form>
  );
}
