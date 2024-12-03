import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getInitials } from 'src/@core/utils/get-initials'

import { Box, Card, IconButton, Typography } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import HandleSearch from 'src/helpers/handleSearch'
import { returnFormatDateDay } from 'src/helpers/formatDate'
import { fetchDashboardSalesOrderOverDueDate } from 'src/store/apps/dashboard'

const renderClient = params => {
  const { row } = params
  const name = getInitials(row.creatorName ? row.creatorName : '-').slice(0, 2)
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
        <IconButton onClick={() => handleView()}>
          <Icon icon='tabler:eye' />
        </IconButton>
      </Box>
    </>
  )
}

export default function DashboardSo6() {
  const dispatch = useDispatch()
  const router = useRouter()

  // const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const { dataDashboardSalesOrderOverDueDate, loadingDashboardSalesOrderOverDueDate } = useSelector(state => state.dashboard)

  // const handleSearch = searchValue => {
  //   setSearchText(searchValue)
  //   HandleSearch({
  //     dataDashboardSalesOrderOverDueDate,
  //     keys: ['code', 'warehouseDestination', 'warehouseOrigin'],
  //     searchValue,
  //     setData: setFilteredData,
  //     timeFilter: timeFilter
  //   })
  // }

  const handleRowClick = params => {
    const code = params.code
    router.push(`/sales-order/${code}`)
  }

  useEffect(() => {
    dispatch(fetchDashboardSalesOrderOverDueDate({ page: paginationModel.page, limit: paginationModel.pageSize }))
  }, [dispatch, paginationModel.page, paginationModel.pageSize])

  useEffect(() => {
    setFilteredData(dataDashboardSalesOrderOverDueDate.data)
  }, [dataDashboardSalesOrderOverDueDate.data])

  return (
    <Card>
      <DataGrid
        autoHeight
        loading={loadingDashboardSalesOrderOverDueDate}
        pagination
        columns={[
          {
            flex: 0.1,
            minWidth: 100,
            field: 'code',
            headerName: 'Code',
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
                  <Typography noWrap variant='caption' sx={{ textAlign: 'center' }}>
                    {returnFormatDateDay(params.row.createdAt)}
                  </Typography>
                </Box>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 120,
            field: 'dueDate',
            headerName: 'Tanggal Jatuh Tempo',
            renderCell: params => {
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography noWrap variant='caption' sx={{ textAlign: 'center' }}>
                    {returnFormatDateDay(params.row.dueDate)}
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
                      {row.creatorName}
                    </Typography>
                    <Typography noWrap variant='caption'>
                      {row.creatorRole}
                    </Typography>
                  </Box>
                </Box>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => <RowOptions handleView={() => handleRowClick(row)} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onCellClick={params => handleRowClick(params.row)}
        slots={{ toolbar: TableHeader }}
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
            // value: searchText,
            placeholder: 'Cari surat jalan',
            // clearSearch: () => handleSearch(''),
            // onChange: event => handleSearch(event.target.value),
          }
        }}
      />
    </Card>
  )
}

const TableHeader = (props) => {
  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: theme => theme.spacing(2, 5, 4, 5)
      }}
    >
      <Typography variant='h5'>List SO Yang Melewati Batas Waktu</Typography>
    </Box>
  )
}
