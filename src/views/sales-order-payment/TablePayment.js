import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import HandleSearh from 'src/helpers/handleSearch'
import { returnFormatTime } from 'src/helpers/formatDate'
import renderClient from 'src/helpers/renderClient'
import { priceFormat } from 'src/helpers/priceFormatter'
import TableHeaderPayment from './TableHeaderPayment'
import ModalAddPayment from './ModalAddPayment'

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

export default function TablePayment({ salesOrderData }) {
  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalView, setOpenModalView] = useState(false)
  const [detailPayment, setDetailPayment] = useState({})

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })

  const { dataSalesOrderPayment: data } = useSelector(state => state.salesOrderPayment)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({
      data,
      keys: ['typePayment', 'dateCreated'],
      searchValue,
      setData: setFilteredData
    })
  }

  const handleRowClick = params => {
    setDetailPayment(params?.row)
    setOpenModalView(true)
  }

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <Card>
      {openModalAdd && (
        <ModalAddPayment
          open={openModalAdd}
          setOpen={setOpenModalAdd}
          typeModal={'ADD'}
          salesOrderId={salesOrderData?.id}
          amountDebt={salesOrderData?.amountDebt}
          salesOrderCode={salesOrderData?.code}
        />
      )}
      {openModalView && (
        <ModalAddPayment
          open={openModalView}
          setOpen={setOpenModalView}
          typeModal={'VIEW'}
          salesOrderId={salesOrderData?.id}
          detailPayment={detailPayment}
        />
      )}
      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.1,
            minWidth: 200,
            field: 'typePayment',
            headerName: 'Tipe Pembayaran',
            cellClassName: {
              cursor: 'pointer'
            },
            renderCell: params => {
              return (
                <Typography style={{ cursor: 'pointer' }} variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.typePayment}
                </Typography>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 120,
            field: 'amount',
            headerName: 'Jumlah Pembayaran',
            cellClassName: {
              cursor: 'pointer'
            },
            renderCell: params => {
              return (
                <Typography style={{ cursor: 'pointer' }} variant='body2' sx={{ color: 'text.primary' }}>
                  Rp. {priceFormat(params.row.amount)}
                </Typography>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 120,
            field: 'createdAt',
            headerName: 'Tanggal Dibayar',
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
                  {renderClient(params)}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                      {row.createdBy.name}
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
            renderCell: params => <RowOptions handleView={() => handleRowClick(params)} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        onCellClick={handleRowClick}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderPayment }}
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
            placeholder: 'Cari Payment',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: setOpenModalAdd,
            data: salesOrderData
          }
        }}
      />
    </Card>
  )
}
