import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'

import { deleteMasterDataProduct, fetchMasterDataProduct } from 'src/store/apps/master/product'
import TableHeaderProduct from './TableHeaderProduct'
import ModalAddProduct from './ModalAdjustProduct'
import { fetchProductWarehouseDetail } from 'src/store/apps/product-warehouse'

const RowOptions = ({ id, name, WarehouseId }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleDelete = () => {
    dispatch(deleteMasterDataProduct(id))
  }

  const handleEdit = () => {
    dispatch(fetchProductWarehouseDetail(id))
    setOpenModalEdit(true)
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
      {openModalEdit && (
        <ModalAddProduct open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} WarehouseId={WarehouseId} />
      )}
    </>
  )
}

export default function TableProduct({ data, WarehouseId }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    if (searchValue.length) {
      const filteredRows = data.filter(row => row.productName.toLowerCase().includes(searchValue.toLowerCase()))
      setFilteredData(filteredRows)
    } else {
      setFilteredData([])
    }
  }

  const handleAdd = () => {
    router.push(`/product-warehouse/warehouse/${WarehouseId}/add`)
  }

  const getRowId = row => {
    return row.ProductWarehouseId
  }

  useEffect(() => {
    dispatch(fetchMasterDataProduct())
  }, [dispatch])

  return (
    <Card>
      {openModalAdd && (
        <ModalAddProduct open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} WarehouseId={WarehouseId} />
      )}
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
              <RowOptions id={row.ProductWarehouseId} name={row.productName} WarehouseId={WarehouseId} />
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
            handleAdd: handleAdd,
          }
        }}
      />
    </Card>
  )
}
