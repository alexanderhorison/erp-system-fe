import { Card, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import TableHeaderMasterUnit from './TableHeaderMasterUnit'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { deleteMasterDataUnit, fetchMasterDataUnit, fetchMasterDataUnitDetail } from 'src/store/apps/master/unit'
import ModalConfirmation from 'src/views/common/ModalConfirmation'
import ModalAddMasterUnit from './ModalAddMasterUnit'

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
    dispatch(deleteMasterDataUnit(id))
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

export default function TableMasterUnit({}) {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalView, setOpenModalView] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const [unitId, setUnitId] = useState('')
  const { data } = useSelector(state => state.unit)

  const handleEdit = id => {
    setUnitId(id)
    dispatch(fetchMasterDataUnitDetail(id))
    setOpenModalEdit(true)
  }

  const handleView = id => {
    setUnitId(id)
    dispatch(fetchMasterDataUnitDetail(id))
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
    dispatch(fetchMasterDataUnit())
  }, [])
  return (
    <Card>
      {openModalEdit && (
        <ModalAddMasterUnit open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={unitId} />
      )}
      {openModalAdd && <ModalAddMasterUnit open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      {openModalView && (
        <ModalAddMasterUnit open={openModalView} setOpen={setOpenModalView} typeModal={'VIEW'} id={unitId} />
      )}

      <DataGrid
        autoHeight
        columns={[
          {
            flex: 0.1,
            minWidth: 200,
            field: 'name',
            headerName: 'Nama Unit',
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
            field: 'description',
            headerName: 'Deskripsi',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.description}
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
        slots={{ toolbar: TableHeaderMasterUnit }}
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
