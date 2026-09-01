import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { Status } from 'src/@core/components/common'
import { returnFormatDate } from 'src/helpers/formatDate'
import { deleteStockOpname, fetchListStockOpname } from 'src/store/apps/stock-opname'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import FilterPanel from 'src/views/common/FilterPanel'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
]

const currentYear = new Date().getFullYear()
const yearOptions = [currentYear, currentYear - 1, currentYear - 2].map(year => ({ value: year, label: `${year}` }))

const RowOptions = ({ code, name, id, status, router }) => {
  const dispatch = useDispatch()
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)

  const { loadingDelete } = useSelector(state => state.stockOpname)

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again.
  const handleDelete = () => {
    dispatch(deleteStockOpname({ id, name }))
    setOpenConfirmDelete(false)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Tooltip title='Lihat Detail'>
          <IconButton onClick={() => router.push(`/stock-opname/${code}`)} size='small'>
            <Icon icon='tabler:eye' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        {status === 'DRAFT' && (
          <Tooltip title='Ubah'>
            <IconButton onClick={() => router.push(`/stock-opname/${code}/edit`)} size='small'>
              <Icon icon='tabler:edit' fontSize='1.125rem' />
            </IconButton>
          </Tooltip>
        )}
        {process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true' && (
          <Tooltip title='Hapus'>
            <IconButton onClick={() => setOpenConfirmDelete(true)} size='small' sx={{ color: 'error.main' }}>
              <Icon icon='tabler:trash' fontSize='1.125rem' />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title='Hapus Stock Opname'
        itemName={name}
        loading={loadingDelete}
      />
    </>
  )
}

export default function TableListStockOpname() {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })
  const [filterAnchor, setFilterAnchor] = useState(null)

  // ** Month/year used to live in a `TimeFilter` beside the page title; it is a
  // filter like any other now, so it moved into the shared panel.
  const [dataFilter, setDataFilter] = useState({ month: '', year: currentYear, status: '' })

  const { listData: data } = useSelector(state => state.stockOpname)

  const filterFields = useMemo(
    () => [
      { name: 'month', label: 'Bulan', type: 'select', options: monthOptions, placeholder: 'Semua Bulan' },
      { name: 'year', label: 'Tahun', type: 'select', options: yearOptions, placeholder: 'Semua Tahun' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'DRAFT', label: 'Draft' },
          { value: 'PENDING', label: 'Pending' },
          { value: 'APPROVED', label: 'Approved' },
          { value: 'REJECTED', label: 'Rejected' },
          { value: 'CLOSED', label: 'Closed' }
        ],
        placeholder: 'Semua Status'
      }
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
    if (filters.status) {
      result = result.filter(item => item.status === filters.status)
    }
    if (search) {
      const term = search.toLowerCase()
      result = result.filter(
        item => item.code?.toLowerCase().includes(term) || item.warehouseName?.toLowerCase().includes(term)
      )
    }

    return result
  }

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    setFilteredData(applyFilters(data, dataFilter, searchValue))
  }

  const handleRowClick = params => {
    const code = params?.code || params?.row?.code
    router.push(`/stock-opname/${code}`)
  }

  useEffect(() => {
    dispatch(fetchListStockOpname())
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
        onReset={() => setDataFilter({ month: '', year: '', status: '' })}
      />

      <DataTable
        itemLabel='records'
        getRowId={row => row.code}
        onRowClick={handleRowClick}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari kode atau gudang'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            onOpenFilters={setFilterAnchor}
            activeFilterCount={activeFilterCount}
            actions={
              <Button
                variant='contained'
                onClick={() => router.push('/stock-opname/add')}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Buat Stock Opname
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.2,
            minWidth: 180,
            field: 'code',
            headerName: 'Kode',
            renderCell: params => (
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {params.row.code}
              </Typography>
            )
          },
          {
            flex: 0.15,
            minWidth: 130,
            field: 'createdAt',
            headerName: 'Tanggal',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.opnameDate || '-'}
              </Typography>
            )
          },
          {
            flex: 0.25,
            minWidth: 160,
            field: 'warehouseName',
            headerName: 'Gudang',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.warehouseName}
              </Typography>
            )
          },
          {
            flex: 0.15,
            minWidth: 120,
            field: 'status',
            headerName: 'Status',
            renderCell: params => <Status status={params.row.status} />
          },
          {
            flex: 0.15,
            minWidth: 130,
            sortable: false,
            field: 'actions',
            headerName: 'Aksi',
            // ** The row itself navigates to the detail page, so the action
            // buttons must not bubble their clicks up to it.
            renderCell: ({ row }) => (
              <Box onClick={event => event.stopPropagation()} sx={{ width: '100%' }}>
                <RowOptions
                  id={row.id}
                  code={row.code}
                  name={`${row.code} - ${returnFormatDate(row.createdAt)} - ${row.warehouseName}`}
                  status={row.status}
                  router={router}
                />
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
