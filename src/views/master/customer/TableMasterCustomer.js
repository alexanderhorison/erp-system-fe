import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'

import { deleteMasterDataCustomer, fetchMasterDataCustomer, fetchMasterDataCustomerDetail } from 'src/store/apps/master/customer'
import ModalAddMasterCustomer from './ModalAddMasterCustomer'
import TableHeaderMasterCustomer from './TableHeaderMasterCustomer'
import { useRouter } from 'next/router'

const RowOptions = ({ id, name, router }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openModalView, setOpenModalView] = useState(false)

  const handleDelete = () => {
    dispatch(deleteMasterDataCustomer({ id, name }))
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataCustomerDetail(id))
    setOpenModalEdit(true)
  }

  const handleView = () => {
    router.push(`/master/customer/${id}`)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleView}>
          <Icon icon='tabler:eye' />
        </IconButton>
        <IconButton onClick={handleEdit}>
          <Icon icon='tabler:edit' />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <Icon icon='tabler:trash' />
        </IconButton>
      </Box>
      {openModalEdit && (
        <ModalAddMasterCustomer open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
      {openModalView && (
        <ModalAddMasterCustomer open={openModalView} setOpen={setOpenModalView} typeModal={'VIEW'} id={id} />
      )}
    </>
  )
}

export default function TableMasterCustomer({ }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })

  // Sort filters
  const [sortFilters, setSortFilters] = useState({
    orderBy: 'name',
    orderType: 'ASC'
  })

  const { data, loading, pagination } = useSelector(state => state.masterCustomer)

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
            orderBy: sortFilters.orderBy,
            orderType: sortFilters.orderType
          }

          dispatch(fetchMasterDataCustomer(params))
        }, 500)
      }

      // Add cancel function to clear timeout
      fn.cancel = () => {
        clearTimeout(timeoutId)
      }

      return fn
    })(),
    [dispatch, paginationModel.pageSize, sortFilters]
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
        orderBy: sortFilters.orderBy,
        orderType: sortFilters.orderType
      }
      dispatch(fetchMasterDataCustomer(params))
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
      orderBy: sortFilters.orderBy,
      orderType: sortFilters.orderType
    }

    dispatch(fetchMasterDataCustomer(params))
  }

  // Handle sorting
  const handleSortModelChange = (sortModel) => {
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0]
      const orderBy = field === 'name' ? 'name' :
        field === 'phoneNumber' ? 'phoneNumber' :
          field === 'email' ? 'email' :
            field === 'rankName' ? 'rankName' : 'name'
      const orderType = sort.toUpperCase()

      setSortFilters({
        orderBy,
        orderType
      })

      // Reset to page 1 when sorting
      setPaginationModel(prev => ({ ...prev, page: 0 }))

      const params = {
        page: 1,
        limit: paginationModel.pageSize,
        ...(searchText && { search: searchText }),
        orderBy,
        orderType
      }

      dispatch(fetchMasterDataCustomer(params))
    }
  }

  useEffect(() => {
    const params = {
      page: 1,
      limit: 25,
      orderBy: sortFilters.orderBy,
      orderType: sortFilters.orderType
    }
    dispatch(fetchMasterDataCustomer(params))
  }, [dispatch, sortFilters.orderBy, sortFilters.orderType])

  return (
    <Card>
      {openModalAdd && <ModalAddMasterCustomer open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
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
            flex: 0.02,
            minWidth: 50,
            field: 'id',
            headerName: 'Id',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.id}
                </Typography>
              )
            }
          },
          {
            flex: 0.12,
            minWidth: 100,
            field: 'name',
            headerName: 'Nama Customer',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.name}
                </Typography>
              )
            }
          },
          {
            flex: 0.08,
            minWidth: 100,
            field: 'phoneNumber',
            headerName: 'Nomor Telepon',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params?.row?.phoneNumber}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 100,
            field: 'email',
            headerName: 'Email',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params?.row?.email}
                </Typography>
              )
            }
          },
          {
            flex: 0.07,
            minWidth: 100,
            field: 'rankName',
            headerName: 'Rank',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.rankName}
                </Typography>
              )
            }
          },
          {
            flex: 0.15,
            minWidth: 120,
            field: 'notes',
            headerName: 'Catatan',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.notes}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => (
              <div onClick={(e) => e.stopPropagation()}>
                <RowOptions id={row.id} name={row.name} router={router} />
              </div>
            )
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        onRowClick={params => {
          router.push(`/master/customer/${params.id}`)
        }}
        slots={{ toolbar: TableHeaderMasterCustomer }}
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
            placeholder: 'Cari nama customer',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: setOpenModalAdd,
          }
        }}
      />
    </Card>
  )
}
