import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

import HandleSearh from 'src/helpers/handleSearch'
import { priceFormat } from 'src/helpers/priceFormatter'
import { deleteMasterDataEmployee, fetchMasterDataEmployee } from 'src/store/apps/master/employee'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import ConfirmDialog from 'src/views/common/ConfirmDialog'
import EmployeeStatusChip from './EmployeeStatusChip'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDelete } = useSelector(state => state.masterEmployee)

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again (see docs/REVAMP_BASELINE.md §4).
  const handleDelete = () => {
    dispatch(deleteMasterDataEmployee({ id, name }))
    setOpenConfirmDelete(false)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Tooltip title='Lihat'>
          <IconButton onClick={() => router.push(`/master/employee/${id}`)} size='small'>
            <Icon icon='tabler:eye' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Ubah'>
          <IconButton onClick={() => router.push(`/master/employee/${id}/edit`)} size='small'>
            <Icon icon='tabler:edit' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Hapus'>
          <IconButton onClick={() => setOpenConfirmDelete(true)} size='small' sx={{ color: 'error.main' }}>
            <Icon icon='tabler:trash' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
      </Box>

      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title='Hapus Karyawan'
        itemName={name}
        loading={loadingDelete}
      />
    </>
  )
}

export default function TableMasterEmployee() {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { data, loading } = useSelector(state => state.masterEmployee)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['nama', 'role'], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    dispatch(fetchMasterDataEmployee())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <DataTable
      itemLabel='karyawan'
      loading={loading}
      getRowId={row => row.id}
      onRowClick={params => router.push(`/master/employee/${params.row.id}`)}
      toolbar={
        <TableToolbar
          value={searchText}
          placeholder='Cari nama karyawan'
          onChange={event => handleSearch(event.target.value)}
          clearSearch={() => handleSearch('')}
          actions={
            <Button
              variant='contained'
              onClick={() => router.push('/master/employee/add')}
              startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
            >
              Tambah Karyawan
            </Button>
          }
        />
      }
      columns={[
        {
          flex: 0.05,
          minWidth: 60,
          field: 'id',
          headerName: 'ID',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.id}
            </Typography>
          )
        },
        {
          flex: 0.18,
          minWidth: 160,
          field: 'nama',
          headerName: 'NAMA KARYAWAN',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.nama}
            </Typography>
          )
        },
        {
          flex: 0.13,
          minWidth: 120,
          field: 'role',
          headerName: 'JABATAN',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.role || '-'}
            </Typography>
          )
        },
        {
          flex: 0.13,
          minWidth: 120,
          field: 'salary',
          headerName: 'GAJI',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.salary ? priceFormat(params.row.salary) : '-'}
            </Typography>
          )
        },
        {
          flex: 0.13,
          minWidth: 120,
          field: 'bonus',
          headerName: 'BONUS',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.bonus ? priceFormat(params.row.bonus) : '-'}
            </Typography>
          )
        },
        {
          flex: 0.13,
          minWidth: 120,
          field: 'debt',
          headerName: 'KASBON',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.debt ? priceFormat(params.row.debt) : '-'}
            </Typography>
          )
        },
        {
          flex: 0.11,
          minWidth: 110,
          field: 'status',
          headerName: 'STATUS',
          renderCell: params => (
            <EmployeeStatusChip status={params.row.status} isActive={params.row.is_active} />
          )
        },
        {
          flex: 0.14,
          minWidth: 120,
          sortable: false,
          field: 'actions',
          headerName: 'ACTION',
          renderCell: ({ row }) => (
            <Box onClick={event => event.stopPropagation()} sx={{ width: '100%' }}>
              <RowOptions id={row.id} name={row.nama} />
            </Box>
          )
        }
      ]}
      pageSizeOptions={[25, 50, 100]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      rows={filteredData}
      sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
    />
  )
}
