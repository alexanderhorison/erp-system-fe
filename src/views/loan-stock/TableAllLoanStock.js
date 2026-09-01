import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { fetchLoanProducts } from 'src/store/apps/loan-stock'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import ModalPayLoanStock from './ModalPayLoanStock'

const RowOptions = ({ handlePayLoan }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Tooltip title='Bayar Pinjaman'>
        <IconButton onClick={() => handlePayLoan()} size='small'>
          <Icon icon='tabler:cash' fontSize='1.125rem' />
        </IconButton>
      </Tooltip>
    </Box>
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

  // ** Mirrors whatever the store holds, including an empty list — guarding on
  // `length` would leave a stale table after the last loan is paid off.
  useEffect(() => {
    setFilteredData(data || [])
  }, [data])

  return (
    <>
      <DataTable
        itemLabel='loans'
        loading={loadingListLoan}
        getRowId={row => row.id}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari produk, satuan atau gudang'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
          />
        }
        columns={[
          {
            flex: 0.25,
            minWidth: 200,
            field: 'productName',
            headerName: 'Nama Produk',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.productName}
              </Typography>
            )
          },
          {
            flex: 0.1,
            minWidth: 110,
            field: 'quantity',
            headerName: 'Jumlah',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.quantity}
              </Typography>
            )
          },
          {
            flex: 0.15,
            minWidth: 120,
            field: 'unitName',
            headerName: 'Satuan',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.unitName}
              </Typography>
            )
          },
          {
            flex: 0.2,
            minWidth: 180,
            field: 'warehouseName',
            headerName: 'Gudang',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.warehouseName}
              </Typography>
            )
          },
          {
            flex: 0.1,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'Aksi',
            renderCell: ({ row }) => <RowOptions handlePayLoan={() => handlePayLoan(row)} />
          }
        ]}
        pageSizeOptions={[25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
      />

      {/* Modal for paying loan */}
      <ModalPayLoanStock open={openPayModal} setOpen={setOpenPayModal} loanData={selectedLoan} />
    </>
  )
}
