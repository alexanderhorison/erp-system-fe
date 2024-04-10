// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import TableHeader from 'src/views/apps/roles/TableHeader'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Actions Imports
import { deleteRole, fetchRoles } from 'src/store/apps/role'
import ModalRoleEdit from 'src/views/apps/modal/role/modalRoleEdit'
import { fetchMenus } from 'src/store/apps/menu'
import ModalConfirmation from 'src/views/common/ModalConfirmation'

const colors = {
  support: 'info',
  users: 'success',
  manager: 'warning',
  administrator: 'primary',
  'restricted-user': 'error'
}

const RowOptions = ({ id, data }) => {
  // ** Hooks
  const dispatch = useDispatch()

  // State Modal View
  const [isView, setIsView] = useState(false)

  // State Modal Edit
  const [isModalEditRole, setIsModalEditRole] = useState(false)
  // state data for edit
  const [dataRole, setDataRole] = useState(null)
  // state on Close modal
  const modalEditRoleClosePress = useCallback(() => {
    setIsModalEditRole(false)
  }, [])

  // State Modal Delete
  const [isModalDeleteRole, setIsModalDeleteRole] = useState(false)

  // Action Open Modal
  const modalOpenPress = useCallback(
    (data, isView = false) =>
      () => {
        setDataRole(data)
        setIsView(isView)
        setIsModalEditRole(true)
      },
    []
  )

  const handleDelete = () => {
    dispatch(deleteRole(id))
    modalDeleteRoleClosePress()
  }

  // Action Open modal delete
  const modalDeleteOpenPress = useCallback(
    () => () => {
      setIsModalDeleteRole(true)
    },
    []
  )
  // Action Close modal delete
  const modalDeleteRoleClosePress = useCallback(() => {
    setIsModalDeleteRole(false)
  }, [])

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={modalOpenPress(data)}>
          <Icon icon='tabler:edit' />
        </IconButton>
        <IconButton>
          <Icon icon='tabler:trash' onClick={modalDeleteOpenPress()} />
        </IconButton>
      </Box>
      {isModalDeleteRole && (
        <ModalConfirmation
          handleAgree={handleDelete}
          open={isModalDeleteRole}
          setOpen={setIsModalDeleteRole}
          title={'Yakin menghapus otoritas?'}
          content={`Anda ingin menghapus otoritas ${data?.name}`}
        />
      )}
      {isModalEditRole && (
        <ModalRoleEdit data={dataRole} isOpen={isModalEditRole} closePress={modalEditRoleClosePress} />
      )}
    </>
  )
}

const defaultColumns = [
  {
    flex: 0.25,
    field: 'name',
    minWidth: 240,
    headerName: 'Nama Otoritas',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.name}</Typography>
  },
  {
    flex: 0.25,
    field: 'description',
    minWidth: 240,
    headerName: 'Deskripsi Otoritas',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.description}</Typography>
  },
  {
    flex: 0.25,
    minWidth: 210,
    field: 'createdAt',
    headerName: 'Tanggal Pembuatan Otoritas',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.createdAt.split('T')[0]}</Typography>
  }
]

const PermissionsTable = () => {
  // ** State
  const [value, setValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [filteredRoles, setFilteredRoles] = useState([])

  // ** Hooks
  const dispatch = useDispatch()
  const roles = useSelector(state => state.role.dataRoles)

  useEffect(() => {
    dispatch(fetchRoles())
    dispatch(fetchMenus())
  }, [dispatch])

  const handleFilter = useCallback(
    val => {
      setValue(val)
      if (val.length) {
        const filteredRows = roles.filter(row => row.name.toLowerCase().includes(val.toLowerCase()))
        setFilteredRoles(filteredRows)
      } else {
        setFilteredRoles(roles)
      }
    },
    [roles]
  )

  const clearFilter = useCallback(val => {
    setValue('')
    setFilteredRoles([])
  }, [])

  const onSubmit = e => {
    e.preventDefault()
  }

  const columns = [
    ...defaultColumns,
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => <RowOptions id={row.id} data={row} />
    }
  ]

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <PageHeader
            title={
              <Typography variant='h4' sx={{ mb: 6 }}>
                List Otoritas
              </Typography>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} handleFilter={handleFilter} clearFilter={clearFilter} />
            <DataGrid
              autoHeight
              rows={value ? filteredRoles : roles}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default PermissionsTable
