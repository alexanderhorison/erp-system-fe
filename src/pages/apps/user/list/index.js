// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { deleteUser, fetchDataUsers } from 'src/store/apps/user'
import { fetchRoles } from 'src/store/apps/role'

// ** Third Party Components
// import axios from 'axios'
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import ModalUserEdit from 'src/views/apps/modal/user/modalUserEdit'
import ModalConfirmation from 'src/views/common/ModalConfirmation'

// ** renders client column
const userRoleObj = {
  admin: { icon: 'tabler:device-laptop', color: 'secondary' },
  author: { icon: 'tabler:circle-check', color: 'success' },
  editor: { icon: 'tabler:edit', color: 'info' },
  maintainer: { icon: 'tabler:chart-pie-2', color: 'primary' },
  subscriber: { icon: 'tabler:user', color: 'warning' }
}

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// ** renders client column
const renderClient = row => {
  return (
    <CustomAvatar
      skin='light'
      color={row.avatarColor}
      sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
    >
      {getInitials(row.name ? row.name : 'John Doe')}
    </CustomAvatar>
  )
}

const RowOptions = ({ id, data }) => {
  // ** Hooks
  const dispatch = useDispatch()

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  // State Modal View
  const [isView, setIsView] = useState(false)

  // State Modal Edit
  const [isModalEditUser, setIsModalEditUser] = useState(false)
  // state data for edit
  const [dataUser, setDataUser] = useState(null)
  // state on Close modal
  const modalEditUserClosePress = useCallback(() => {
    setIsModalEditUser(false)
  }, [])

  // State Modal Delete
  const [isModalDeleteUser, setIsModalDeleteUser] = useState(false)

  // state on Open modal
  const modalEditUserOpenPress = useCallback(
    (data, isView = false) =>
      () => {
        setDataUser(data)
        setIsView(isView)
        setIsModalEditUser(true)
      },
    []
  )

  // state on Delete Modal
  const modalDeleteUserOpenPress = useCallback(
    () => () => {
      setIsModalDeleteUser(true)
    },
    []
  )

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  // state on Close modal delete
  const modalDeleteUserClosePress = useCallback(() => {
    setIsModalDeleteUser(false)
  }, [])

  const handleDelete = () => {
    dispatch(deleteUser(id))
    modalDeleteUserClosePress()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={modalEditUserOpenPress(data, true)}>
          <Icon icon='tabler:eye' fontSize={20} />
          Lihat
        </MenuItem>
        {!data?.deletedAt && (
          <MenuItem onClick={modalEditUserOpenPress(data)} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:edit' fontSize={20} />
            Sunting
          </MenuItem>
        )}
        <MenuItem onClick={modalDeleteUserOpenPress()} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Hapus
        </MenuItem>
        {isModalEditUser && (
          <ModalUserEdit
            data={dataUser}
            isOpen={isModalEditUser}
            closePress={modalEditUserClosePress}
            isView={isView}
          />
        )}
        {isModalDeleteUser && (
          <ModalConfirmation
            handleAgree={handleDelete}
            open={isModalDeleteUser}
            setOpen={setIsModalDeleteUser}
            title={'Yakin menghapus user?'}
            content={`Anda ingin menghapus produk ${data?.name}`}
          />
        )}
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.25,
    minWidth: 280,
    field: 'name',
    headerName: 'Pengguna',
    renderCell: ({ row }) => {
      const { name, email } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* {renderClient(row)} */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link}
              href='/apps/user/view/account'
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'Role',
    minWidth: 170,
    headerName: 'Otoritas',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar skin='light' sx={{ mr: 4, width: 30, height: 30 }} color={'primary'}>
            <Icon icon={userRoleObj.admin.icon} />
          </CustomAvatar>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.Role?.name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {row?.Role?.description}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 190,
    field: 'user_name',
    headerName: 'Username',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.user_name}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'deletedAt',
    headerName: 'Status',
    renderCell: ({ row }) => {
      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row.deletedAt ? 'Not Active' : 'Active'}
          color={row.deletedAt ? 'secondary' : 'success'}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Tindakan',
    renderCell: ({ row }) => <RowOptions id={row.id} data={row} />
  }
]

const UserList = ({ apiData }) => {
  // ** State
  const [role, setRole] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const users = useSelector(state => state.user.dataUsers)
  const roles = useSelector(state => state.role.dataRoles)

  // ** Hooks
  const dispatch = useDispatch()

  // Fetch User
  useEffect(() => {
    dispatch(fetchDataUsers())
    dispatch(fetchRoles())
  }, [])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback(e => {
    setRole(e.target.value)
  }, [])

  const handlePlanChange = useCallback(e => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback(e => {
    setStatus(e.target.value)
  }, [])
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Pencarian' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Pilih Otoritas'
                  SelectProps={{
                    value: role,
                    displayEmpty: true,
                    onChange: e => handleRoleChange(e)
                  }}
                >
                  <MenuItem Select value=''>
                    Select Role
                  </MenuItem>
                  {roles?.map(data => {
                    return (
                      <MenuItem Select value={data.id}>
                        {data.name}
                      </MenuItem>
                    )
                  })}
                </CustomTextField>
              </Grid>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Status Pengguna'
                  SelectProps={{
                    value: status,
                    displayEmpty: true,
                    onChange: e => handleStatusChange(e)
                  }}
                >
                  <MenuItem value=''>Status Pengguna</MenuItem>
                  <MenuItem value='active'>Aktif</MenuItem>
                  <MenuItem value='inactive'>Tidak Aktif</MenuItem>
                </CustomTextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={users || []}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList
