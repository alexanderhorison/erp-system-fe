import { Box, Card, IconButton, Typography } from '@mui/material'
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
import ModalAddMasterProduct from './ModalAddMasterProduct'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleDelete = () => {
    dispatch(deleteMasterDataProduct({id, name}))
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataProductDetail(id))
    setOpenModalEdit(true)
  }

  return (
    <>
      {openModalEdit && (
        <ModalAddMasterProduct open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleEdit}>
          <Icon icon='tabler:edit' />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <Icon icon='tabler:trash' />
        </IconButton>
      </Box>
    </>
  )
}

export default function TableMasterProduct({}) {
  const dispatch = useDispatch()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

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
      {openModalAdd && <ModalAddMasterProduct open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
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
            minWidth: 120,
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
            flex: 0.1,
            minWidth: 110,
            field: 'description',
            headerName: 'Dekripsi Produk',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.description || '-'}
                </Typography>
              )
            }
          },
          {
            flex: 0.01,
            minWidth: 120,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => <RowOptions id={row.id} name={row.name} />
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
