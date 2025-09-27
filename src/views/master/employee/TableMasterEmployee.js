import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Card, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'

import { usePagination } from 'src/helpers/usePagination'

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
  const [openModalAdd, setOpenModalAdd] = useState(false)

  // Initialize pagination helper with status filter for employee types
  const {
    searchText,
    paginationModel,
    filters,
    handleSearch,
    handlePaginationChange,
    handleFilterChange,
    handleSortModelChange,
    fetchData,
    initialFetch
  } = usePagination(
    fetchMasterDataEmployee,
    dispatch,
    { orderBy: 'nama', orderType: 'ASC' }, // Don't include empty status
    { page: 0, pageSize: 10 }
  )

  const { data, loading, pagination } = useSelector(state => state.masterEmployee)

  // Enhanced filter change with support for employee status
  const handleFilterChangeWithStatus = useCallback((filterType, value) => {
    // For status filter, when empty, we need to completely remove it from filters
    if (filterType === 'status' && value === '') {
      // Use handleFilterChange with null to remove the filter completely
      handleFilterChange(filterType, null)
    } else {
      handleFilterChange(filterType, value)
    }
  }, [handleFilterChange])

  // Enhanced sort change with allowed fields for employee
  const handleSortModelChangeWithFields = useCallback((sortModel) => {
    const allowedOrderBy = ['nama', 'role', 'salary']
    handleSortModelChange(sortModel, allowedOrderBy)
  }, [handleSortModelChange])

  useEffect(() => {
    initialFetch()
  }, [initialFetch])

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
        paginationMode='server'
        sortingMode='server'
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        onSortModelChange={handleSortModelChangeWithFields}
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
            onChange: handleSearch,
            openModalAdd: setOpenModalAdd,
            filters: filters,
            onFilterChange: handleFilterChangeWithStatus
          }
        }}
      />
      {openModalAdd && <ModalAddMasterEmployee open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
    </Card>
  )
}
