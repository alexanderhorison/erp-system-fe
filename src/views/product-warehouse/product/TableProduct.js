import { Box, Card, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import {
  deleteMasterDataProduct,
  fetchMasterDataProduct,
  fetchMasterDataProductDetail
} from 'src/store/apps/master/product'
import TableHeaderProduct from './TableHeaderProduct'

const RowOptions = ({ id, name, handleEdit }) => {
  const dispatch = useDispatch()

  const handleDelete = () => {
    dispatch(deleteMasterDataProduct(id))
  }

  return (
    <>
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

export default function TableProduct({ data }) {
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

  const handleSearch = searchValue => {
    setSearchText(searchValue)

    if (searchValue.length) {
      const filteredRows = data.filter(row => row.productName.toLowerCase().includes(searchValue.toLowerCase()))
      setFilteredData(filteredRows)
    } else {
      setFilteredData([])
    }
  }

  const getRowId = row => {
    // Assuming "ProductWarehouseId" is a unique identifier
    return row.ProductWarehouseId
  }

  useEffect(() => {
    dispatch(fetchMasterDataProduct())
  }, [dispatch])
  return (
    <Card>
      <DataGrid
        autoHeight
        getRowId={getRowId}
        
        columns={[
          {
            flex: 0.4,
            minWidth: 300,
            field: 'productName',
            headerName: 'Nama Produk',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.productName}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'categoryName',
            headerName: 'Kategori',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.categoryName}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'unitName',
            headerName: 'Satuan',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.unitName}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'typeName',
            headerName: 'Tipe',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.typeName}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'quantity',
            headerName: 'Kuantiti',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.quantity}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'minimum_stock',
            headerName: 'Stok Minimum',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.minimum_stock}
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
        slots={{ toolbar: TableHeaderProduct }}
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
