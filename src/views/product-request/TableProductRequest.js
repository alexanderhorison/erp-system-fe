import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Button, Card, IconButton, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'

import { DataGrid } from '@mui/x-data-grid'

import HandleSearh from 'src/helpers/handleSearch'
import { returnFormatTime } from 'src/helpers/formatDate'
import { Status } from 'src/@core/components/common'
import { fetchDetailRequestOrder, updateRequestOrder } from 'src/store/apps/product-request-order'
import TableHeaderRequestProduct from '../point-of-sale/request-product/TableHeaderRequestProduct'
import { useRouter } from 'next/router'


const RowOptions = ({ handleView, handleProcess, status, handleReject }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {
          status === 'PENDING' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button color={'success'} variant='contained' size='small' onClick={handleProcess}>
                Process
              </Button>
              <Button color={'error'} variant='contained' size='small' onClick={handleReject}>
                Reject
              </Button>
            </Box>
          )
        }
        {
          status !== 'PENDING' && (
            <IconButton onClick={handleView}>
              <Icon icon='tabler:eye' />
            </IconButton>
          )
        }
      </Box>
    </>
  )
}

export default function TableRequestProduct({ timeFilter }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [openModalForm, setOpenModalForm] = useState(false)
  const [typeModal, setTypeModal] = useState('ADD')


  const { dataRequestOrder: data, loadingDataRequestOrder } = useSelector(state => state.productRequest)

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

  const handleProcessRequest = row => {
    const id = row?.code;
    router.push(`/product-request/process/${id}`)
  }

  const handleView = row => {
    const id = row?.code;
    router.push(`/product-request/${id}`)
  }

  const handleRejectRequest = (code) => {
    dispatch(updateRequestOrder({ code, type: 'REJECT' }))
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
      <Card >
        <DataGrid
          autoHeight
          loading={loadingDataRequestOrder}
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
              field: 'createdBy',
              headerName: 'Dibuat Oleh',
              renderCell: params => {
                const { row } = params
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                        {row.createdBy.name}
                      </Typography>
                      <Typography noWrap variant='caption'>
                        {row.createdBy.role}
                      </Typography>
                    </Box>
                  </Box>
                )
              }
            },
            {
              flex: 0.16,
              minWidth: 120,
              field: 'approvedBy',
              headerName: 'Diproses Oleh',
              renderCell: params => {
                const { row } = params
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                        {row.approvedBy.name}
                      </Typography>
                      <Typography noWrap variant='caption'>
                        {row.approvedBy.role}
                      </Typography>
                    </Box>
                  </Box>
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
              flex: 0.15,
              minWidth: 100,
              sortable: false,
              field: 'actions',
              headerAlign: 'center',
              align: 'center',
              headerName: 'Actions',
              renderCell: ({ row }) => (
                <div onClick={e => e.stopPropagation()}>
                  <RowOptions
                    handleView={() => handleView(row)}
                    handleProcess={() => handleProcessRequest(row)}
                    status={row.status}
                    handleReject={() => handleRejectRequest(row.code)}
                  />
                </div>
              )
            }
          ]}
          pageSizeOptions={[5, 10]}
          onCellClick={e => handleRowClick(e)}
          paginationModel={paginationModel}
          slots={{ toolbar: TableHeaderRequestProduct }}
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
              placeholder: 'Cari request produk',
              clearSearch: () => handleSearch(''),
              onChange: event => handleSearch(event.target.value),
            }
          }}
        />
        {/* <ModalAddRequestProduct open={openModalForm} setOpen={setOpenModalForm} typeModal={typeModal} /> */}
      </Card>
    </>
  )
}
