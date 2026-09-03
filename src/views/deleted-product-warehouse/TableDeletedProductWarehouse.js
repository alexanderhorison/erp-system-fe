import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import HandleSearh from 'src/helpers/handleSearch'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import { fetchListDeletedProductWarehouse, restoreDeletedProduct } from 'src/store/apps/deleted-product-warehouse'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import FilterPanel from 'src/views/common/FilterPanel'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

const RowOptions = ({ id, name, query, onViewDetail }) => {
  const dispatch = useDispatch()
  const [openConfirmRestore, setOpenConfirmRestore] = useState(false)
  const { loadingRestoreProduct } = useSelector(state => state.deletedProductWarehouse)

  // ** `swalConfirmationRestore` used to prompt before sending; it no longer
  // does (see docs/REVAMP_BASELINE.md §4), so the restore is confirmed here.
  const handleRestore = () => {
    dispatch(restoreDeletedProduct({ id, query, name }))
    setOpenConfirmRestore(false)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Tooltip title='Riwayat Stok'>
          <IconButton onClick={onViewDetail} size='small'>
            <Icon icon='lucide:file-clock' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Kembalikan Produk'>
          <IconButton onClick={() => setOpenConfirmRestore(true)} size='small'>
            <Icon icon='lucide:database-backup' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
      </Box>

      <ConfirmDialog
        open={openConfirmRestore}
        onClose={() => setOpenConfirmRestore(false)}
        onConfirm={handleRestore}
        title='Kembalikan Produk'
        description={`Anda akan mengembalikan produk ${name}. Produk akan kembali muncul di daftar gudang.`}
        confirmLabel='Kembalikan'
        cancelLabel='Batal'
        confirmIcon='lucide:database-backup'
        destructive={false}
        loading={loadingRestoreProduct}
        loadingLabel='Memproses...'
      />
    </>
  )
}

export default function TableDeletedProductWarehouse({ data }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })
  const [dataFilter, setDataFilter] = useState({})
  const [filterAnchor, setFilterAnchor] = useState(null)

  const { data: warehouse } = useSelector(state => state.warehouse)
  const { data: unit } = useSelector(state => state.unit)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['productName', 'unitName'], searchValue, setData: setFilteredData })
  }

  const getRowId = row => row.productWarehouseId

  // ** Option lists were previously fetched by `FilterGlobal`; the filter
  // popover is presentational, so the page owns them now.
  useEffect(() => {
    dispatch(fetchMasterDataWarehouse())
    dispatch(fetchMasterDataUnit())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [dispatch, data])

  const toOptions = list => (list || []).map(item => ({ value: item.id, label: item.name }))

  const filterFields = useMemo(
    () => [
      { name: 'warehouseId', label: 'Gudang', type: 'select', options: toOptions(warehouse) },
      { name: 'unitId', label: 'Satuan', type: 'select', options: toOptions(unit) }
    ],
    [warehouse, unit]
  )

  const activeFilterCount = Object.values(dataFilter).filter(Boolean).length

  // ** Filtering is server-side here: the list endpoint takes the query.
  const submitFilter = query => {
    dispatch(fetchListDeletedProductWarehouse({ query }))
  }

  const clickDetail = id => {
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
          dispatch(fetchListDeletedProductWarehouse({}))
        }}
      />

      <DataTable
        itemLabel='produk'
        getRowId={getRowId}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari nama produk atau satuan'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            onOpenFilters={setFilterAnchor}
            activeFilterCount={activeFilterCount}
          />
        }
        columns={[
          {
            flex: 0.08,
            minWidth: 80,
            field: 'productWarehouseId',
            headerName: 'ID',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.productWarehouseId}
              </Typography>
            )
          },
          {
            flex: 0.34,
            minWidth: 240,
            field: 'productName',
            headerName: 'NAMA PRODUK',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.productName}
              </Typography>
            )
          },
          {
            flex: 0.14,
            minWidth: 110,
            field: 'unitName',
            headerName: 'SATUAN',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.unitName}
              </Typography>
            )
          },
          {
            flex: 0.18,
            minWidth: 140,
            field: 'warehouseName',
            headerName: 'GUDANG',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.warehouseName}
              </Typography>
            )
          },
          {
            flex: 0.12,
            minWidth: 100,
            field: 'quantity',
            headerName: 'KUANTITI',
            renderCell: params => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.quantity}
              </Typography>
            )
          },
          {
            flex: 0.14,
            minWidth: 110,
            sortable: false,
            field: 'actions',
            headerName: 'ACTION',
            renderCell: ({ row }) => (
              <RowOptions
                id={row.productWarehouseId}
                name={row.productName}
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
      />
    </>
  )
}
