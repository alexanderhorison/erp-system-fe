import { useEffect, useMemo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { Status } from 'src/@core/components/common'
import { fetchAllPointOfSaleByWarehouseId, fetchDetailPointOfSale } from 'src/store/apps/pos'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import ModalViewTransactionV4 from 'src/views/point-of-sale/transaction/ModalViewTransactionV4'

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

// Fixed warehouse for the POS transaction listing, per the existing requirement.
const WAREHOUSE_ID = 6

export default function TableAllPosTransaction() {
  const dispatch = useDispatch()

  const [searchText, setSearchText] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })
  const [filterAnchor, setFilterAnchor] = useState(null)
  const [openModalDetail, setOpenModalDetail] = useState(false)

  const [dataFilter, setDataFilter] = useState({
    month: '',
    year: currentYear,
    status: '',
    orderBy: 'createdAt',
    orderType: 'DESC'
  })

  const {
    dataPointOfSale: data,
    paginationPointOfSale: pagination,
    loadingDataPointOfSale: loading
  } = useSelector(state => state.pos)

  const filterFields = useMemo(
    () => [
      { name: 'month', label: 'Bulan', type: 'select', options: monthOptions, placeholder: 'Semua Bulan' },
      { name: 'year', label: 'Tahun', type: 'select', options: yearOptions, placeholder: 'Semua Tahun' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'PAID', label: 'Paid' },
          { value: 'VOID', label: 'Void' }
        ],
        placeholder: 'Semua Status'
      }
    ],
    []
  )

  const activeFilterCount = ['month', 'year', 'status'].filter(
    key => dataFilter[key] !== '' && dataFilter[key] != null
  ).length

  // Helper: convert year/month to dateFrom/dateTo
  const getDateRange = useCallback((year, month) => {
    if (!year) return {}

    const yearNum = parseInt(year)
    const formatDate = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`

    if (month) {
      const monthNum = parseInt(month)
      const dateFrom = formatDate(yearNum, monthNum, 1)
      const lastDayOfMonth = new Date(yearNum, monthNum, 0).getDate()
      const dateTo = formatDate(yearNum, monthNum, lastDayOfMonth)
      return { dateFrom, dateTo }
    }

    return { dateFrom: formatDate(yearNum, 1, 1), dateTo: formatDate(yearNum, 12, 31) }
  }, [])

  // Centralized fetch — filtering, search, sort and pagination are all server-side.
  const fetchData = useCallback(
    (customParams = {}, currentSearchText = searchText, currentFilters = dataFilter, currentPaginationModel = paginationModel) => {
      const dateRange = getDateRange(currentFilters.year, currentFilters.month)
      const params = {
        page: 1,
        limit: currentPaginationModel.pageSize,
        ...(currentSearchText && { search: currentSearchText }),
        ...(currentFilters.status && { status: currentFilters.status }),
        orderBy: currentFilters.orderBy,
        orderType: currentFilters.orderType,
        ...dateRange,
        paginate: true,
        ...customParams
      }
      dispatch(fetchAllPointOfSaleByWarehouseId({ warehouseId: WAREHOUSE_ID, ...params }))
    },
    [dispatch, getDateRange, searchText, dataFilter, paginationModel]
  )

  // Debounced search, cleaned up on unmount.
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId
      const fn = (searchValue, currentFilters, currentPaginationModel) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          fetchData({ search: searchValue, page: 1 }, searchValue, currentFilters, currentPaginationModel)
        }, 500)
      }
      fn.cancel = () => clearTimeout(timeoutId)
      return fn
    })(),
    [fetchData]
  )

  const handleSearch = searchValue => {
    setSearchText(searchValue)

    if (searchValue === '') {
      debouncedSearch.cancel()
      setPaginationModel(prev => ({ ...prev, page: 0 }))
      fetchData({ page: 1 }, '', dataFilter, paginationModel)
    } else {
      debouncedSearch(searchValue, dataFilter, paginationModel)
    }
  }

  const handleView = row => {
    setOpenModalDetail(true)
    dispatch(fetchDetailPointOfSale(row.code))
  }

  const handlePaginationChange = newPaginationModel => {
    setPaginationModel(newPaginationModel)
    fetchData(
      { page: newPaginationModel.page + 1, limit: newPaginationModel.pageSize },
      searchText,
      dataFilter,
      newPaginationModel
    )
  }

  const handleApplyFilters = nextFilter => {
    setDataFilter(prev => ({ ...prev, ...nextFilter }))
    setPaginationModel(prev => ({ ...prev, page: 0 }))
    fetchData(
      { page: 1, ...(nextFilter.status && { status: nextFilter.status }) },
      searchText,
      { ...dataFilter, ...nextFilter },
      paginationModel
    )
  }

  const handleResetFilters = () => {
    const reset = { month: '', year: '', status: '', orderBy: 'createdAt', orderType: 'DESC' }
    setDataFilter(reset)
    setPaginationModel(prev => ({ ...prev, page: 0 }))
    fetchData({ page: 1 }, searchText, reset, paginationModel)
  }

  const handleSortModelChange = sortModel => {
    if (sortModel.length === 0) return

    const { field, sort } = sortModel[0]
    const orderBy = field === 'createdAt' ? 'createdAt' : 'createdAt'
    const orderType = sort.toUpperCase()
    const nextFilters = { ...dataFilter, orderBy, orderType }

    setDataFilter(nextFilters)
    fetchData({ page: 1, orderBy, orderType }, searchText, nextFilters, paginationModel)
  }

  // Initial fetch and fetch when the year/month filter changes.
  useEffect(() => {
    const dateRange = getDateRange(dataFilter.year, dataFilter.month)
    dispatch(
      fetchAllPointOfSaleByWarehouseId({
        warehouseId: WAREHOUSE_ID,
        page: 1,
        limit: 25,
        orderBy: 'createdAt',
        orderType: 'DESC',
        ...dateRange,
        paginate: true
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, dataFilter.year, dataFilter.month])

  return (
    <>
      <FilterPanel
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        fields={filterFields}
        value={dataFilter}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <DataTable
        itemLabel='transaksi POS'
        loading={loading}
        rows={data || []}
        rowCount={pagination?.total || 0}
        paginationMode='server'
        sortingMode='server'
        getRowId={row => row.id}
        onRowClick={params => handleView(params.row)}
        onSortModelChange={handleSortModelChange}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari kode transaksi'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            onOpenFilters={setFilterAnchor}
            activeFilterCount={activeFilterCount}
          />
        }
        columns={[
          {
            flex: 0.14,
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
            flex: 0.16,
            minWidth: 150,
            field: 'createdAt',
            headerName: 'TANGGAL TRANSAKSI',
            renderCell: params => <DateCell date={params.row.dateCreated} timestamp={params.row.createdAt} />
          },
          {
            flex: 0.16,
            minWidth: 150,
            field: 'creator',
            headerName: 'KASIR',
            sortable: false,
            renderCell: params => <PersonCell person={params.row.creator} />
          },
          {
            flex: 0.16,
            minWidth: 140,
            field: 'grandTotal',
            headerName: 'TOTAL PEMBELIAN',
            renderCell: params => (
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                {priceFormatWIthCurrency(params.row.grandTotal)}
              </Typography>
            )
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'totalItems',
            headerName: 'TOTAL ITEM',
            sortable: false,
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.totalItems || 0}
              </Typography>
            )
          },
          {
            flex: 0.12,
            minWidth: 110,
            field: 'status',
            headerName: 'STATUS',
            sortable: false,
            renderCell: params => <Status status={params.row.status} />
          },
          {
            flex: 0.08,
            minWidth: 80,
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
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
      />

      <ModalViewTransactionV4 setOpen={setOpenModalDetail} open={openModalDetail} disableActions={true} />
    </>
  )
}
