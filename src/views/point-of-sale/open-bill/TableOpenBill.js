import { useEffect, useState } from 'react'

import { Box, Card, IconButton, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import ModalDetailOpenBill from './ModalDetailOpenBill'

const RowOptions = ({ handleView, data }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => handleView(data)}>
          <Icon icon='tabler:eye' />
        </IconButton>
      </Box>
    </>
  )
}

export default function TableOpenBill({ setSelectedMenu, warehouse }) {
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [selectedData, setSelectedData] = useState({})
  const [openModalDetail, setOpenModalDetail] = useState(false)

  const handleRowClick = (params) => {
    setOpenModalDetail(true)
    setSelectedData(params)
  }

  useEffect(() => {
    const listBill = JSON.parse(localStorage.getItem('openBill'))
    const warehousePos = warehouse
    const filtered = listBill?.filter(bill => bill.warehouse?.warehouseId === warehousePos?.warehouseId) || []
    setFilteredData(filtered)
  }, [openModalDetail, warehouse])

  return (
    <Card sx={{ height: '70vh' }}>
      <ModalDetailOpenBill
        open={openModalDetail}
        setOpen={setOpenModalDetail}
        data={selectedData}
        setSelectedMenu={setSelectedMenu}
      />
      <DataGrid
        columns={[
          {
            flex: 0.15,
            minWidth: 100,
            field: 'id',
            headerName: 'ID',
            cellClassName: {
              cursor: 'pointer'
            },
            renderCell: params => {
              return (
                <Typography style={{ cursor: 'pointer' }} variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.id}
                </Typography>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 120,
            field: 'createdAt',
            headerName: 'Gudang',
            renderCell: params => {
              return (
                <Typography style={{ cursor: 'pointer' }} variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.warehouse?.warehouseName}
                </Typography>
              )
            }
          },
          {
            flex: 0.16,
            minWidth: 120,
            field: 'creator',
            headerName: 'Customer',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                      {params.row.customer?.name || '-'}
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
                  {priceFormatWIthCurrency(params.row.subTotalPrice || 0)}
                </Typography>
              )
            }
          },
          {
            flex: 0.16,
            minWidth: 120,
            field: 'totalQuantity',
            headerName: 'Total Item',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.totalItem || 0}
                </Typography>
              )
            }
          },
          {
            flex: 0.01,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => (
              <div onClick={e => e.stopPropagation()}>
                <RowOptions handleView={() => handleRowClick(row)} data={row} />
              </div>
            )
          }
        ]}
        pageSizeOptions={[5, 10]}
        // onCellClick={e => handleRowClick(e)}
        paginationModel={paginationModel}
        // slots={{ toolbar: TableHeaderPointOfSale }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          },
          '& .MuiDataGrid-cell': {
            cursor: 'pointer'
          }
        }}
      // slotProps={{
      //   baseButton: {
      //     size: 'medium',
      //     variant: 'outlined'
      //   },
      //   toolbar: {
      //     value: searchText,
      //     placeholder: 'Cari point of sale',
      //     clearSearch: () => handleSearch(''),
      //     onChange: event => handleSearch(event.target.value)
      //   }
      // }}
      />
    </Card>
  )
}