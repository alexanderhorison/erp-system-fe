import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import TableHeaderMasterWarehouseRack from './TableHeaderMasterWarehouseRack'
import { deleteMasterDataWarehouseRack, fetchMasterDataWarehouseRack } from 'src/store/apps/master/warehouse-rack'

const RowOptions = ({ id, name, warehouseId }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleDelete = () => {
    dispatch(deleteMasterDataWarehouseRack({ id, name, warehouseId }))
  }

  const handleEdit = () => {
    router.push(`/master/warehouses/${warehouseId}/edit/${id}`)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: -3 }}>
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

export default function TableMasterWarehouseRack({ warehouseId }) {
  const dispatch = useDispatch()

  const [searchText, setSearchText] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })

  const { data, loading, pagination } = useSelector(state => state.masterWarehouseRack)

  const router = useRouter()

  // Debounced search function with proper cleanup
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId
      const fn = (searchValue) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          // Reset to page 1 when searching
          setPaginationModel(prev => ({ ...prev, page: 0 }))

          const params = {
            search: searchValue,
            page: 1,
            limit: paginationModel.pageSize,
            warehouseId: router.query.id
          }

          dispatch(fetchMasterDataWarehouseRack(params))
        }, 500)
      }

      // Add cancel function to clear timeout
      fn.cancel = () => {
        clearTimeout(timeoutId)
      }

      return fn
    })(),
    [dispatch, paginationModel.pageSize, router.query.id]
  )

  const handleSearch = searchValue => {
    setSearchText(searchValue)

    if (searchValue === '') {
      // Cancel any pending debounced search
      debouncedSearch.cancel()

      // Reset pagination first
      setPaginationModel(prev => ({ ...prev, page: 0 }))

      // Clear search immediately
      const params = {
        page: 1,
        limit: paginationModel.pageSize,
        warehouseId: router.query.id
      }
      dispatch(fetchMasterDataWarehouseRack(params))
    } else {
      debouncedSearch(searchValue)
    }
  }

  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel)

    const params = {
      page: newPaginationModel.page + 1, // Backend expects 1-based pagination
      limit: newPaginationModel.pageSize,
      warehouseId: router.query.id,
      ...(searchText && { search: searchText })
    }

    dispatch(fetchMasterDataWarehouseRack(params))
  }

  useEffect(() => {
    if (router.query.id) {
      const params = {
        page: 1,
        limit: 25,
        warehouseId: router.query.id
      }
      dispatch(fetchMasterDataWarehouseRack(params))
    }
  }, [dispatch, router.query.id])

  const handleAdd = () => {
    router.push(`/master/warehouses/${warehouseId}/add`)
  }

  return (
    <Card>
      <DataGrid
        autoHeight
        loading={loading}
        rows={data || []}
        rowCount={pagination?.total || 0}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        columns={[
          {
            flex: 0.1,
            minWidth: 120,
            field: 'name',
            headerName: 'Nama Rak',
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
            field: 'description',
            headerName: 'Deskripsi Rak',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.description}
                </Typography>
              )
            }
          },
          {
            flex: 0.04,
            minWidth: 120,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => <RowOptions id={row.id} name={row.name} warehouseId={warehouseId} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        slots={{ toolbar: TableHeaderMasterWarehouseRack }}
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
            placeholder: 'Cari Rak',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: handleAdd
          }
        }}
      />
    </Card>
  )
}
