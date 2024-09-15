import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getInitials } from 'src/@core/utils/get-initials'

import { Box, Card, IconButton, Typography } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import TableHeaderReceive from './TableHeaderReceive'
import HandleSearh from 'src/helpers/handleSearch'
import { returnFormatTime } from 'src/helpers/formatDate'
import { fetchAllReceiveOrder } from 'src/store/apps/receive-order'

const renderClient = params => {
  const { row } = params
  const name = getInitials(row.createdBy.name ? row.createdBy.name : '-').slice(0, 2)
  const stateNum = 5
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  return (
    <CustomAvatar skin='light' color={color} sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}>
      {name}
    </CustomAvatar>
  )
}

const RowOptions = ({ handleView }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleView}>
          <Icon icon='tabler:eye' />
        </IconButton>
      </Box>
    </>
  )
}

export default function TableAllReceive({ timeFilter }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const { dataListOrderReceive: data, loadingDataListOrderReceive } = useSelector(state => state.receiveOrder)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({
      data,
      keys: ['codeReceipt', 'codeDeliveryOrder'],
      searchValue,
      setData: setFilteredData,
      timeFilter: timeFilter
    })
  }

  const handleRowClick = params => {
    const code = params.codeReceipt
    router.push(`/receive-order/${code}`)
  }

  const handleAdd = () => {
    router.push(`/receive-order/add`)
  }

  useEffect(() => {
    dispatch(fetchAllReceiveOrder())
  }, [dispatch])

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
    <Card>
      <DataGrid
        autoHeight
        loading={loadingDataListOrderReceive}
        columns={[
          {
            flex: 0.2,
            minWidth: 100,
            field: 'codeReceipt',
            headerName: 'Code Receipt',
            cellClassName: {
              cursor: 'pointer'
            },
            renderCell: params => {
              return (
                <Typography style={{ cursor: 'pointer' }} variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.codeReceipt}
                </Typography>
              )
            }
          },
          {
            flex: 0.2,
            minWidth: 100,
            field: 'codeDeliveryOrder',
            headerName: 'Code Delivery Order',
            cellClassName: {
              cursor: 'pointer'
            },
            renderCell: params => {
              return (
                <Typography style={{ cursor: 'pointer' }} variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.codeDeliveryOrder}
                </Typography>
              )
            }
          },
          {
            flex: 0.2,
            minWidth: 120,
            field: 'createdAt',
            headerName: 'Tanggal Dibuat',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.createdAt}
                  </Typography>
                  <Typography noWrap variant='caption' sx={{ textAlign: 'center' }}>
                    {returnFormatTime(params.row.dateCreated)}
                  </Typography>
                </Box>
              )
            }
          },
          // {
          //   flex: 0.15,
          //   minWidth: 120,
          //   field: 'receivedAt',
          //   headerName: 'Tanggal Diterima',
          //   renderCell: params => {
          //     return (
          //       <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          //         <Typography variant='body2' sx={{ color: 'text.primary' }}>
          //           {params.row.receivedAt}
          //         </Typography>
          //         <Typography noWrap variant='caption' sx={{ textAlign: 'center' }}>
          //           {returnFormatTime(params.row.dateReceived)}
          //         </Typography>
          //       </Box>
          //     )
          //   }
          // },
          {
            flex: 0.2,
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
          //   field: 'warehouseOrigin',
          //   headerName: 'Gudang Sumber',
          //   renderCell: params => {
          //     return (
          //       <Typography variant='body2' sx={{ color: 'text.primary' }}>
          //         {params.row.warehouseOrigin}
          //       </Typography>
          //     )
          //   }
          // },
          // {
          //   flex: 0.16,
          //   minWidth: 120,
          //   field: 'warehouseDestination',
          //   headerName: 'Gudang Tujuan',
          //   renderCell: params => {
          //     return (
          //       <Typography variant='body2' sx={{ color: 'text.primary' }}>
          //         {params.row.warehouseDestination}
          //       </Typography>
          //     )
          //   }
          // },
          // {
          //   flex: 0.07,
          //   minWidth: 120,
          //   field: 'status',
          //   headerName: 'Status',
          //   renderCell: params => {
          //     const { row } = params
          //     return (
          //       <CustomChip
          //         rounded
          //         size='small'
          //         skin='light'
          //         color={row.status === 'PENDING' ? 'info' : 'success'}
          //         label={row.status}
          //         sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          //       />
          //     )
          //   }
          // },
          {
            flex: 0.2,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => <RowOptions handleView={() => handleRowClick(row)} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        onCellClick={params => handleRowClick(params.row)}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderReceive }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
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
            placeholder: 'Cari penerimaan surat jalan',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            handleAdd: handleAdd
          }
        }}
      />
    </Card>
  )
}
