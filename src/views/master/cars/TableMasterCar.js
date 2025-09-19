import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'

import { deleteMasterDataCar, fetchMasterDataCar, fetchMasterDataCarDetail } from 'src/store/apps/master/car'

import ModalAddMasterCar from './ModalAddMasterCar'
import TableHeaderMasterCar from './TableHeaderMasterCar'
import CustomChip from 'src/@core/components/mui/chip'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleDelete = () => {
    dispatch(deleteMasterDataCar({ id, name }))
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataCarDetail(id))
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
        <ModalAddMasterCar open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
    </>
  )
}

export default function TableMasterCar({}) {
  const dispatch = useDispatch()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })

  // Combined filters (like Sales Order)
  const [filters, setFilters] = useState({
    orderBy: 'name',
    orderType: 'ASC'
  })

  const { data, loading, pagination } = useSelector(state => state.masterCar)

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
            orderBy: filters.orderBy,
            orderType: filters.orderType
          }

          dispatch(fetchMasterDataCar(params))
        }, 500)
      }

      // Add cancel function to clear timeout
      fn.cancel = () => {
        clearTimeout(timeoutId)
      }

      return fn
    })(),
    [dispatch, paginationModel.pageSize, filters]
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
        orderBy: filters.orderBy,
        orderType: filters.orderType
      }
      dispatch(fetchMasterDataCar(params))
    } else {
      debouncedSearch(searchValue)
    }
  }

  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel)

    const params = {
      page: newPaginationModel.page + 1, // Backend expects 1-based pagination
      limit: newPaginationModel.pageSize,
      ...(searchText && { search: searchText }),
      orderBy: filters.orderBy,
      orderType: filters.orderType
    }

    dispatch(fetchMasterDataCar(params))
  }

  // Handle sorting
  const handleSortModelChange = (sortModel) => {
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0]
      const orderBy = field === 'name' ? 'name' :
        field === 'plate_number' ? 'plate_number' :
          field === 'is_active' ? 'is_active' : 'name'
      const orderType = sort.toUpperCase()

      setFilters(prev => ({
        ...prev,
        orderBy,
        orderType
      }))

      // Reset to page 1 when sorting
      setPaginationModel(prev => ({ ...prev, page: 0 }))

      const params = {
        page: 1,
        limit: paginationModel.pageSize,
        ...(searchText && { search: searchText }),
        orderBy,
        orderType
      }

      dispatch(fetchMasterDataCar(params))
    }
  }

  useEffect(() => {
    const params = {
      page: 1,
      limit: 25,
      orderBy: filters.orderBy,
      orderType: filters.orderType
    }
    dispatch(fetchMasterDataCar(params))
  }, [dispatch]) // Removed sortFilters dependencies

  return (
    <Card>
      {openModalAdd && <ModalAddMasterCar open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <DataGrid
        autoHeight
        loading={loading}
        rows={data || []}
        rowCount={pagination?.total || 0}
        paginationMode="server"
        sortingMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        onSortModelChange={handleSortModelChange}
        columns={[
          {
            flex: 0.1,
            minWidth: 200,
            field: 'name',
            headerName: 'Nama Mobil',
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
            field: 'plate_number',
            headerName: 'Plat Nomor',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.plate_number}
                </Typography>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 150,
            field: 'emoneyBalance',
            headerName: 'E-money Balance',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                    params.row.emoneyBalance || 0
                  )}
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
            flex: 0.1,
            minWidth: 110,
            field: 'is_active',
            headerName: 'Active',
            renderCell: params => {
              return (
                <CustomChip
                  rounded
                  size='small'
                  skin='light'
                  label={params.row.is_active ? 'Active' : 'Inactive'}
                  color={params.row.is_active ? 'success' : 'secondary'}
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    textTransform: 'capitalize',
                    '& .MuiChip-label': { fontWeight: 500 }
                  }}
                />
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
        slots={{ toolbar: TableHeaderMasterCar }}
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
            placeholder: 'Cari nama mobil atau plat nomor',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: setOpenModalAdd
          }
        }}
      />
    </Card>
  )
}
