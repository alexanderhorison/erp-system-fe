import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { fetchDeleteProductWarehouse, fetchListProductByWarehouse, fetchListProductTransformation, fetchProductWarehouseDetail } from 'src/store/apps/product-warehouse'
import { fetchMasterDataWarehouseRack } from 'src/store/apps/master/warehouse-rack'
import { fetchDataMasterCategory } from 'src/store/apps/master/category'
import { fetchMasterDataType } from 'src/store/apps/master/type'
import { fetchMasterDataCompany } from 'src/store/apps/master/company'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'
import ModalAdjustProduct from './ModalAdjustProduct'
import HandleSearh from 'src/helpers/handleSearch'
import ModalTransformationProduct from './ModalTransformationProduct'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import FilterPanel from 'src/views/common/FilterPanel'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

const RowOptions = ({ id, name, warehouseId, query, onViewDetail }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openModalTransformation, setOpenModalTransformation] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const [typeModal, setTypeModal] = useState('')

  const { loadingDeleteProduct } = useSelector(state => state.productWarehouse)

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

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again.
  const handleDelete = () => {
    dispatch(fetchDeleteProductWarehouse({ id, name, warehouseId, query }))
    setOpenConfirmDelete(false)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Tooltip title='Transform Product'>
          <IconButton onClick={handleTransform} size='small'>
            <Icon icon='lucide:arrow-left-right' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        {/* Add/subtract/minimum stock now share one dialog; the direction is
            chosen with a radio inside it. */}
        <Tooltip title='Adjust Stock'>
          <IconButton onClick={() => handleEdit('PLUS')} size='small'>
            <Icon icon='lucide:package-open' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        {/* Replaces the "Details" text link that used to sit under the product
            name, so the row keeps every action in one place. */}
        <Tooltip title='Stock History'>
          <IconButton onClick={onViewDetail} size='small'>
            <Icon icon='lucide:file-clock' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Delete'>
          <IconButton onClick={() => setOpenConfirmDelete(true)} size='small' sx={{ color: 'error.main' }}>
            <Icon icon='tabler:trash' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
      </Box>

      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title='Delete Product'
        itemName={name}
        loading={loadingDeleteProduct}
      />
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

export default function TableProduct({ data, warehouseId, onExport, isExporting }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })
  const [dataFilter, setDataFilter] = useState({})
  const [filterAnchor, setFilterAnchor] = useState(null)

  const { data: category } = useSelector(state => state.category)
  const { data: type } = useSelector(state => state.type)
  const { data: company } = useSelector(state => state.company)
  const { data: unit } = useSelector(state => state.unit)
  const { data: rack } = useSelector(state => state.masterWarehouseRack)

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

  // ** Option lists were previously fetched by `FilterGlobal`; the filter popover
  // is presentational, so the page owns them now.
  useEffect(() => {
    dispatch(fetchDataMasterCategory())
    dispatch(fetchMasterDataType())
    dispatch(fetchMasterDataCompany())
    dispatch(fetchMasterDataUnit())
    if (warehouseId) dispatch(fetchMasterDataWarehouseRack(warehouseId))
  }, [dispatch, warehouseId])

  const toOptions = list => (list || []).map(item => ({ value: item.id, label: item.name }))

  const filterFields = useMemo(
    () => [
      { name: 'companyId', label: 'Company', type: 'select', options: toOptions(company) },
      { name: 'typeId', label: 'Type', type: 'select', options: toOptions(type) },
      { name: 'unitId', label: 'Unit', type: 'select', options: toOptions(unit) },
      { name: 'categoryId', label: 'Category', type: 'select', options: toOptions(category) },
      { name: 'warehouseRackId', label: 'Rack', type: 'select', options: toOptions(rack) }
    ],
    [company, type, unit, category, rack]
  )

  const activeFilterCount = Object.values(dataFilter).filter(Boolean).length

  const submitFilter = (query) => {
    dispatch(fetchListProductByWarehouse({ warehouseId, query }))
  }

  const clickDetail = (id) => {
    router.push(`/product-warehouse/product/${id}`)
  }

  return (
    <>
      <FilterPanel
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        fields={filterFields}
        value={dataFilter}
        onApply={next => {
          setDataFilter(next)
          submitFilter(next)
        }}
        onReset={() => {
          setDataFilter({})
          dispatch(fetchListProductByWarehouse({ warehouseId }))
        }}
      />

      <DataTable
        itemLabel='products'
        getRowId={getRowId}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Search product or unit'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            onOpenFilters={setFilterAnchor}
            activeFilterCount={activeFilterCount}
            actions={
              <>
                {onExport && (
                  <Button
                    variant='contained'
                    onClick={onExport}
                    disabled={isExporting}
                    startIcon={<Icon icon='tabler:download' fontSize='1rem' />}
                  >
                    {isExporting ? 'Exporting...' : 'Export Current Stock'}
                  </Button>
                )}
                <Button variant='contained' onClick={handleAdd} startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}>
                  Add Product
                </Button>
              </>
            }
          />
        }
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
            headerName: 'Product Name',
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
            minWidth: 150,
            field: 'companyName',
            headerName: 'Company',
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
            headerName: 'Rack',
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
            headerName: 'Unit',
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
            headerName: 'Quantity',
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
            headerName: 'Minimum Stock',
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
            headerName: 'Action',
            renderCell: ({ row }) => (
              <RowOptions
                id={row.productWarehouseId}
                name={row.productName}
                warehouseId={warehouseId}
                query={dataFilter}
                onViewDetail={() => clickDetail(row.productWarehouseId)}
              />
            )
          }
        ]}
        pageSizeOptions={[25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
        getRowClassName={getRowClassName}
      />
    </>
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
