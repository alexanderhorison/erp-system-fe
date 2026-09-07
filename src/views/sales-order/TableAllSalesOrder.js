import { useEffect, useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { Status } from 'src/@core/components/common'
import renderClient from 'src/helpers/renderClient'
import { fetchAllSalesOrder } from 'src/store/apps/sales-order'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import FilterPanel from 'src/views/common/FilterPanel'
import DateCell from 'src/views/common/DateCell'
import { monthOptions, yearOptions, currentYear } from 'src/views/common/filterOptions'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

const RowOptions = ({ handleView, handleEdit, data }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
    <Tooltip title='Lihat Detail'>
      <IconButton onClick={handleView} size='small'>
        <Icon icon='tabler:eye' fontSize='1.125rem' />
      </IconButton>
    </Tooltip>
    {data?.status === 'PENDING' && (
      <Tooltip title='Ubah'>
        <IconButton onClick={handleEdit} size='small'>
          <Icon icon='tabler:edit' fontSize='1.125rem' />
        </IconButton>
      </Tooltip>
    )}
  </Box>
)

export default function TableAllSalesOrder() {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })
  const [filterAnchor, setFilterAnchor] = useState(null)

  const [dataFilter, setDataFilter] = useState({
    month: '',
    year: currentYear,
    status: '',
    orderBy: 'createdAt',
    orderType: 'DESC'
  })

  const {
    dataSalesOrder: data,
    paginationSalesOrder: pagination,
    loadingDataSalesOrder: loading
  } = useSelector(state => state.salesOrder)

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
          { value: 'REJECTED', label: 'Rejected' },
          { value: 'SHIPPED', label: 'Shipped' }
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
      dispatch(fetchAllSalesOrder(params))
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

  const handleView = row => router.push(`/sales-order/${row.code}`)
  const handleEdit = row => router.push(`/sales-order/edit/${row.code}`)
  const handleAdd = () => router.push('/sales-order/add')
  const handleAddLoan = () => router.push('/sales-order/add-loan-stock')

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
    const orderBy = ['createdAt', 'approvedAt', 'shippingDate'].includes(field) ? field : 'createdAt'
    const orderType = sort.toUpperCase()
    const nextFilters = { ...dataFilter, orderBy, orderType }

    setDataFilter(nextFilters)
    fetchData({ page: 1, orderBy, orderType }, searchText, nextFilters, paginationModel)
  }

  // Initial fetch and fetch when the year/month filter changes.
  useEffect(() => {
    const dateRange = getDateRange(dataFilter.year, dataFilter.month)
    dispatch(
      fetchAllSalesOrder({
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
        itemLabel='sales order'
        loading={loading}
        rows={data || []}
        rowCount={pagination?.total || 0}
        paginationMode='server'
        sortingMode='server'
        getRowId={row => row.code}
        onRowClick={params => handleView(params.row)}
        onSortModelChange={handleSortModelChange}
        getRowClassName={params => {
          const amountDebt = params.row.amountDebt
          return amountDebt !== null && amountDebt !== 0 && amountDebt !== '0' ? 'row-with-debt' : ''
        }}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari sales order'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            onOpenFilters={setFilterAnchor}
            activeFilterCount={activeFilterCount}
            actions={
              <>
                <Button
                  variant='contained'
                  onClick={handleAddLoan}
                  startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
                >
                  Buat Sales Order Loan
                </Button>
                <Button
                  variant='contained'
                  onClick={handleAdd}
                  startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
                >
                  Buat Sales Order
                </Button>
              </>
            }
          />
        }
        columns={[
          {
            flex: 0.12,
            minWidth: 120,
            field: 'code',
            headerName: 'KODE',
            renderCell: params => (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {params.row.code}
                </Typography>
                {params.row.isLoanStockSO && (
                  <Typography noWrap sx={{ fontSize: '0.75rem', fontStyle: 'italic', color: colors.mutedForeground }}>
                    Loan Stock SO
                  </Typography>
                )}
              </Box>
            )
          },
          {
            flex: 0.15,
            minWidth: 140,
            field: 'createdAt',
            headerName: 'TANGGAL DIBUAT',
            renderCell: params => <DateCell date={params.row.dateCreated} timestamp={params.row.createdAt} />
          },
          {
            flex: 0.15,
            minWidth: 140,
            field: 'approvedAt',
            headerName: 'TANGGAL DITERIMA',
            renderCell: params => <DateCell date={params.row.dateApproved} timestamp={params.row.approvedAt} />
          },
          {
            flex: 0.15,
            minWidth: 140,
            field: 'shippingDate',
            headerName: 'TANGGAL DIKIRIM',
            renderCell: params => <DateCell date={params.row.shippingDate} timestamp={params.row.shippingTime} />
          },
          {
            flex: 0.16,
            minWidth: 150,
            field: 'createdBy',
            headerName: 'DIBUAT OLEH',
            sortable: false,
            renderCell: params => {
              const { row } = params
              return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {renderClient(params)}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography noWrap variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                      {row.createdBy.name}
                    </Typography>
                    <Typography noWrap sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground }}>
                      {row.createdBy.roleName}
                    </Typography>
                  </Box>
                </Box>
              )
            }
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
                <RowOptions handleView={() => handleView(row)} handleEdit={() => handleEdit(row)} data={row} />
              </Box>
            )
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        sx={{
          '& .MuiDataGrid-row': { cursor: 'pointer' },
          '& .row-with-debt': {
            backgroundColor: 'rgba(244, 67, 54, 0.08)',
            '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.12)' }
          }
        }}
      />
    </>
  )
}
