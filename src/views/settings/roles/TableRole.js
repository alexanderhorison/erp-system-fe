import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import HandleSearh from 'src/helpers/handleSearch'
import { deleteRole, fetchRoles } from 'src/store/apps/role'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDelete } = useSelector(state => state.role)

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again (see docs/REVAMP_BASELINE.md §4).
  const handleDelete = () => {
    dispatch(deleteRole({ id, name }))
    setOpenConfirmDelete(false)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Tooltip title='Ubah'>
          <IconButton onClick={() => router.push(`/settings/roles/${id}`)} size='small'>
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
        title='Hapus Otoritas'
        itemName={name}
        loading={loadingDelete}
      />
    </>
  )
}

export default function TableRole() {
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { dataRoles: data } = useSelector(state => state.role)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data, keys: ['name', 'description'], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  return (
    <DataTable
      itemLabel='otoritas'
      getRowId={row => row.id}
      onRowClick={params => router.push(`/settings/roles/${params.row.id}`)}
      toolbar={
        <TableToolbar
          value={searchText}
          placeholder='Cari Otoritas'
          onChange={event => handleSearch(event.target.value)}
          clearSearch={() => handleSearch('')}
          actions={
            <Button
              variant='contained'
              onClick={() => router.push('/settings/roles/add')}
              startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
            >
              Tambah Otoritas
            </Button>
          }
        />
      }
      columns={[
        {
          flex: 0.3,
          minWidth: 220,
          field: 'name',
          headerName: 'NAMA OTORITAS',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.name}
            </Typography>
          )
        },
        {
          flex: 0.55,
          minWidth: 240,
          field: 'description',
          headerName: 'DESKRIPSI OTORITAS',
          renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {params.row.description || '-'}
            </Typography>
          )
        },
        {
          flex: 0.15,
          minWidth: 120,
          sortable: false,
          field: 'actions',
          headerName: 'ACTION',
          renderCell: ({ row }) => (
            <Box onClick={event => event.stopPropagation()} sx={{ width: '100%' }}>
              <RowOptions id={row.id} name={row.name} />
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
