import { Card, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import TableHeaderMasterProduct from './TableHeaderMasterProduct'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import {
  deleteMasterDataProduct,
  fetchMasterDataProduct,
  fetchMasterDataProductDetail
} from 'src/store/apps/master/product'
import ModalConfirmation from 'src/views/common/ModalConfirmation'
import ModalAddMasterProduct from './ModalAddMasterProduct'

const RowOptions = ({ id, name, handleEdit, handleView }) => {
  const dispatch = useDispatch()
  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [openModalConfirm, setModalConfirm] = useState(false)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteMasterDataProduct(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <ModalConfirmation
        open={openModalConfirm}
        setOpen={setModalConfirm}
        handleAgree={handleDelete}
        title={'Yakin menghapus produk?'}
        content={`Anda ingin menghapus produk ${name}`}
      />
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          sx={{ '& svg': { mr: 2 } }}
          onClick={() => {
            setAnchorEl(null)
            handleView(id)
          }}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null)
            handleEdit(id)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setModalConfirm(true)
            handleRowOptionsClose()
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

export default function TableMasterProduct({}) {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalView, setOpenModalView] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const [productId, setProductId] = useState('')

  const handleEdit = id => {
    setProductId(id)
    dispatch(fetchMasterDataProductDetail(id))
    setOpenModalEdit(true)
  }

  const handleView = id => {
    setProductId(id)
    dispatch(fetchMasterDataProductDetail(id))
    setOpenModalView(true)
  }

  const { data } = useSelector(state => state.masterProduct)

  const handleSearch = searchValue => {
    setSearchText(searchValue)

    if (searchValue.length) {
      const filteredRows = data.filter(row => row.name.toLowerCase().includes(searchValue.toLowerCase()))
      setFilteredData(filteredRows)
    } else {
      setFilteredData([])
    }
  }

  useEffect(() => {
    dispatch(fetchMasterDataProduct())
  }, [dispatch])
  return (
    <Card>
      {openModalEdit && (
        <ModalAddMasterProduct open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={productId} />
      )}
      {openModalAdd && <ModalAddMasterProduct open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      {openModalView && (
        <ModalAddMasterProduct open={openModalView} setOpen={setOpenModalView} typeModal={'VIEW'} id={productId} />
      )}

      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.2,
            minWidth: 200,
            field: 'name',
            headerName: 'Nama Produk',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.name}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'category',
            headerName: 'Kategori',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.category}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 110,
            field: 'type',
            headerName: 'Tipe',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.type}
                </Typography>
              )
            }
          },
          {
            flex: 0.01,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => (
              <RowOptions id={row.id} name={row.name} handleEdit={handleEdit} handleView={handleView} />
            )
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderMasterProduct }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData.length ? filteredData : data}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          }
        }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            value: searchText,
            placeholder: 'Cari nama produk',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: setOpenModalAdd
          }
        }}
      />
    </Card>
  )
}
