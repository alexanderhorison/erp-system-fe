import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getInitials } from 'src/@core/utils/get-initials'

import { Box, Card, IconButton, Typography } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import HandleSearh from 'src/helpers/handleSearch'
import { returnFormatDate, returnFormatDateDay, returnFormatTime } from 'src/helpers/formatDate'
import { Status } from 'src/@core/components/common'
import { fetchAllReceiptOrderOutstanding } from 'src/store/apps/receipt-order-outstanding'
import TableHeaderReceiptOrderOutstanding from './TableHeaderReceiptOrderOutstanding'

const renderClient = ({ name }) => {
  const initial = getInitials(name ? name : '-').slice(0, 2)
  const stateNum = 5
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  return (
    <CustomAvatar skin='light' color={color} sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}>
      {initial}
    </CustomAvatar>
  )
}

const RowOptions = ({ handleView }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton >
          <Icon icon='tabler:eye' />
        </IconButton>
      </Box>
    </>
  )
}

export default function TableReceiptOrderOutstanding({ timeFilter }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const { data, loading } = useSelector(state => state.deliveryOrderReceiptOutstanding)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({
      data,
      keys: ['code'],
      searchValue,
      setData: setFilteredData,
      timeFilter: timeFilter
    })
  }

  const handleRowClick = params => {
    const code = params.row.code
    router.push(`/receipt-order-outstanding/${code}`)
  }

  useEffect(() => {
    dispatch(fetchAllReceiptOrderOutstanding())
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
        loading={loading}
        columns={[
          {
            flex: 0.15,
            minWidth: 100,
            field: 'code',
            headerName: 'Code Outstanding',
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
            minWidth: 100,
            field: 'deliveryOrderReceiptCode',
            headerName: 'Kode penerimaan surat jalan',
            renderCell: params => {
              return (
                <Typography style={{ cursor: 'pointer' }} variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.deliveryOrderReceiptCode}
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
                  <Typography variant='body2' sx={{ color: 'text.primary', textAlign: 'center' }}>
                    {returnFormatDateDay(params.row.createdAt)}
                  </Typography>
                  <Typography noWrap variant='caption' sx={{ textAlign: 'center' }}>
                    {returnFormatTime(params.row.createdAt)}
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
            flex: 0.15,
            minWidth: 120,
            field: 'createdBy',
            headerName: 'Dibuat Oleh',
            renderCell: params => {
              const { row } = params
              return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {renderClient({ name: row.createdBy.name })}
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
          {
            flex: 0.18,
            minWidth: 120,
            field: 'approvedBy',
            headerName: 'Diselesaikan Oleh',
            renderCell: params => {
              const { row } = params
              return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {renderClient({ name: row?.approvedBy?.name })}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                      {row?.approvedBy?.name || '-'}
                    </Typography>
                    <Typography noWrap variant='caption'>
                      {row?.approvedBy?.roleName || '-'}
                    </Typography>
                  </Box>
                </Box>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 120,
            field: 'status',
            headerName: 'Status',
            renderCell: params => {
              const { row } = params
              return <Status status={row.status} />
            }
          },
          {
            flex: 0.15,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => <RowOptions handleView={() => handleRowClick(row)} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        onCellClick={handleRowClick}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderReceiptOrderOutstanding }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          },
          '& .MuiDataGrid-cell': {
            cursor: 'pointer'
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal',
            lineHeight: 'normal'
          },
          '& .MuiDataGrid-columnHeader': {
            height: 'unset !important'
          },
          '& .MuiDataGrid-columnHeaders': {
            maxHeight: '168px !important'
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
            onChange: event => handleSearch(event.target.value)
            // handleAdd: handleAdd
          }
        }}
      />
    </Card>
  )
}
