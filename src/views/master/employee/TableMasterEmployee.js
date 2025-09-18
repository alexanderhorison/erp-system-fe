import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'

import {
  deleteMasterDataEmployee,
  fetchMasterDataEmployee,
  fetchMasterDataEmployeeDetail
} from 'src/store/apps/master/employee'
import ModalAddMasterEmployee from './ModalAddMasterEmployee'
import TableHeaderMasterEmployee from './TableHeaderMasterEmployee'
import { useRouter } from 'next/router'
import { priceFormat } from 'src/helpers/priceFormatter'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openModalView, setOpenModalView] = useState(false)

  const handleDelete = e => {
    e.stopPropagation()
    dispatch(deleteMasterDataEmployee({ id, name }))
  }

  const handleEdit = e => {
    e.stopPropagation()
    dispatch(fetchMasterDataEmployeeDetail(id))
    setOpenModalEdit(true)
  }

  const handleView = e => {
    dispatch(fetchMasterDataEmployeeDetail(id))
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
        <ModalAddMasterEmployee open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
      {openModalView && (
        <ModalAddMasterEmployee open={openModalView} setOpen={setOpenModalView} typeModal={'VIEW'} id={id} />
      )}
    </>
  )
}

const renderChipStatus = params => {
  const isActive = params.row.is_active
  const status = params.row.status || ''

  return (
    <CustomChip
      rounded
      size='small'
      skin='light'
      color={isActive ? 'success' : 'error'}
      label={isActive ? status || 'Aktif' : 'Tidak Aktif'}
      sx={{ fontWeight: 500 }}
    />
  )
}

export default function TableMasterEmployee() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [searchText, setSearchText] = useState('')
  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })

  const { data, loading, pagination } = useSelector(state => state.masterEmployee)

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
            limit: paginationModel.pageSize
          }

          dispatch(fetchMasterDataEmployee(params))
        }, 500)
      }

      // Add cancel function to clear timeout
      fn.cancel = () => {
        clearTimeout(timeoutId)
      }

      return fn
    })(),
    [dispatch, paginationModel.pageSize]
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
        limit: paginationModel.pageSize
      }
      dispatch(fetchMasterDataEmployee(params))
    } else {
      debouncedSearch(searchValue)
    }
  }

  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel)

    const params = {
      page: newPaginationModel.page + 1, // Backend expects 1-based pagination
      limit: newPaginationModel.pageSize,
      ...(searchText && { search: searchText })
    }

    dispatch(fetchMasterDataEmployee(params))
  }

  useEffect(() => {
    const params = {
      page: 1,
      limit: 25
    }
    dispatch(fetchMasterDataEmployee(params))
  }, [dispatch])

  const handleRowClick = params => {
    router.push(`/master/employee/${params.id}`)
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
            flex: 0.05,
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
            flex: 0.15,
            minWidth: 150,
            field: 'nama',
            headerName: 'Nama Karyawan',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.nama}
                </Typography>
              )
            }
          },
          {
            flex: 0.10,
            minWidth: 100,
            field: 'role',
            headerName: 'Jabatan',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params?.row?.role || '-'}
                </Typography>
              )
            }
          },
          {
            flex: 0.12,
            minWidth: 120,
            field: 'salary',
            headerName: 'Gaji',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.salary ? priceFormat(params.row.salary) : '-'}
                </Typography>
              )
            }
          },
          {
            flex: 0.12,
            minWidth: 120,
            field: 'bonus',
            headerName: 'Bonus',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.bonus ? priceFormat(params.row.bonus) : '-'}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'debt',
            headerName: 'Kasbon',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.debt ? priceFormat(params.row.debt) : '-'}
                </Typography>
              )
            }
          },
          {
            flex: 0.08,
            minWidth: 120,
            field: 'status',
            headerName: 'Status',
            renderCell: renderChipStatus
          },
          {
            flex: 0.11,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => <RowOptions id={row.id} name={row.nama} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        onRowClick={handleRowClick}
        slots={{ toolbar: TableHeaderMasterEmployee }}
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
            placeholder: 'Cari nama karyawan',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: setOpenModalAdd
          }
        }}
      />
      {openModalAdd && <ModalAddMasterEmployee open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
    </Card>
  )
}
