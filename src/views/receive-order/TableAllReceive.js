import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { fetchAllReceiveOrder } from 'src/store/apps/receive-order'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import FilterPanel from 'src/views/common/FilterPanel'
import DateCell from 'src/views/common/DateCell'
import PersonCell from 'src/views/common/PersonCell'
import { monthOptions, yearOptions, currentYear } from 'src/views/common/filterOptions'

const RowOptions = ({ handleView }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
    <Tooltip title='Lihat Detail'>
      <IconButton onClick={handleView} size='small'>
        <Icon icon='tabler:eye' fontSize='1.125rem' />
      </IconButton>
    </Tooltip>
  </Box>
)

export default function TableAllReceive() {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })
  const [filterAnchor, setFilterAnchor] = useState(null)

  // ** Month/year used to live in a `TimeFilter` beside the page title; it is a
  // filter like any other now, so it moved into the shared panel.
  const [dataFilter, setDataFilter] = useState({ month: '', year: currentYear })

  const { dataListOrderReceive: data, loadingDataListOrderReceive } = useSelector(state => state.receiveOrder)

  const filterFields = useMemo(
    () => [
      { name: 'month', label: 'Bulan', type: 'select', options: monthOptions, placeholder: 'Semua Bulan' },
      { name: 'year', label: 'Tahun', type: 'select', options: yearOptions, placeholder: 'Semua Tahun' }
    ],
    []
  )

  const activeFilterCount = Object.entries(dataFilter).filter(([, value]) => value !== '' && value != null).length

  // ** Filtering is client-side: the list endpoint returns every record, so the
  // search text and the filter values are applied together over `data`.
  const applyFilters = (source, filters, search) => {
    let result = source || []

    if (filters.year) {
      result = result.filter(item => new Date(item.createdAt).getFullYear() === parseInt(filters.year))
    }
    if (filters.month) {
      result = result.filter(item => new Date(item.createdAt).getMonth() === parseInt(filters.month) - 1)
    }
    if (search) {
      const term = search.toLowerCase()
      result = result.filter(
        item =>
          item.codeReceipt?.toLowerCase().includes(term) || item.codeDeliveryOrder?.toLowerCase().includes(term)
      )
    }

    return result
  }

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    setFilteredData(applyFilters(data, dataFilter, searchValue))
  }

  const handleView = row => router.push(`/receive-order/${row.codeReceipt}`)

  const handleAdd = () => router.push('/receive-order/add')

  useEffect(() => {
    dispatch(fetchAllReceiveOrder())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(applyFilters(data, dataFilter, searchText))
    // eslint-disable-next-line
  }, [data, dataFilter, searchText])

  return (
    <>
      <FilterPanel
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        fields={filterFields}
        value={dataFilter}
        onApply={next => setDataFilter(next)}
        onReset={() => setDataFilter({ month: '', year: '' })}
      />

      <DataTable
        itemLabel='penerimaan'
        loading={loadingDataListOrderReceive}
        getRowId={row => row.codeReceipt}
        onRowClick={params => handleView(params.row)}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari kode penerimaan atau surat jalan'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            onOpenFilters={setFilterAnchor}
            activeFilterCount={activeFilterCount}
            actions={
              <Button
                variant='contained'
                onClick={handleAdd}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Buat Penerimaan Surat Jalan
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.18,
            minWidth: 150,
            field: 'codeReceipt',
            headerName: 'KODE PENERIMAAN',
            renderCell: params => (
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {params.row.codeReceipt}
              </Typography>
            )
          },
          {
            flex: 0.18,
            minWidth: 150,
            field: 'codeDeliveryOrder',
            headerName: 'KODE SURAT JALAN',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.codeDeliveryOrder}
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
            // ** `createdBy` is an object, so the grid cannot sort or filter it
            // by value; the cell renders name over role.
            sortable: false,
            renderCell: params => <PersonCell person={params.row.createdBy} />
          },
          {
            flex: 0.1,
            minWidth: 100,
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
    </>
  )
}
