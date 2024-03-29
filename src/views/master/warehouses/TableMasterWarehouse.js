import { Card, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import TableHeaderMasterWarehouse from './TableHeaderMasterWarehouse'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { deleteMasterDataWarehouse, fetchMasterDataWarehouse, fetchMasterDataWarehouseDetail } from 'src/store/apps/master/warehouse'
import ModalConfirmation from 'src/views/common/ModalConfirmation'
import ModalAddMasterWarehouse from './ModalAddMasterWarehouse'

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
    dispatch(deleteMasterDataWarehouse(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <ModalConfirmation
        open={openModalConfirm}
        setOpen={setModalConfirm}
        handleAgree={handleDelete}
        title={'Yakin menghapus tipe?'}
        content={`Anda ingin menghapus tipe ${name}`}
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

export default function TableMasterWarehouse({}) {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalView, setOpenModalView] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const [warehouseId, setWarehouseId] = useState('')
  const { data } = useSelector(state => state.warehouse)

  const handleEdit = id => {
    setWarehouseId(id)
    dispatch(fetchMasterDataWarehouseDetail(id))
    setOpenModalEdit(true)
  }

  const handleView = id => {
    setWarehouseId(id)
    dispatch(fetchMasterDataWarehouseDetail(id))
    setOpenModalView(true)
  }

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
    dispatch(fetchMasterDataWarehouse())
  }, [])
  return (
    <Card>
      {openModalEdit && (
        <ModalAddMasterWarehouse open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={warehouseId} />
      )}
      {openModalAdd && <ModalAddMasterWarehouse open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      {openModalView && (
        <ModalAddMasterWarehouse open={openModalView} setOpen={setOpenModalView} typeModal={'VIEW'} id={warehouseId} />
      )}

      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.1,
            minWidth: 200,
            field: 'name',
            headerName: 'Nama Gudang',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.name}
                </Typography>
              )
            }
          },
          {
            flex: 0.2,
            minWidth: 120,
            field: 'location',
            headerName: 'Lokasi',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.location}
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
        slots={{ toolbar: TableHeaderMasterWarehouse }}
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
            placeholder: 'Cari nama tipe',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: setOpenModalAdd
          }
        }}
      />
    </Card>
  )
}
