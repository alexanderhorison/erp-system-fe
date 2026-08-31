import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { returnFormatTime } from 'src/helpers/formatDate'
import { Status } from 'src/@core/components/common'
import { fetchAllAdjustmentGoodsOut } from 'src/store/apps/adjustment/goods-out'

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

const RowOptions = ({ handleView }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
    <Tooltip title='Lihat Detail'>
      <IconButton onClick={handleView} size='small'>
        <Icon icon='tabler:eye' fontSize='1.125rem' />
      </IconButton>
    </Tooltip>
  </Box>
)

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

export default function TableAllGoodsOut({}) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })
  const [filterAnchor, setFilterAnchor] = useState(null)

  // ** Month/year used to live in a `TimeFilter` beside the page title; it is a
  // filter like any other now, so it moved into the shared panel.
  const [dataFilter, setDataFilter] = useState({ month: '', year: currentYear })

  const { dataAdjustmentGoodsOut: data } = useSelector(state => state.adjustmentGoodsOut)

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
        item =>
          item.code?.toLowerCase().includes(term) ||
          item.warehouseOriginName?.toLowerCase().includes(term)
      )
    }

    return result
  }

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    setFilteredData(applyFilters(data, dataFilter, searchValue))
  }

  const handleRowClick = params => {
    const id = params?.code || params?.row?.code
    router.push(`/adjustment/goods-out/${id}`)
  }

  const handleAdd = () => {
    router.push(`/adjustment/goods-out/add`)
  }

  useEffect(() => {
    dispatch(fetchAllAdjustmentGoodsOut())
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
        itemLabel='records'
        getRowId={row => row.code}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari kode atau gudang sumber'
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
                Tambah Barang Keluar
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.16,
            minWidth: 140,
            field: 'code',
            headerName: 'Kode',
            renderCell: params => (
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {params.row.code}
              </Typography>
            )
          },
          {
            flex: 0.14,
            minWidth: 130,
            field: 'createdAt',
            headerName: 'Tanggal Dibuat',
            renderCell: params => <DateCell date={params.row.dateCreated} timestamp={params.row.createdAt} />
          },
          {
            flex: 0.14,
            minWidth: 130,
            field: 'approvedAt',
            headerName: 'Tanggal Diterima',
            renderCell: params => <DateCell date={params.row.dateApproved} timestamp={params.row.approvedAt} />
          },
          {
            flex: 0.18,
            minWidth: 150,
            field: 'createdBy',
            headerName: 'Dibuat Oleh',
            // ** `createdBy` is an object, so the grid cannot sort or filter it
            // by value; the cell renders the name with the role beneath.
            sortable: false,
            renderCell: ({ row }) => (
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Typography noWrap variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {row.createdBy?.name || '-'}
                </Typography>
                <Typography
                  noWrap
                  sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground }}
                >
                  {row.createdBy?.roleName}
                </Typography>
              </Box>
            )
          },
          {
            flex: 0.18,
            minWidth: 150,
            field: 'warehouseOriginName',
            headerName: 'Gudang Sumber',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.warehouseOriginName}
              </Typography>
            )
          },
          {
            flex: 0.12,
            minWidth: 120,
            field: 'status',
            headerName: 'Status',
            renderCell: ({ row }) => <Status status={row.status} />
          },
          {
            flex: 0.08,
            minWidth: 90,
            sortable: false,
            field: 'actions',
            headerName: 'Aksi',
            renderCell: ({ row }) => <RowOptions handleView={() => handleRowClick(row)} />
          }
        ]}
        pageSizeOptions={[25, 50, 100]}
        onCellClick={handleRowClick}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{
          '& .MuiDataGrid-cell': {
            cursor: 'pointer'
          }
        }}
      />
    </>
  )
}
