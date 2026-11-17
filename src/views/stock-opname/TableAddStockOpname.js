import { useMemo, useState } from 'react'

// ** MUI Imports
import Typography from '@mui/material/Typography'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Shared Components
import ChoicePill from 'src/views/common/ChoicePill'
import DataTable from 'src/views/common/DataTable'
import StatusChip from 'src/views/common/StatusChip'
import TableToolbar from 'src/views/common/TableToolbar'

// ** Helpers
import { formatDiff, getDiff, getSystemStock, summarizeDiff } from './stockOpnameDiff'

const FILTER_ALL = 'ALL'
const FILTER_DIFF = 'DIFF'

export default function TableAddStockOpname({ data, handleChange, type = 'add', loading }) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })
  const [searchText, setSearchText] = useState('')
  const [filter, setFilter] = useState(FILTER_ALL)

  const rows = useMemo(() => data || [], [data])
  const summary = useMemo(() => summarizeDiff(rows, type), [rows, type])

  const filteredRows = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()

    return rows.filter(row => {
      if (filter === FILTER_DIFF && getDiff(row, type) === null) return false
      if (!keyword) return true

      return (
        `${row.productName ?? ''}`.toLowerCase().includes(keyword) ||
        `${row.companyName ?? ''}`.toLowerCase().includes(keyword)
      )
    })
  }, [rows, searchText, filter, type])

  const goToFirstPage = () => setPaginationModel(prev => ({ ...prev, page: 0 }))

  const handleSearch = value => {
    setSearchText(value)
    goToFirstPage()
  }

  const handleFilter = value => {
    setFilter(value)
    goToFirstPage()
  }

  return (
    <DataTable
      itemLabel='products'
      loading={loading}
      getRowId={row => row.productWarehouseId}
      toolbar={
        <TableToolbar
          value={searchText}
          placeholder='Cari Produk atau perusahaan'
          onChange={e => handleSearch(e.target.value)}
          clearSearch={() => handleSearch('')}
          searchAddon={
            <>
              <ChoicePill
                label='Semua'
                count={summary.total}
                selected={filter === FILTER_ALL}
                onClick={() => handleFilter(FILTER_ALL)}
              />
              <ChoicePill
                label='Ada selisih'
                count={summary.withDiff}
                selected={filter === FILTER_DIFF}
                onClick={() => handleFilter(FILTER_DIFF)}
              />
            </>
          }
        />
      }
      columns={[
        {
          flex: 0.24,
          minWidth: 220,
          field: 'productName',
          headerName: 'PRODUK',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.productName}
            </Typography>
          )
        },
        {
          flex: 0.1,
          minWidth: 100,
          field: 'unitName',
          headerName: 'UNIT',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.unitName}
            </Typography>
          )
        },
        {
          flex: 0.13,
          minWidth: 130,
          field: 'companyName',
          headerName: 'PERUSAHAAN',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.companyName}
            </Typography>
          )
        },
        {
          flex: 0.1,
          minWidth: 100,
          field: 'rackName',
          headerName: 'RAK',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.rackName || '-'}
            </Typography>
          )
        },
        {
          flex: 0.09,
          minWidth: 90,
          field: 'quantity',
          headerName: 'STOCK',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {getSystemStock(params.row, type)}
            </Typography>
          )
        },
        {
          flex: 0.14,
          minWidth: 140,
          sortable: false,
          field: 'actualStock',
          headerName: 'ACTUAL STOCK',
          renderCell: params => (
            <CustomTextField
              fullWidth
              size='small'
              value={params.row.actualStock ?? ''}
              onChange={e => {
                handleChange(`${e?.target?.value}`, params.row.productWarehouseId)
              }}
              type='number'
              inputProps={{ min: 0 }}
              sx={{ display: 'block' }}
            />
          )
        },
        {
          flex: 0.09,
          minWidth: 90,
          sortable: false,
          field: 'actions',
          align: 'left',
          headerAlign: 'left',
          headerName: 'SELISIH',
          renderCell: params => {
            const diff = getDiff(params.row, type)

            // ** Shortfall reads red, surplus green; no diff stays a plain dash.
            return diff === null ? (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                -
              </Typography>
            ) : (
              <StatusChip label={formatDiff(diff)} tone={diff > 0 ? 'success' : 'danger'} />
            )
          }
        }
      ]}
      pageSizeOptions={[25, 50, 100]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      rows={filteredRows}
      sx={{
        '& .MuiDataGrid-overlayWrapper': {
          zIndex: 0
        }
      }}
    />
  )
}
