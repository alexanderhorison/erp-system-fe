import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { Status } from 'src/@core/components/common'
import { returnFormatDateDay, returnFormatTime } from 'src/helpers/formatDate'
import { fetchAllReceiptOrderOutstanding } from 'src/store/apps/receipt-order-outstanding'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import FilterPanel from 'src/views/common/FilterPanel'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

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

/** Date over the time it happened, so the column stays narrow. */
const DateCell = ({ date, timestamp }) => {
  if (!date) {
    return (
      <Typography variant='body2' sx={{ color: colors.mutedForeground }}>
        -
      </Typography>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {date}
      </Typography>
      <Typography noWrap sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground }}>
        {returnFormatTime(timestamp)}
      </Typography>
    </Box>
  )
}

/** Person's name over their role; the column renders an object, not a string. */
const PersonCell = ({ person }) => {
  if (!person?.name) {
    return (
      <Typography variant='body2' sx={{ color: colors.mutedForeground }}>
        -
      </Typography>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography noWrap variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
        {person.name}
      </Typography>
      {person.roleName && (
        <Typography noWrap sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground }}>
          {person.roleName}
        </Typography>
      )}
    </Box>
  )
}

const RowOptions = ({ handleView }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
    <Tooltip title='Lihat Detail'>
      <IconButton onClick={handleView} size='small'>
        <Icon icon='tabler:eye' fontSize='1.125rem' />
      </IconButton>
    </Tooltip>
  </Box>
)

export default function TableReceiptOrderOutstanding() {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })
  const [filterAnchor, setFilterAnchor] = useState(null)

  // ** Month/year used to live in a `TimeFilter` beside the page title; it is a
  // filter like any other now, so it moved into the shared panel.
  const [dataFilter, setDataFilter] = useState({ month: '', year: currentYear, status: '' })

  const { data, loading } = useSelector(state => state.deliveryOrderReceiptOutstanding)

  const filterFields = useMemo(
    () => [
      { name: 'month', label: 'Bulan', type: 'select', options: monthOptions, placeholder: 'Semua Bulan' },
      { name: 'year', label: 'Tahun', type: 'select', options: yearOptions, placeholder: 'Semua Tahun' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'PENDING', label: 'Pending' },
          { value: 'APPROVED', label: 'Approved' }
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
        item =>
          item.code?.toLowerCase().includes(term) || item.deliveryOrderReceiptCode?.toLowerCase().includes(term)
      )
    }

    return result
  }

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    setFilteredData(applyFilters(data, dataFilter, searchValue))
  }

  const handleView = row => router.push(`/receipt-order-outstanding/${row.code}`)

  useEffect(() => {
    dispatch(fetchAllReceiptOrderOutstanding())
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
        itemLabel='surat outstanding'
        loading={loading}
        getRowId={row => row.code}
        onRowClick={params => handleView(params.row)}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari kode outstanding atau penerimaan'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            onOpenFilters={setFilterAnchor}
            activeFilterCount={activeFilterCount}
          />
        }
        columns={[
          {
            flex: 0.16,
            minWidth: 150,
            field: 'code',
            headerName: 'KODE OUTSTANDING',
            renderCell: params => (
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {params.row.code}
              </Typography>
            )
          },
          {
            flex: 0.18,
            minWidth: 160,
            field: 'deliveryOrderReceiptCode',
            headerName: 'KODE PENERIMAAN',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.deliveryOrderReceiptCode}
              </Typography>
            )
          },
          {
            flex: 0.16,
            minWidth: 140,
            field: 'createdAt',
            headerName: 'TANGGAL DIBUAT',
            renderCell: params => <DateCell date={returnFormatDateDay(params.row.createdAt)} timestamp={params.row.createdAt} />
          },
          {
            flex: 0.16,
            minWidth: 150,
            field: 'createdBy',
            headerName: 'DIBUAT OLEH',
            sortable: false,
            renderCell: params => <PersonCell person={params.row.createdBy} />
          },
          {
            flex: 0.16,
            minWidth: 150,
            field: 'approvedBy',
            headerName: 'DISELESAIKAN OLEH',
            sortable: false,
            renderCell: params => <PersonCell person={params.row.approvedBy} />
          },
          {
            flex: 0.1,
            minWidth: 110,
            field: 'status',
            headerName: 'STATUS',
            renderCell: params => <Status status={params.row.status} />
          },
          {
            flex: 0.08,
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
    </>
  )
}
