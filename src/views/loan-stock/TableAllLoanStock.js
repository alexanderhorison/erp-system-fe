import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography, TextField } from '@mui/material'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import { fetchLoanProducts } from 'src/store/apps/loan-stock'
import ModalPayLoanStock from './ModalPayLoanStock'
import TableHeaderLoanStock from './TableHeaderLoanStock'

const RowOptions = ({ handlePayLoan }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => handlePayLoan()} title='Bayar Pinjaman'>
          <Icon icon='tabler:cash' />
        </IconButton>
      </Box>
    </>
  )
}

export default function TableAllLoanStock() {
  const dispatch = useDispatch()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [openPayModal, setOpenPayModal] = useState(false)

  const { dataListLoan: data, loadingListLoan } = useSelector(state => state.loanStock)

  const handleSearch = searchValue => {
    setSearchText(searchValue)

    if (!searchValue) {
      setFilteredData(data)
      return
    }

    const lowercasedValue = searchValue.toLowerCase()
    const filtered = data.filter(item => {
      return (
        item.productName?.toLowerCase().includes(lowercasedValue) ||
        item.unitName?.toLowerCase().includes(lowercasedValue) ||
        item.warehouseName?.toLowerCase().includes(lowercasedValue)
      )
    })

    setFilteredData(filtered)
  }

  const handlePayLoan = loanData => {
    setSelectedLoan(loanData)
    setOpenPayModal(true)
  }

  useEffect(() => {
    dispatch(fetchLoanProducts())
  }, [dispatch])

  useEffect(() => {
    if (data && data.length > 0) {
      setFilteredData(data)
    }
  }, [data])

  return (
    <Card>
      <DataGrid
        autoHeight
        loading={loadingListLoan}
        columns={[
          {
            flex: 0.25,
            minWidth: 200,
            field: 'productName',
            headerName: 'Nama Produk',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.productName}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'quantity',
            headerName: 'Jumlah',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {params.row.quantity}
                </Typography>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 120,
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
            flex: 0.2,
            minWidth: 180,
            field: 'warehouseName',
            headerName: 'Gudang',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.warehouseName}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => <RowOptions handlePayLoan={() => handlePayLoan(row)} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        // onCellClick={params => handleRowClick(params.row)}
        getRowId={row => row.id}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          },
          '& .MuiDataGrid-cell': {
            cursor: 'pointer'
          }
        }}
        slots={{ toolbar: TableHeaderLoanStock }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            value: searchText,
            placeholder: 'Cari loan stock',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value)
          }
        }}
      />

      {/* Modal for paying loan */}
      <ModalPayLoanStock open={openPayModal} setOpen={setOpenPayModal} loanData={selectedLoan} />
    </Card>
  )
}
