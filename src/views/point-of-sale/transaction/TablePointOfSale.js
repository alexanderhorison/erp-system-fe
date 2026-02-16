import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import HandleSearh from 'src/helpers/handleSearch'
import { returnFormatTime } from 'src/helpers/formatDate'
import { Status } from 'src/@core/components/common'
import TableHeaderPointOfSale from './TableHeaderPointOfSale'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { fetchDetailPointOfSale, printPos } from 'src/store/apps/pos'
import ModalViewTransactionV4 from './ModalViewTransactionV4'

const RowOptions = ({ handleView, handlePrint }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleView}>
          <Icon icon='tabler:eye' />
        </IconButton>
        <IconButton onClick={handlePrint}>
          <Icon icon='tabler:printer' />
        </IconButton>
      </Box>
    </>
  )
}

export default function TablePointOfSale({ timeFilter, isMobile, isTablet, isLowHeight }) {
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: isLowHeight ? 5 : 10 })
  const [openModalDetail, setOpenModalDetail] = useState(false)

  const { dataPointOfSale: data, loadingDataPointOfSale } = useSelector(state => state.pos)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({
      data,
      keys: ['code', 'dateCreated'],
      searchValue,
      setData: setFilteredData,
      timeFilter: timeFilter
    })
  }

  const handleRowClick = params => {
    const id = params?.code || params?.row?.code
    setOpenModalDetail(true)
    dispatch(fetchDetailPointOfSale(id))
  }

  const handleRowPrint = async params => {
    dispatch(printPos(params.code))
  }

  useEffect(() => {
    if (timeFilter && timeFilter.year) {
      const filtered = data.filter(item => {
        const itemDate = new Date(item.createdAt)
        const itemYear = itemDate.getFullYear() // Get the year from createdAt
        const itemMonth = itemDate.getMonth() // Get the month from createdAt (0-based index)

        // Compare it with timeFilter.year and timeFilter.month (if provided)
        const matchesYear = itemYear === parseInt(timeFilter.year)
        const matchesMonth = timeFilter.month ? itemMonth === parseInt(timeFilter.month - 1) : true

        return matchesYear && matchesMonth
      })
      setFilteredData(filtered)
    } else {
      setFilteredData(data) // If no year filter, show all data
    }
  }, [data, timeFilter])

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <DataGrid
          loading={loadingDataPointOfSale}
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
              flex: 0.16,
              minWidth: 120,
              field: 'creator',
              headerName: 'Dibuat Oleh',
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
              flex: 0.15,
              minWidth: 120,
              field: 'shift',
              headerName: 'Shift',
              renderCell: params => {
                const { row } = params
                console.log(row)
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {row.shift ? (
                        <>
                          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                            {row.shift.shiftName}
                          </Typography>
                          <Typography noWrap variant='caption'>
                            {row.shift.startShift} - {row.shift.endShift}
                          </Typography>
                        </>
                      ) : (
                        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                          -
                        </Typography>
                      )}
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
                    {params.row.totalItems}
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
                  <RowOptions
                    handleView={() => handleRowClick(row)}
                    handlePrint={() => handleRowPrint(row)}
                    data={row}
                  />
                </div>
              )
            }
          ]}
          pageSizeOptions={isLowHeight ? [5, 10] : [5, 10, 25]}
          onCellClick={e => handleRowClick(e)}
          paginationModel={paginationModel}
          slots={{ toolbar: TableHeaderPointOfSale }}
          onPaginationModelChange={setPaginationModel}
          rows={filteredData}
          sx={{
            height: '100%',
            '& .MuiSvgIcon-root': {
              fontSize: '1.125rem'
            },
            '& .MuiDataGrid-cell': {
              cursor: 'pointer'
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid rgba(224, 224, 224, 1)',
              minHeight: isLowHeight ? '40px' : '52px'
            },
            '& .MuiTablePagination-root': {
              fontSize: isLowHeight ? '0.75rem' : '0.875rem'
            }
          }}
          slotProps={{
            baseButton: {
              size: 'medium',
              variant: 'outlined'
            },
            toolbar: {
              value: searchText,
              placeholder: 'Cari point of sale',
              clearSearch: () => handleSearch(''),
              onChange: event => handleSearch(event.target.value)
            }
          }}
        />
        <ModalViewTransactionV4 setOpen={setOpenModalDetail} open={openModalDetail} />
      </Card>
    </>
  )
}
