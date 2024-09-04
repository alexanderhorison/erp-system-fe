import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getInitials } from 'src/@core/utils/get-initials'

import { Box, Card, IconButton, Typography } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import TableHeaderChooseReceiveOrder from './TableHeaderChooseReceiveOrder'
import { fetchAllDeliveryOrder } from 'src/store/apps/delivery-order'
import HandleSearh from 'src/helpers/handleSearch'
import { returnFormatTime } from 'src/helpers/formatDate'

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
        <IconButton onClick={() => handleView()}>
          <Icon icon='tabler:eye' />
        </IconButton>
      </Box>
    </>
  )
}

export default function TableAllChooseReceiveOrder({}) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

  const { dataListDeliveryOrder: data, loadingDataListDeliveryOrder } = useSelector(state => state.deliveryOrder)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({
      data,
      keys: ['code', 'warehouseDestination', 'warehouseOrigin'],
      searchValue,
      setData: setFilteredData
    })
  }

  const handleRowClick = params => {
    const code = params.code
    router.push(`/receive-order/add/${code}`)
  }

  useEffect(() => {
    dispatch(
      fetchAllDeliveryOrder({
        receiveOrder: true
      })
    )
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <Card>
      <DataGrid
        autoHeight
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
          {
            flex: 0.16,
            minWidth: 120,
            field: 'warehouseOrigin',
            headerName: 'Gudang Sumber',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.warehouseOrigin}
                </Typography>
              )
            }
          },
          {
            flex: 0.16,
            minWidth: 120,
            field: 'warehouseDestination',
            headerName: 'Gudang Tujuan',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.warehouseDestination}
                </Typography>
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
        loading={loadingDataListDeliveryOrder}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onCellClick={params => handleRowClick(params.row)}
        slots={{ toolbar: TableHeaderChooseReceiveOrder }}
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
            placeholder: 'Cari surat jalan',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value)
          }
        }}
      />
    </Card>
  )
}
