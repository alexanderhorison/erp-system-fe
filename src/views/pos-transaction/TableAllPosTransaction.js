import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import { returnFormatTime } from 'src/helpers/formatDate'
import { fetchAllPointOfSaleByWarehouseId, fetchDetailPointOfSale, printPos } from 'src/store/apps/pos'
import TableHeaderPosTransaction from './TableHeaderPosTransaction'
import ModalViewTransactionV2 from 'src/views/point-of-sale/transaction/ModalViewTransactionV2'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { Status } from 'src/@core/components/common'

const RowOptions = ({ handleView, handlePrint, data }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleView}>
          <Icon icon='tabler:eye' />
        </IconButton>
        {/* <IconButton onClick={handlePrint}>
          <Icon icon='tabler:printer' />
        </IconButton> */}
      </Box>
    </>
  )
}

export default function TableAllPosTransaction({ timeFilter }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })
  const [openModalDetail, setOpenModalDetail] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    paymentType: '',
    orderBy: 'createdAt',
    orderType: 'DESC'
  })

  const { dataPointOfSale: data, loadingDataPointOfSale: loading } = useSelector(state => state.pos)

  // Helper function to convert year/month to date filtering
  const filterByDateRange = useCallback((items, year, month) => {
    if (!year || !items) return items

    const yearNum = parseInt(year)

    return items.filter(item => {
      if (!item.createdAt) return false

      const itemDate = new Date(item.createdAt)
      const itemYear = itemDate.getFullYear()
      const itemMonth = itemDate.getMonth() + 1 // getMonth() returns 0-11

      if (month) {
        const monthNum = parseInt(month)
        return itemYear === yearNum && itemMonth === monthNum
      } else {
        return itemYear === yearNum
      }
    })
  }, [])

  // Apply all filters including search, payment type, and date range
  const filteredData = useMemo(() => {
    let result = data || []

    // Apply date range filter
    result = filterByDateRange(result, timeFilter?.year, timeFilter?.month)

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      result = result.filter(
        item =>
          item.code?.toLowerCase().includes(searchLower) ||
          item.creator?.name?.toLowerCase().includes(searchLower) ||
          item.warehouseName?.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter (PAID status)
    if (filters.paymentType) {
      result = result.filter(item => item.status === filters.paymentType)
    }

    return result
  }, [data, searchText, filters.paymentType, timeFilter?.year, timeFilter?.month, filterByDateRange])

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!filteredData) return []

    const sorted = [...filteredData].sort((a, b) => {
      const { orderBy, orderType } = filters

      let aValue, bValue

      if (orderBy === 'createdAt') {
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
      } else if (orderBy === 'grandTotal') {
        aValue = parseFloat(a.grandTotal) || 0
        bValue = parseFloat(b.grandTotal) || 0
      } else {
        aValue = a[orderBy]
        bValue = b[orderBy]
      }

      if (orderType === 'ASC') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return sorted
  }, [filteredData, filters])

  // Apply pagination on the frontend
  const paginatedData = useMemo(() => {
    const startIndex = paginationModel.page * paginationModel.pageSize
    const endIndex = startIndex + paginationModel.pageSize
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, paginationModel])

  // Debounced search function with proper cleanup
  const debouncedSearch = useMemo(() => {
    let timeoutId
    const fn = searchValue => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        // Reset to page 1 when searching
        setPaginationModel(prev => ({ ...prev, page: 0 }))
      }, 500)
    }

    // Add cancel function to clear timeout
    fn.cancel = () => {
      clearTimeout(timeoutId)
    }

    return fn
  }, [])

  const handleSearch = searchValue => {
    setSearchText(searchValue)

    if (searchValue === '') {
      // Cancel any pending debounced search
      debouncedSearch.cancel()

      // Reset pagination first
      setPaginationModel(prev => ({ ...prev, page: 0 }))
    } else {
      debouncedSearch(searchValue)
    }
  }

  const handleRowClick = params => {
    const id = params?.code || params?.row?.code
    setOpenModalDetail(true)
    dispatch(fetchDetailPointOfSale(id))
  }

  const handleRowPrint = async params => {
    dispatch(printPos(params.code))
  }

  const handlePaginationChange = newPaginationModel => {
    setPaginationModel(newPaginationModel)
  }

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))

    // Reset to page 1 when filtering
    setPaginationModel(prev => ({ ...prev, page: 0 }))
  }

  // Handle sorting
  const handleSortModelChange = sortModel => {
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0]
      const orderBy = field === 'createdAt' ? 'createdAt' : field === 'grandTotal' ? 'grandTotal' : 'createdAt'
      const orderType = sort.toUpperCase()

      setFilters(prev => ({
        ...prev,
        orderBy,
        orderType
      }))
    }
  }

  // Initial fetch when component mounts or warehouse changes
  useEffect(() => {
    const warehouseId = 6 // Fixed warehouse ID as per requirement
    dispatch(fetchAllPointOfSaleByWarehouseId(warehouseId))
  }, [dispatch])

  return (
    <Card>
      <DataGrid
        autoHeight
        loading={loading}
        rows={paginatedData || []}
        rowCount={sortedData?.length || 0}
        paginationMode='client'
        sortingMode='client'
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        onSortModelChange={handleSortModelChange}
        pageSizeOptions={[5, 10, 25, 50]}
        onCellClick={e => handleRowClick(e)}
        slots={{ toolbar: TableHeaderPosTransaction }}
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
            headerName: 'Tanggal Transaksi',
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
            flex: 0.16,
            minWidth: 120,
            field: 'creator',
            headerName: 'Kasir',
            renderCell: params => {
              const { row } = params

              return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                      {row.creator.name}
                    </Typography>
                    <Typography noWrap variant='caption'>
                      {row.creator.role}
                    </Typography>
                  </Box>
                </Box>
              )
            }
          },
          {
            flex: 0.16,
            minWidth: 120,
            field: 'grandTotal',
            headerName: 'Total Pembelian',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {priceFormatWIthCurrency(params.row.grandTotal)}
                </Typography>
              )
            }
          },
          {
            flex: 0.16,
            minWidth: 120,
            field: 'totalItems',
            headerName: 'Total Item',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.totalItems || 0}
                </Typography>
              )
            }
          },
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
                <RowOptions handleView={() => handleRowClick(row)} handlePrint={() => handleRowPrint(row)} data={row} />
              </div>
            )
          }
        ]}
        sx={{
          height: '100%',

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
            placeholder: 'Cari kode, kasir, atau gudang',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            filters: filters,
            onFilterChange: handleFilterChange
          }
        }}
      />
      <ModalViewTransactionV2 setOpen={setOpenModalDetail} open={openModalDetail} />
    </Card>
  )
}
