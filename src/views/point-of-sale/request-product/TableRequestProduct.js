import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import HandleSearh from 'src/helpers/handleSearch'
import { returnFormatTime } from 'src/helpers/formatDate'
import { Status } from 'src/@core/components/common'
import TableHeaderRequestProduct from './TableHeaderRequestProduct'
import ModalAddRequestProduct from './ModalAddRequestProduct'
import { fetchDetailRequestOrder } from 'src/store/apps/product-request-order'


const RowOptions = ({ handleView, handleEdit, status }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleView}>
          <Icon icon='tabler:eye' />
        </IconButton>
        {status === 'PENDING' && (
          <IconButton onClick={handleEdit}>
            <Icon icon='tabler:edit' />
          </IconButton>
        )}
      </Box>
    </>
  )
}

export default function TableRequestProduct({ timeFilter, isMobile, isTablet, isLowHeight }) {
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: isLowHeight ? 5 : 10 })
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

  const handleEdit = row => {
    dispatch(fetchDetailRequestOrder(row.code))
    setTypeModal('EDIT')
    setOpenModalForm(true)
  }



  const handleView = row => {
    dispatch(fetchDetailRequestOrder(row.code))
    setTypeModal('VIEW')
    setOpenModalForm(true)
  }

  const handleRowClick = row => {
    handleView(row)
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
      <Card sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <DataGrid
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
              flex: 0.01,
              minWidth: 100,
              sortable: false,
              field: 'actions',
              headerName: 'Actions',
              renderCell: ({ row }) => (
                <div onClick={e => e.stopPropagation()}>
                  <RowOptions
                    handleView={() => handleView(row)}
                    handleEdit={() => handleEdit(row)}
                    status={row.status}
                  />
                </div>
              )
            }
          ]}
          pageSizeOptions={isLowHeight ? [5, 10] : [5, 10, 25]}
          onCellClick={({ row }) => handleView(row)}
          paginationModel={paginationModel}
          slots={{ toolbar: TableHeaderRequestProduct }}
          onPaginationModelChange={setPaginationModel}
          rows={filteredData}
          sx={{
            height: '100%',
            width: '100%',
            '& .MuiSvgIcon-root': {
              fontSize: '1.125rem'
            },
            '& .MuiDataGrid-cell': {
              cursor: 'pointer'
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid rgba(224, 224, 224, 1)',
              minHeight: isLowHeight ? '40px' : '52px',
              maxHeight: isLowHeight ? '40px' : '52px'
            },
            '& .MuiTablePagination-root': {
              fontSize: isLowHeight ? '0.75rem' : '0.875rem'
            },
            '& .MuiDataGrid-main': {
              overflow: 'hidden'
            },
            '& .MuiDataGrid-virtualScroller': {
              overflow: 'auto'
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
              handleAdd: () => {
                setOpenModalForm(true)
                setTypeModal('ADD')
              }
            }
          }}
        />
        <ModalAddRequestProduct open={openModalForm} setOpen={setOpenModalForm} typeModal={typeModal} />
      </Card>
    </>
  )
}
