import { useEffect, useState } from 'react'

import { Box, IconButton, Tooltip, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import ModalDetailOpenBill from './ModalDetailOpenBill'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'

const RowOptions = ({ handleView, data }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Tooltip title='Lihat'>
        <IconButton onClick={() => handleView(data)} size='small'>
          <Icon icon='tabler:edit' fontSize='1.125rem' />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default function TableOpenBill({ setSelectedMenu, warehouse, isMobile, isTablet, isLowHeight }) {
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: isLowHeight ? 5 : 10 })
  const [selectedData, setSelectedData] = useState({})
  const [openModalDetail, setOpenModalDetail] = useState(false)

  const handleRowClick = params => {
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
    <>
      <ModalDetailOpenBill
        open={openModalDetail}
        setOpen={setOpenModalDetail}
        data={selectedData}
        setSelectedMenu={setSelectedMenu}
      />
      <DataTable
        itemLabel='datas'
        columns={[
          {
            flex: 0.25,
            minWidth: 200,
            field: 'id',
            headerName: 'ID',
            renderCell: params => <Typography variant='body2'>{params.row.id}</Typography>
          },
          {
            flex: 0.18,
            minWidth: 140,
            field: 'warehouse',
            headerName: 'Gudang',
            valueGetter: params => params.row.warehouse?.warehouseName || '',
            renderCell: params => <Typography variant='body2'>{params.row.warehouse?.warehouseName}</Typography>
          },
          {
            flex: 0.18,
            minWidth: 140,
            field: 'customer',
            headerName: 'Customer',
            valueGetter: params => params.row.customer?.name || '',
            renderCell: params => (
              <Typography noWrap variant='body2'>
                {params.row.customer?.name || '-'}
              </Typography>
            )
          },
          {
            flex: 0.18,
            minWidth: 150,
            field: 'subTotalPrice',
            headerName: 'Total Pembelian',
            renderCell: params => (
              <Typography variant='body2'>{priceFormatWIthCurrency(params.row.subTotalPrice || 0)}</Typography>
            )
          },
          {
            flex: 0.12,
            minWidth: 110,
            field: 'totalItem',
            headerName: 'Total Item',
            renderCell: params => <Typography variant='body2'>{params.row.totalItem || 0}</Typography>
          },
          {
            flex: 0.09,
            minWidth: 90,
            sortable: false,
            field: 'actions',
            headerName: 'Action',
            renderCell: ({ row }) => (
              <div onClick={e => e.stopPropagation()}>
                <RowOptions handleView={() => handleRowClick(row)} data={row} />
              </div>
            )
          }
        ]}
        pageSizeOptions={isLowHeight ? [5, 10] : [5, 10, 25]}
        onRowClick={params => handleRowClick(params?.row)}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
      />
    </>
  )
}
