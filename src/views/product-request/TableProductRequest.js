import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { Status } from 'src/@core/components/common'
import { returnFormatTime } from 'src/helpers/formatDate'
import { updateRequestOrder } from 'src/store/apps/product-request-order'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import FilterPanel from 'src/views/common/FilterPanel'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

// ** Design Tokens
import { colors, status as statusTokens } from 'src/configs/designTokens'

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

/** Person's name over their role; both columns render an object, not a string. */
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
      {person.role && (
        <Typography noWrap sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground }}>
          {person.role}
        </Typography>
      )}
    </Box>
  )
}

const RowOptions = ({ handleView, handleProcess, handleReject, status }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
    {status === 'PENDING' ? (
      <>
        <Tooltip title='Proses'>
          <IconButton onClick={handleProcess} size='small' sx={{ color: statusTokens.success.fg }}>
            <Icon icon='tabler:circle-check' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Tolak'>
          <IconButton onClick={handleReject} size='small' sx={{ color: colors.destructive }}>
            <Icon icon='tabler:circle-x' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
      </>
    ) : (
      <Tooltip title='Lihat Detail'>
        <IconButton onClick={handleView} size='small'>
          <Icon icon='tabler:eye' fontSize='1.125rem' />
        </IconButton>
      </Tooltip>
    )}
  </Box>
)

export default function TableRequestProduct() {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })
  const [filterAnchor, setFilterAnchor] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)

  // ** Month/year used to live in a `TimeFilter` beside the page title; it is a
  // filter like any other now, so it moved into the shared panel.
  const [dataFilter, setDataFilter] = useState({ month: '', year: currentYear, status: '' })

  const { dataRequestOrder: data, loadingDataRequestOrder } = useSelector(state => state.productRequest)

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
          { value: 'APPROVED', label: 'Approved' },
          { value: 'REJECTED', label: 'Rejected' }
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
        item => item.code?.toLowerCase().includes(term) || item.createdBy?.name?.toLowerCase().includes(term)
      )
    }

    return result
  }

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    setFilteredData(applyFilters(data, dataFilter, searchValue))
  }

  const handleView = row => router.push(`/product-request/${row?.code}`)

  const handleProcessRequest = row => router.push(`/product-request/process/${row?.code}`)

  // ** `updateRequestOrder` no longer prompts on its own (see
  // docs/REVAMP_BASELINE.md §4), so rejection is confirmed here.
  const handleRejectConfirmed = () => {
    dispatch(updateRequestOrder({ code: rejectTarget, type: 'REJECT' }))
    setRejectTarget(null)
  }

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
        itemLabel='requests'
        loading={loadingDataRequestOrder}
        getRowId={row => row.code}
        onRowClick={params => handleView(params.row)}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari kode atau pembuat'
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
            headerName: 'Kode',
            renderCell: params => (
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {params.row.code}
              </Typography>
            )
          },
          {
            flex: 0.17,
            minWidth: 150,
            field: 'createdAt',
            headerName: 'Tanggal Dibuat',
            renderCell: params => <DateCell date={params.row.dateCreated} timestamp={params.row.createdAt} />
          },
          {
            flex: 0.18,
            minWidth: 150,
            field: 'createdBy',
            headerName: 'Dibuat Oleh',
            // ** `createdBy` is an object, so the grid cannot sort or filter it
            // by value; the cell renders name over role.
            sortable: false,
            renderCell: params => <PersonCell person={params.row.createdBy} />
          },
          {
            flex: 0.18,
            minWidth: 150,
            field: 'approvedBy',
            headerName: 'Diproses Oleh',
            sortable: false,
            renderCell: params => <PersonCell person={params.row.approvedBy} />
          },
          {
            flex: 0.13,
            minWidth: 120,
            field: 'status',
            headerName: 'Status',
            renderCell: params => <Status status={params.row.status} />
          },
          {
            flex: 0.13,
            minWidth: 120,
            sortable: false,
            field: 'actions',
            headerName: 'Aksi',
            // ** The row itself navigates to the detail page, so the action
            // buttons must not bubble their clicks up to it.
            renderCell: ({ row }) => (
              <Box onClick={event => event.stopPropagation()} sx={{ width: '100%' }}>
                <RowOptions
                  status={row.status}
                  handleView={() => handleView(row)}
                  handleProcess={() => handleProcessRequest(row)}
                  handleReject={() => setRejectTarget(row.code)}
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

      <ConfirmDialog
        open={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleRejectConfirmed}
        title='Tolak Product Request'
        description={`Anda akan menolak permintaan produk ${rejectTarget || ''}.`}
        confirmLabel='Tolak'
        confirmIcon='tabler:circle-x'
        loadingLabel='Menolak...'
      />
    </>
  )
}
