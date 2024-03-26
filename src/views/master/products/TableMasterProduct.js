import { Card, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import TableHeaderMasterProduct from './TableHeaderMasterProduct'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { deleteMasterDataProduct, fetchMasterDataProduct } from 'src/store/apps/master/product'
import ModalConfirmation from 'src/views/common/ModalConfirmation'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  // ** Hooks

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

  const handleEdit = () => {
    console.log('Edit' + id)
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
        <MenuItem onClick={handleEdit} sx={{ '& svg': { mr: 2 } }}>
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
const columns = [
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
          {params.row.Category.name}
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
          {params.row.Type.name}
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
    renderCell: ({ row }) => <RowOptions id={row.id} name={row.name} />
  }
]

export default function TableMasterProduct({ openModalAdd, setOpenModalAdd }) {
  const dispatch = useDispatch()
  //   const [data] = useState(rows)
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const { data } = useSelector(state => state.masterProduct)
  // console.log(data)

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
  }, [])
  return (
    <Card>
      <DataGrid
        autoHeight
        columns={columns}
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
