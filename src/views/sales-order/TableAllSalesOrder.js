import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import { returnFormatTime } from 'src/helpers/formatDate'
import { Status } from 'src/@core/components/common'
import renderClient from 'src/helpers/renderClient'
import { fetchAllSalesOrder } from 'src/store/apps/sales-order'
import TableHeaderSalesOrder from './TableHeaderSalesOrder'

const RowOptions = ({ handleView, handleEdit, data }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleView}>
          <Icon icon='tabler:eye' />
        </IconButton>
        {data?.status === 'PENDING' && (
          <IconButton onClick={handleEdit}>
            <Icon icon='tabler:edit' />
          </IconButton>
        )}
      </Box>
    </>
  )
}

export default function TableAllSalesOrder({ timeFilter }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    orderBy: 'createdAt',
    orderType: 'DESC'
  })

  const {
    dataSalesOrder: data,
    paginationSalesOrder: pagination,
    loadingDataSalesOrder: loading
  } = useSelector(state => state.salesOrder)

  // Helper function to convert year/month to dateFrom/dateTo
  const getDateRange = useCallback((year, month) => {
    if (!year) return {}

    const yearNum = parseInt(year)

    // Format to YYYY-MM-DD without timezone issues
    const formatDate = (year, month, day) => {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }

    if (month) {
      const monthNum = parseInt(month)

      // Start of specific month (always day 1)
      const dateFrom = formatDate(yearNum, monthNum, 1)

      // End of specific month - calculate last day
      // Create date object for next month, then subtract 1 day
      const lastDayOfMonth = new Date(yearNum, monthNum, 0).getDate()
      const dateTo = formatDate(yearNum, monthNum, lastDayOfMonth)

      return {
        dateFrom,
        dateTo
      }
    } else {
      // Start of year (January 1)
      const dateFrom = formatDate(yearNum, 1, 1)
      // End of year (December 31)
      const dateTo = formatDate(yearNum, 12, 31)

      return {
        dateFrom,
        dateTo
      }
    }
  }, [])

  // Centralized fetch function to avoid duplication
  const fetchData = useCallback(
    (
      customParams = {},
      currentSearchText = searchText,
      currentFilters = filters,
      currentPaginationModel = paginationModel
    ) => {
      const dateRange = getDateRange(timeFilter?.year, timeFilter?.month)
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
    [dispatch, timeFilter?.year, timeFilter?.month]
  )

  // Debounced search function with proper cleanup
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId
      const fn = searchValue => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          // Reset to page 1 when searching
          setPaginationModel(prev => ({ ...prev, page: 0 }))

          fetchData({ search: searchValue, page: 1 }, searchValue, filters, paginationModel)
        }, 500)
      }

      // Add cancel function to clear timeout
      fn.cancel = () => {
        clearTimeout(timeoutId)
      }

      return fn
    })(),
    [fetchData, filters, paginationModel]
  )

  const handleSearch = searchValue => {
    setSearchText(searchValue)

    if (searchValue === '') {
      // Cancel any pending debounced search
      debouncedSearch.cancel()

      // Reset pagination first
      setPaginationModel(prev => ({ ...prev, page: 0 }))

      // Clear search immediately
      fetchData({ page: 1 }, '', filters, paginationModel)
    } else {
      debouncedSearch(searchValue)
    }
  }

  const handleRowClick = params => {
    const id = params?.code || params?.row?.code
    router.push(`/sales-order/${id}`)
  }

  const handleRowEdit = params => {
    const id = params?.code || params?.row?.code
    router.push(`/sales-order/edit/${id}`)
  }

  const handleAdd = () => {
    router.push(`/sales-order/add`)
  }

  const handlePaginationChange = newPaginationModel => {
    setPaginationModel(newPaginationModel)

    fetchData(
      {
        page: newPaginationModel.page + 1, // Backend expects 1-based pagination
        limit: newPaginationModel.pageSize
      },
      searchText,
      filters,
      newPaginationModel
    )
  }

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))

    // Reset to page 1 when filtering
    setPaginationModel(prev => ({ ...prev, page: 0 }))

    const newFilters = { ...filters, [filterType]: value }
    fetchData(
      {
        page: 1,
        ...(newFilters.status && { status: newFilters.status }),
        orderBy: newFilters.orderBy,
        orderType: newFilters.orderType
      },
      searchText,
      newFilters,
      paginationModel
    )
  }

  // Handle sorting
  const handleSortModelChange = sortModel => {
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0]
      const orderBy =
        field === 'createdAt'
          ? 'createdAt'
          : field === 'approvedAt'
          ? 'approvedAt'
          : field === 'shippingDate'
          ? 'shippingDate'
          : 'createdAt'
      const orderType = sort.toUpperCase()

      const newFilters = {
        ...filters,
        orderBy,
        orderType
      }

      setFilters(newFilters)

      fetchData(
        {
          page: 1,
          orderBy,
          orderType
        },
        searchText,
        newFilters,
        paginationModel
      )
    }
  }

  // Initial fetch and fetch when time filter changes
  useEffect(() => {
    const dateRange = getDateRange(timeFilter?.year, timeFilter?.month)
    const params = {
      page: 1,
      limit: 25,
      orderBy: 'createdAt',
      orderType: 'DESC',
      ...dateRange,
      paginate: true
    }
    dispatch(fetchAllSalesOrder(params))
  }, [dispatch, timeFilter?.year, timeFilter?.month])

  return (
    <Card>
      <DataGrid
        autoHeight
        loading={loading}
        rows={data || []}
        rowCount={pagination?.total || 0}
        paginationMode='server'
        sortingMode='server'
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        onSortModelChange={handleSortModelChange}
        pageSizeOptions={[5, 10, 25, 50]}
        onCellClick={e => handleRowClick(e)}
        slots={{ toolbar: TableHeaderSalesOrder }}
        columns={[
          {
            flex: 0.1,
            minWidth: 100,
            field: 'code',
            headerName: 'Kode',
            cellClassName: {
              cursor: 'pointer'
            },
            renderCell: params => {
              return (
                <Typography style={{ cursor: 'pointer' }} variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.code}
                </Typography>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 120,
            field: 'createdAt',
            headerName: 'Tanggal Dibuat',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.dateCreated}
                  </Typography>
                  <Typography noWrap variant='caption' sx={{ textAlign: 'center' }}>
                    {returnFormatTime(params.row.createdAt)}
                  </Typography>
                </Box>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 120,
            field: 'approvedAt',
            headerName: 'Tanggal Diterima',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.dateApproved}
                  </Typography>
                  <Typography noWrap variant='caption' sx={{ textAlign: 'center' }}>
                    {returnFormatTime(params.row.approvedAt)}
                  </Typography>
                </Box>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 120,
            field: 'shippingDate',
            headerName: 'Tanggal Dikirim',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.shippingDate}
                  </Typography>
                  <Typography noWrap variant='caption' sx={{ textAlign: 'center' }}>
                    {returnFormatTime(params.row.shippingTime)}
                  </Typography>
                </Box>
              )
            }
          },
          {
            flex: 0.16,
            minWidth: 120,
            field: 'createdBy',
            headerName: 'Dibuat Oleh',
            renderCell: params => {
              const { row } = params
              return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {renderClient(params)}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                      {row.createdBy.name}
                    </Typography>
                    <Typography noWrap variant='caption'>
                      {row.createdBy.roleName}
                    </Typography>
                  </Box>
                </Box>
              )
            }
          },
          // {
          //   flex: 0.16,
          //   minWidth: 120,
          //   field: 'warehouseName',
          //   headerName: 'Gudang',
          //   renderCell: params => {
          //     return (
          //       <Typography variant='body2' sx={{ color: 'text.primary' }}>
          //         {params.row.warehouseName}
          //       </Typography>
          //     )
          //   }
          // },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'status',
            headerName: 'Status',
            renderCell: params => {
              const { row } = params
              return <Status status={row.status} />
            }
          },
          {
            flex: 0.01,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => (
              <div onClick={e => e.stopPropagation()}>
                <RowOptions handleView={() => handleRowClick(row)} handleEdit={() => handleRowEdit(row)} data={row} />
              </div>
            )
          }
        ]}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          },
          '& .MuiDataGrid-cell': {
            cursor: 'pointer'
          }
        }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            value: searchText,
            placeholder: 'Cari sales order',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            handleAdd: handleAdd,
            filters: filters,
            onFilterChange: handleFilterChange
          }
        }}
      />
    </Card>
  )
}
