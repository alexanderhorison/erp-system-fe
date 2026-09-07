import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { fetchAllDeliveryOrder } from 'src/store/apps/delivery-order'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import DateCell from 'src/views/common/DateCell'
import PersonCell from 'src/views/common/PersonCell'

const RowOptions = ({ handleView }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
    <Tooltip title='Pilih'>
      <IconButton onClick={handleView} size='small'>
        <Icon icon='tabler:arrow-right' fontSize='1.125rem' />
      </IconButton>
    </Tooltip>
  </Box>
)

export default function TableAllChooseReceiveOrder() {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { dataListDeliveryOrder: data, loadingDataListDeliveryOrder } = useSelector(state => state.deliveryOrder)

  const applyFilters = (source, search) => {
    let result = source || []

    if (search) {
      const term = search.toLowerCase()
      result = result.filter(
        item =>
          item.code?.toLowerCase().includes(term) ||
          item.warehouseOrigin?.toLowerCase().includes(term) ||
          item.warehouseDestination?.toLowerCase().includes(term)
      )
    }

    return result
  }

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    setFilteredData(applyFilters(data, searchValue))
  }

  const handleView = row => router.push(`/receive-order/add/${row.code}`)

  useEffect(() => {
    dispatch(fetchAllDeliveryOrder({ receiveOrder: true }))
  }, [dispatch])

  useEffect(() => {
    setFilteredData(applyFilters(data, searchText))
    // eslint-disable-next-line
  }, [data, searchText])

  return (
    <DataTable
      itemLabel='surat jalan'
      loading={loadingDataListDeliveryOrder}
      getRowId={row => row.code}
      onRowClick={params => handleView(params.row)}
      toolbar={
        <TableToolbar
          value={searchText}
          placeholder='Cari kode atau gudang'
          onChange={event => handleSearch(event.target.value)}
          clearSearch={() => handleSearch('')}
        />
      }
      columns={[
        {
          flex: 0.16,
          minWidth: 130,
          field: 'code',
          headerName: 'KODE',
          renderCell: params => (
            <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
              {params.row.code}
            </Typography>
          )
        },
        {
          flex: 0.18,
          minWidth: 140,
          field: 'createdAt',
          headerName: 'TANGGAL DIBUAT',
          renderCell: params => <DateCell date={params.row.dateCreated} timestamp={params.row.createdAt} />
        },
        {
          flex: 0.2,
          minWidth: 150,
          field: 'createdBy',
          headerName: 'DIBUAT OLEH',
          sortable: false,
          renderCell: params => <PersonCell person={params.row.createdBy} />
        },
        {
          flex: 0.2,
          minWidth: 140,
          field: 'warehouseOrigin',
          headerName: 'GUDANG SUMBER',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.warehouseOrigin}
            </Typography>
          )
        },
        {
          flex: 0.16,
          minWidth: 140,
          field: 'warehouseDestination',
          headerName: 'GUDANG TUJUAN',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.warehouseDestination}
            </Typography>
          )
        },
        {
          flex: 0.1,
          minWidth: 90,
          sortable: false,
          field: 'actions',
          headerName: 'ACTION',
          renderCell: ({ row }) => (
            <Box onClick={event => event.stopPropagation()} sx={{ width: '100%' }}>
              <RowOptions handleView={() => handleView(row)} />
            </Box>
          )
        }
      ]}
      pageSizeOptions={[25, 50, 100]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      rows={filteredData}
      sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
    />
  )
}
