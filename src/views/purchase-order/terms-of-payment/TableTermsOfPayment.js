import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

import HandleSearh from 'src/helpers/handleSearch'
import { returnFormatDateDay } from 'src/helpers/formatDate'
import ModalAddTermsOfPayment from './ModalAddTermsOfPayment'
import TableHeaderTermsOfPayment from './TableHeaderTermsOfPayment'
import { deleteTermsOfPayment } from 'src/store/apps/purchase-order/terms-of-payment'

const RowOptions = ({ handleView, handleEdit, handleDelete }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleView}>
          <Icon icon='tabler:eye' />
        </IconButton>
        <IconButton>
          <Icon icon='tabler:edit' onClick={handleEdit} />
        </IconButton>
        <IconButton>
          <Icon icon='tabler:trash' onClick={handleDelete} />
        </IconButton>
      </Box>
    </>
  )
}

export default function TableTermsOfPayment({ purchaseOrderData }) {
  const dispatch = useDispatch()
  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalView, setOpenModalView] = useState(false)
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const [detailTermsOfPayment, setDetailTermsOfPayment] = useState({})

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })

  const { dataTermsOfPayment: data } = useSelector(state => state.termsOfPayment)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({
      data,
      keys: ['title'],
      searchValue,
      setData: setFilteredData
    })
  }

  const handleView = params => {
    setDetailTermsOfPayment(params?.row)
    setOpenModalView(true)
  }

  const handleEdit = params => {
    setDetailTermsOfPayment(params?.row)
    setOpenModalEdit(true)
  }

  const handleDelete = params => {
    dispatch(deleteTermsOfPayment({ purchaseOrderCode: purchaseOrderData?.code, id: params?.row?.id }))
  }

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <Card>
      {openModalAdd && (
        <ModalAddTermsOfPayment
          open={openModalAdd}
          setOpen={setOpenModalAdd}
          typeModal={'ADD'}
          purchaseOrderId={purchaseOrderData?.id}
          purchaseOrderCode={purchaseOrderData?.code}
        />
      )}
      {openModalView && (
        <ModalAddTermsOfPayment
          open={openModalView}
          setOpen={setOpenModalView}
          typeModal={'VIEW'}
          purchaseOrderId={purchaseOrderData?.id}
          detailTermsOfPayment={detailTermsOfPayment}
          purchaseOrderCode={purchaseOrderData?.code}
        />
      )}
      {openModalEdit && (
        <ModalAddTermsOfPayment
          open={openModalEdit}
          setOpen={setOpenModalEdit}
          typeModal={'EDIT'}
          purchaseOrderId={purchaseOrderData?.id}
          detailTermsOfPayment={detailTermsOfPayment}
          purchaseOrderCode={purchaseOrderData?.code}
        />
      )}
      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.15,
            minWidth: 200,
            field: 'title',
            headerName: 'Judul',
            cellClassName: {
              cursor: 'pointer'
            },
            renderCell: params => {
              return (
                <Typography style={{ cursor: 'pointer' }} variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.title}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'dueDate',
            headerName: 'Tengat Waktu',
            renderCell: params => {
              return (
                <Typography style={{ cursor: 'pointer' }} variant='body2' sx={{ color: 'text.primary' }}>
                  {returnFormatDateDay(params.row.dueDate)}
                </Typography>
              )
            }
          },
          {
            flex: 0.05,
            minWidth: 120,
            field: 'reminderDate',
            headerName: 'Reminder',
            renderCell: params => {
              return (
                <Typography style={{ cursor: 'pointer' }} variant='body2' sx={{ color: 'text.primary' }}>
                  {`H - ${params.row.reminderDate}`}
                </Typography>
              )
            }
          },
          {
            flex: 0.05,
            minWidth: 120,
            field: 'isSendEmail',
            headerName: 'Kirim Email',
            renderCell: params => {
              return (
                <Typography style={{ cursor: 'pointer' }} variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.isSendEmail ? 'Ya' : 'Tidak'}
                </Typography>
              )
            }
          },
          {
            flex: 0.07,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: params => <RowOptions
              handleView={() => handleView(params)}
              handleEdit={() => handleEdit(params)}
              handleDelete={() => handleDelete(params)}
            />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        // onCellClick={handleView}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderTermsOfPayment }}
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
            placeholder: 'Cari Judul',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            handleAdd: setOpenModalAdd,
            data: data
          }
        }}
      />
    </Card>
  )
}
