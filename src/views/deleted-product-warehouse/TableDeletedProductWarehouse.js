import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, Card, Divider, Grid, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'

import HandleSearh from 'src/helpers/handleSearch'
import FilterGlobal from 'src/pages/components/filter/FilterGlobal'
import TableHeaderDeletedProductWarehouse from './TableHeaderDeletedProductWarehouse'
import { fetchListDeletedProductWarehouse, restoreDeletedProduct } from 'src/store/apps/deleted-product-warehouse'

const RowOptions = ({ id, name, query }) => {
  const dispatch = useDispatch()

  const handleRestore = () => {
    dispatch(restoreDeletedProduct({ id, query, name }))
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={() => handleRestore()}>
        <Icon icon='tabler:restore' />
      </IconButton>
    </Box>
  )
}

export default function TableDeletedProductWarehouse({ data }) {
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

  const getRowId = row => {
    return row.productWarehouseId
  }

  useEffect(() => {
    setFilteredData(data);
  }, [dispatch, data]);

  const submitFilter = (query) => {
    dispatch(fetchListDeletedProductWarehouse({ query }))
  }

  const clickDetail = (id) => {
    router.push(`/product-warehouse/product/${id}`)
  }

  return (
    <Card>
      <FilterGlobal
        listFilter={["warehouse", "unit"]}
        submitFilter={(e) => {
          setDataFilter(e)
          submitFilter(e)
        }}
        handleClear={() => dispatch(fetchListDeletedProductWarehouse({}))}
        dataFilter={dataFilter}
        isQuery
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
            field: 'warehouseName',
            headerName: 'Gudang',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.warehouseName}
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
            flex: 0.07,
            minWidth: 70,
            sortable: false,
            field: 'actions',
            headerAlign: 'center',
            align: 'center',
            headerName: 'Actions',
            renderCell: ({ row }) => (
              <RowOptions id={row.productWarehouseId} name={row.productName} query={dataFilter} />
            )
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: TableHeaderDeletedProductWarehouse }}
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