import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import { returnFormatTime } from 'src/helpers/formatDate'
import { Status } from 'src/@core/components/common'
import renderClient from 'src/helpers/renderClient'
import { fetchAllSalesOrder } from 'src/store/apps/sales-order'
import { usePagination } from 'src/helpers/usePagination'
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

  // Initialize pagination helper - don't include empty status in initial filters
  const {
    searchText,
    paginationModel,
    filters,
    handleSearch,
    handlePaginationChange,
    handleFilterChange,
    handleSortModelChange,
    fetchData,
    initialFetch
  } = usePagination(
    fetchAllSalesOrder,
    dispatch,
    { orderBy: 'createdAt', orderType: 'DESC' }, // Remove status: '' from initial filters
    { page: 0, pageSize: 25 }
  )

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

  // Enhanced handleSearch with timeFilter integration
  const handleSearchWithTimeFilter = useCallback((searchValue) => {
    const dateRange = getDateRange(timeFilter?.year, timeFilter?.month)
    if (searchValue === '') {
      handleSearch('')
      // Add timeFilter to clear search, exclude empty status
      const cleanParams = { page: 1, ...dateRange }
      fetchData(cleanParams, '')
    } else {
      // Let the helper handle debounced search, then add timeFilter
      handleSearch(searchValue)
    }
  }, [handleSearch, fetchData, getDateRange, timeFilter?.year, timeFilter?.month])

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

  // Enhanced pagination change with timeFilter integration
  const handlePaginationChangeWithTimeFilter = useCallback((newPaginationModel) => {
    const dateRange = getDateRange(timeFilter?.year, timeFilter?.month)
    handlePaginationChange(newPaginationModel)
    // Add timeFilter to pagination change, let helper handle empty status filtering
    fetchData(
      {
        page: newPaginationModel.page + 1,
        limit: newPaginationModel.pageSize,
        ...dateRange
      },
      searchText,
      filters,
      newPaginationModel
    )
  }, [handlePaginationChange, fetchData, getDateRange, timeFilter?.year, timeFilter?.month, searchText, filters])

  // Enhanced filter change with timeFilter integration
  const handleFilterChangeWithTimeFilter = useCallback((filterType, value) => {
    const dateRange = getDateRange(timeFilter?.year, timeFilter?.month)

    // For status filter, when empty, we need to completely remove it from filters
    if (filterType === 'status' && value === '') {
      // Use handleFilterChange with null to remove the filter completely
      handleFilterChange(filterType, null, dateRange)
    } else {
      handleFilterChange(filterType, value, dateRange)
    }
  }, [handleFilterChange, getDateRange, timeFilter?.year, timeFilter?.month])

  // Enhanced sort change with timeFilter integration and allowed fields
  const handleSortModelChangeWithTimeFilter = useCallback((sortModel) => {
    const allowedOrderBy = ['createdAt', 'approvedAt', 'shippingDate']
    const dateRange = getDateRange(timeFilter?.year, timeFilter?.month)
    handleSortModelChange(sortModel, allowedOrderBy)
    // Add timeFilter to sort change, let helper handle empty status filtering
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0]
      const orderBy = allowedOrderBy.includes(field) ? field : 'createdAt'
      const orderType = sort.toUpperCase()
      fetchData({
        page: 1,
        orderBy,
        orderType,
        ...dateRange
      })
    }
  }, [handleSortModelChange, fetchData, getDateRange, timeFilter?.year, timeFilter?.month])

  // Initial fetch and fetch when time filter changes
  useEffect(() => {
    const dateRange = getDateRange(timeFilter?.year, timeFilter?.month)
    // Ensure we don't send empty status on initial fetch
    const cleanParams = { ...dateRange }
    initialFetch(cleanParams)
  }, [initialFetch, timeFilter?.year, timeFilter?.month, getDateRange])

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
        onPaginationModelChange={handlePaginationChangeWithTimeFilter}
        onSortModelChange={handleSortModelChangeWithTimeFilter}
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
            clearSearch: () => handleSearchWithTimeFilter(''),
            onChange: event => handleSearchWithTimeFilter(event.target.value),
            handleAdd: handleAdd,
            filters: filters,
            onFilterChange: handleFilterChangeWithTimeFilter
          }
        }}
      />
    </Card>
  )
}
