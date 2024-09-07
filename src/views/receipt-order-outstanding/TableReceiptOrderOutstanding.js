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
import { fetchAllReceiptOrderOutstanding } from 'src/store/apps/receipt-order-outstanding'
import TableHeaderReceiptOrderOutstanding from './TableHeaderReceiptOrderOutstanding'

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
        <IconButton >
          <Icon icon='tabler:eye' />
        </IconButton>
      </Box>
    </>
  )
}

export default function TableReceiptOrderOutstanding({ }) {
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
      setData: setFilteredData
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
    setFilteredData(data)
  }, [data])

  return (
    <Card>
      <DataGrid
        autoHeight
        loading={loading}
        columns={[
          {
            flex: 0.2,
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
          {
            flex: 0.07,
            minWidth: 120,
            field: 'status',
            headerName: 'Status',
            renderCell: params => {
              const { row } = params
              return (
                <Status
                  status={row.status}
                />
              )
            }
          },
          {
            flex: 0.20,
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
            // handleAdd: handleAdd
          }
        }}
      />
    </Card>
  )
}
