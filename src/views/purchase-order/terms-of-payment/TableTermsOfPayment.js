import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import HandleSearh from 'src/helpers/handleSearch'
import { returnFormatDateDay } from 'src/helpers/formatDate'
import ModalAddTermsOfPayment from './ModalAddTermsOfPayment'
import { deleteTermsOfPayment } from 'src/store/apps/purchase-order/terms-of-payment'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

const RowOptions = ({ handleView, handleEdit, handleDelete, title }) => {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)

  return (
    <>
      <Box onClick={event => event.stopPropagation()} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Tooltip title='Lihat'>
          <IconButton onClick={handleView} size='small'>
            <Icon icon='tabler:eye' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Ubah'>
          <IconButton onClick={handleEdit} size='small'>
            <Icon icon='tabler:edit' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Hapus'>
          <IconButton onClick={() => setOpenConfirmDelete(true)} size='small' sx={{ color: 'error.main' }}>
            <Icon icon='tabler:trash' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
      </Box>

      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={() => {
          handleDelete()
          setOpenConfirmDelete(false)
        }}
        title='Hapus Terms Of Payment'
        itemName={title}
      />
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
    HandleSearh({ data, keys: ['title'], searchValue, setData: setFilteredData })
  }

  const handleView = row => {
    setDetailTermsOfPayment(row)
    setOpenModalView(true)
  }

  const handleEdit = row => {
    setDetailTermsOfPayment(row)
    setOpenModalEdit(true)
  }

  const handleDelete = row => {
    dispatch(deleteTermsOfPayment({ purchaseOrderCode: purchaseOrderData?.code, id: row?.id }))
  }

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <>
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

      <DataTable
        itemLabel='terms of payment'
        getRowId={row => row.id}
        onRowClick={params => handleView(params.row)}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari judul'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            actions={
              <Button
                variant='contained'
                onClick={() => setOpenModalAdd(true)}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Buat Termin Pembayaran
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.24,
            minWidth: 180,
            field: 'title',
            headerName: 'JUDUL',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.title}
              </Typography>
            )
          },
          {
            flex: 0.22,
            minWidth: 170,
            field: 'dueDate',
            headerName: 'TENGGAT WAKTU',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {returnFormatDateDay(params.row.dueDate)}
              </Typography>
            )
          },
          {
            flex: 0.14,
            minWidth: 110,
            field: 'reminderDate',
            headerName: 'REMINDER',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {`H-${params.row.reminderDate}`}
              </Typography>
            )
          },
          {
            flex: 0.14,
            minWidth: 110,
            field: 'isSendEmail',
            headerName: 'KIRIM EMAIL',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.isSendEmail ? 'Ya' : 'Tidak'}
              </Typography>
            )
          },
          {
            flex: 0.12,
            minWidth: 110,
            sortable: false,
            field: 'actions',
            headerName: 'ACTION',
            renderCell: ({ row }) => (
              <Box onClick={event => event.stopPropagation()} sx={{ width: '100%' }}>
                <RowOptions
                  handleView={() => handleView(row)}
                  handleEdit={() => handleEdit(row)}
                  handleDelete={() => handleDelete(row)}
                  title={row.title}
                />
              </Box>
            )
          }
        ]}
        pageSizeOptions={[25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
      />
    </>
  )
}
