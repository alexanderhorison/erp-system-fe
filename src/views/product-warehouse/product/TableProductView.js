import { useState } from 'react'

import { Card, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Tooltip from '@mui/material/Tooltip'


import TableProductViewHeader from './TableProductViewHeader'
import { useRouter } from 'next/router'

export default function TableProductView({ data, warehouseId }) {
  const router = useRouter()
  const [searchText, setSearchText] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })
  const [filteredData, setFilteredData] = useState([])

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    if (searchValue.length) {
      const filteredRows = data.filter(row => row.productName.toLowerCase().includes(searchValue.toLowerCase()))
      setFilteredData(filteredRows)
    } else {
      setFilteredData([])
    }
  }

  const getRowId = row => {
    return row.productWarehouseId
  }

  const clickHistory = (id) => {
    router.push(`/product-warehouse/product/${id}/history`)
  }

  return (
    <Card>
      <DataGrid
        autoHeight
        getRowId={getRowId}
        columns={[
          {
            flex: 0.2,
            minWidth: 300,
            field: 'productName',
            headerName: 'Nama Produks',
            renderCell: params => {
              return (
                <Tooltip title="Check History" placement="top">
                  <span onClick={() => clickHistory(params?.row?.productWarehouseId)}>
                    <Typography variant="body2" sx={{
                      color: 'text.primary',
                      cursor: 'pointer',
                      '&:hover': { color: 'info.main' },
                    }}>
                      {params.row.productName}
                    </Typography>
                  </span>
                </Tooltip>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'categoryName',
            headerName: 'Kategori',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.categoryName}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'unitName',
            headerName: 'Satuan',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.unitName}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'typeName',
            headerName: 'Tipe',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.typeName}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'quantity',
            headerName: 'Kuantiti',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.quantity}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'minimumStock',
            headerName: 'Stok Minimum',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.minimumStock}
                </Typography>
              )
            }
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: TableProductViewHeader }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData.length ? filteredData : data}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          }
        }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            value: searchText,
            placeholder: 'Cari nama produk',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value)
          }
        }}
      />
    </Card>
  )
}
