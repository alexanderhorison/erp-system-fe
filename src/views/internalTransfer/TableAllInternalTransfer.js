import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getInitials } from 'src/@core/utils/get-initials'

import { Box, Card, IconButton, Typography } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import HandleSearh from 'src/helpers/handleSearch'
import { returnFormatTime } from 'src/helpers/formatDate'
import { Status } from 'src/@core/components/common'
import TableHeaderInternalTransfer from './TableHeaderInternalTransfer'
import { fetchAllInternalTransfer } from 'src/store/apps/internal-transfer'

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

export default function TableAllInternalTransfer({}) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })

  const { dataInternalTransfer: data } = useSelector(state => state.internalTransfer)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({
      data,
      keys: ['code', 'warehouseOriginName'],
      searchValue,
      setData: setFilteredData
    })
  }

  const handleRowClick = params => {
    const id = params?.code || params?.row?.code
    router.push(`/internal-transfer/${id}`)
  }

  const handleAdd = () => {
    router.push(`/internal-transfer/add`)
  }

  useEffect(() => {
    dispatch(fetchAllInternalTransfer())
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
            field: 'warehouseOriginName',
            headerName: 'Gudang',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.warehouseOriginName}
                </Typography>
              )
            }
          },
          {
            flex: 0.07,
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
            renderCell: ({ row }) => <RowOptions handleView={() => handleRowClick(row)} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        onCellClick={handleRowClick}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderInternalTransfer }}
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
            placeholder: 'Cari internal transfer',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            handleAdd: handleAdd
          }
        }}
      />
    </Card>
  )
}
