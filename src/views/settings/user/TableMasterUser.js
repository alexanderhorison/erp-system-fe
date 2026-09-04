import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'

import HandleSearh from 'src/helpers/handleSearch'
import { deleteUser, fetchDataUsers } from 'src/store/apps/user'
import { fetchRoles } from 'src/store/apps/role'
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import ModalFormMasterUser from './ModalFormMasterUser'

// ** Shared Components
import DataTable from 'src/views/common/DataTable'
import TableToolbar from 'src/views/common/TableToolbar'
import FilterPanel from 'src/views/common/FilterPanel'
import ConfirmDialog from 'src/views/common/ConfirmDialog'
import StatusChip from 'src/views/common/StatusChip'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

const RowOptions = ({ row }) => {
  const dispatch = useDispatch()
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const { loadingDelete } = useSelector(state => state.user)

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again (see docs/REVAMP_BASELINE.md §4).
  const handleDelete = () => {
    dispatch(deleteUser({ id: row.id, name: row.name }))
    setOpenConfirmDelete(false)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Tooltip title='Ubah'>
          <IconButton onClick={() => setOpenModalEdit(true)} size='small'>
            <Icon icon='tabler:edit' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
        {!row.deletedAt && (
          <Tooltip title='Hapus'>
            <IconButton onClick={() => setOpenConfirmDelete(true)} size='small' sx={{ color: 'error.main' }}>
              <Icon icon='tabler:trash' fontSize='1.125rem' />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title='Hapus Pengguna'
        itemName={row.name}
        loading={loadingDelete}
      />
      {openModalEdit && (
        <ModalFormMasterUser open={openModalEdit} setOpen={setOpenModalEdit} typeModal='EDIT' data={row} />
      )}
    </>
  )
}

const defaultFilter = {
  roleId: '',
  status: ''
}

export default function TableMasterUser() {
  const dispatch = useDispatch()
  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [filterAnchor, setFilterAnchor] = useState(null)
  const [dataFilter, setDataFilter] = useState(defaultFilter)

  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const { dataUsers: users, loading } = useSelector(state => state.user)
  const { dataRoles: roles } = useSelector(state => state.role)

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    HandleSearh({ data: users, keys: ['name', 'userName', 'email'], searchValue, setData: setFilteredData })
  }

  useEffect(() => {
    dispatch(fetchDataUsers())
    dispatch(fetchRoles())
    dispatch(fetchMasterDataWarehouse())
  }, [dispatch])

  useEffect(() => {
    setFilteredData(users)
  }, [users])

  const filterFields = useMemo(
    () => [
      {
        name: 'roleId',
        label: 'Otoritas',
        type: 'select',
        options: (roles || []).map(item => ({ value: item.id, label: item.name }))
      },
      {
        name: 'status',
        label: 'Status Pengguna',
        type: 'select',
        options: [
          { value: 'active', label: 'Aktif' },
          { value: 'notActive', label: 'Tidak Aktif' }
        ]
      }
    ],
    [roles]
  )

  const activeFilterCount = Object.values(dataFilter).filter(Boolean).length

  const applyFilter = next => {
    setDataFilter(next)
    dispatch(fetchDataUsers(next))
  }

  const resetFilter = () => {
    setDataFilter(defaultFilter)
    dispatch(fetchDataUsers())
  }

  return (
    <>
      {openModalAdd && <ModalFormMasterUser open={openModalAdd} setOpen={setOpenModalAdd} typeModal='ADD' />}
      <DataTable
        itemLabel='pengguna'
        loading={loading}
        toolbar={
          <TableToolbar
            value={searchText}
            placeholder='Cari nama, username, atau email'
            onChange={event => handleSearch(event.target.value)}
            clearSearch={() => handleSearch('')}
            onOpenFilters={setFilterAnchor}
            activeFilterCount={activeFilterCount}
            actions={
              <Button
                variant='contained'
                onClick={() => setOpenModalAdd(true)}
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              >
                Tambah Pengguna Baru
              </Button>
            }
          />
        }
        columns={[
          {
            flex: 0.28,
            minWidth: 220,
            field: 'name',
            headerName: 'PENGGUNA',
            renderCell: ({ row }) => (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography noWrap variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {row.name}
                </Typography>
                <Typography noWrap sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground }}>
                  {row.email}
                </Typography>
              </Box>
            )
          },
          {
            flex: 0.2,
            minWidth: 170,
            field: 'Master_Role',
            headerName: 'OTORITAS',
            renderCell: ({ row }) => (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography noWrap variant='body2' sx={{ color: 'text.primary' }}>
                  {row?.Master_Role?.name || '-'}
                </Typography>
                {row?.Master_Role?.description && (
                  <Typography noWrap sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground }}>
                    {row.Master_Role.description}
                  </Typography>
                )}
              </Box>
            )
          },
          {
            flex: 0.16,
            minWidth: 150,
            field: 'userName',
            headerName: 'USERNAME',
            renderCell: ({ row }) => (
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {row.userName}
              </Typography>
            )
          },
          {
            flex: 0.12,
            minWidth: 110,
            field: 'deletedAt',
            headerName: 'STATUS',
            renderCell: ({ row }) => <StatusChip isActive={!row.deletedAt} />
          },
          {
            flex: 0.14,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'ACTION',
            renderCell: ({ row }) => <RowOptions row={row} />
          }
        ]}
        pageSizeOptions={[25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData}
      />

      <FilterPanel
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        fields={filterFields}
        value={dataFilter}
        onApply={applyFilter}
        onReset={resetFilter}
      />
    </>
  )
}
