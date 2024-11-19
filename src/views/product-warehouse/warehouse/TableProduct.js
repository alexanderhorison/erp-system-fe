import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, Card, Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'

import TableHeaderProduct from './TableHeaderProduct'
import { fetchDeleteProductWarehouse, fetchListProductByWarehouse, fetchListProductTransformation, fetchProductWarehouseDetail } from 'src/store/apps/product-warehouse'
import ModalAdjustProduct from './ModalAdjustProduct'
import HandleSearh from 'src/helpers/handleSearch'
import ModalTransformationProduct from './ModalTransformationProduct'
import FilterGlobal from 'src/pages/components/filter/FilterGlobal'

const RowOptions = ({ id, name, warehouseId, query }) => {

  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openModalTransformation, setOpenModalTransformation] = useState(false)
  const [typeModal, setTypeModal] = useState('')

  const handleTransform = () => {
    dispatch(fetchProductWarehouseDetail(id))
    dispatch(fetchListProductTransformation(id))
    setOpenModalTransformation(true)
  }

  const handleEdit = type => {
    dispatch(fetchProductWarehouseDetail(id))
    setTypeModal(type)
    setOpenModalEdit(true)
  }

  const handleDelete = () => {
    dispatch(fetchDeleteProductWarehouse({ id, name, warehouseId, query }))
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleTransform}>
          <Icon icon='tabler:transfer' />
        </IconButton>
        <IconButton onClick={() => handleEdit('PLUS')}>
          <Icon icon='tabler:plus' />
        </IconButton>
        <IconButton onClick={() => handleEdit('MINUS')}>
          <Icon icon='tabler:minus' />
        </IconButton>
        <IconButton onClick={() => handleEdit('MINIMUM_STOCK')}>
          <Icon icon='tabler:edit' />
        </IconButton>
        <IconButton onClick={() => handleDelete()}>
          <Icon icon='tabler:trash' />
        </IconButton>
      </Box>
      {openModalEdit && (
        <ModalAdjustProduct
          open={openModalEdit}
          setOpen={setOpenModalEdit}
          typeModal={typeModal}
          warehouseId={warehouseId}
        />
      )}

      {openModalTransformation && (
        <ModalTransformationProduct
          open={openModalTransformation}
          setOpen={setOpenModalTransformation}
          typeModal={typeModal}
          warehouseId={warehouseId}
        />
      )}

    </>
  )
}

export default function TableProduct({ data, warehouseId }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })
  const [dataFilter, setDataFilter] = useState({})

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ["productName", "unitName"], searchValue, setData: setFilteredData })
  }

  const handleAdd = () => {
    router.push(`/product-warehouse/warehouse/${warehouseId}/add`)
  }

  const getRowId = row => {
    return row.productWarehouseId
  }

  useEffect(() => {
    setFilteredData(data)
  }, [dispatch, data])

  const submitFilter = (query) => {
    dispatch(fetchListProductByWarehouse({ warehouseId, query }))
  }

  const clickDetail = (id) => {
    router.push(`/product-warehouse/product/${id}`)
  }

  return (
    <Card>
      <FilterGlobal
        listFilter={["company", "type", "unit", "category", "rack"]}
        submitFilter={(e) => {
          setDataFilter(e)
          submitFilter(e)
        }}
        handleClear={() => dispatch(fetchListProductByWarehouse({ warehouseId }))}
        warehouseId={warehouseId}
      />
      <Divider />
      <DataGrid
        autoHeight
        getRowId={getRowId}
        columns={[
          {
            flex: 0.05,
            minWidth: 70,
            field: 'productWarehouseId',
            headerName: 'Id',
            renderCell: params => {
              return (
                <>
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.productWarehouseId}
                  </Typography>
                </>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 300,
            field: 'productName',
            headerName: 'Nama Produk',
            renderCell: params => {
              return (
                <Grid container flex={0.1} >
                  <Typography variant="body2" sx={{
                    color: 'text.primary',
                  }}>
                    {params.row.productName}
                  </Typography>
                  <Typography fontSize={12} sx={{ cursor: 'pointer', ":hover": { color: 'info.main' } }} onClick={() => clickDetail(params?.row?.productWarehouseId)}>
                    Details
                  </Typography>
                </Grid>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 150,
            field: 'companyName',
            headerName: 'Perusahaan',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.companyName}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'rackName',
            headerName: 'Rak',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.rackName}
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
            field: 'minimumStock',
            headerName: 'Stok Minimum',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.minimumStock}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 210,
            sortable: false,
            field: 'actions',
            headerAlign: 'center',
            headerName: 'Actions',
            renderCell: ({ row }) => (
              <RowOptions id={row.productWarehouseId} name={row.productName} warehouseId={warehouseId} query={dataFilter} />
            )
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderProduct }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        getRowClassName={getRowClassName}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "normal",
            lineHeight: "normal"
          },
          "& .MuiDataGrid-columnHeader": {
            height: "unset !important"
          },
          "& .MuiDataGrid-columnHeaders": {
            maxHeight: "168px !important"
          }
        }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            value: searchText,
            placeholder: 'Cari nama produk atau satuan',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            handleAdd: handleAdd
          }
        }}
      />
    </Card>
  )
}

const getRowClassName = params => {
  if (params.row.quantity === 0) {
    return 'zero-quantity'
  }
  if (params.row.quantity < params.row.minimumStock) {
    return 'low-quantity'
  }
  return ''
}