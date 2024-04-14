// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
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

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { deleteUser, fetchDataUsers } from 'src/store/apps/user'
import { fetchRoles } from 'src/store/apps/role'

// ** Third Party Components
// import axios from 'axios'
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/settings/user/TableHeader'
import ModalUserEdit from 'src/views/settings/user/modalUserEdit'
import ModalConfirmation from 'src/views/common/ModalConfirmation'
import Button from '@mui/material/Button'

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
      <Box sx={{ display: 'flex' }}>
        <IconButton onClick={modalEditUserOpenPress(data)} sx={{ ml: data.deletedAt ? 5 : 0 }}>
          <Icon icon='tabler:edit' />
        </IconButton>
        {!data?.deletedAt && (
          <IconButton>
            <Icon icon='tabler:trash' onClick={modalDeleteUserOpenPress()} />
          </IconButton>
        )}
      </Box>
      {isModalEditUser && (
        <ModalUserEdit data={dataUser} isOpen={isModalEditUser} closePress={modalEditUserClosePress} />
      )}
      {isModalDeleteUser && (
        <ModalConfirmation
          handleAgree={handleDelete}
          open={isModalDeleteUser}
          setOpen={setIsModalDeleteUser}
          title={'Yakin menghapus user?'}
          content={`Anda ingin menghapus user ${data?.name}`}
        />
      )}
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

const defaultFilter = {
  RoleId: '',
  status: ''
}

const UserList = ({ apiData }) => {
  // ** State
  const [value, setValue] = useState('')
  const [filterInput, setFilterInput] = useState(defaultFilter)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const users = useSelector(state => state.user.dataUsers)
  const roles = useSelector(state => state.role.dataRoles)

  const [filteredUser, setFilteredUser] = useState([])

  // ** Hooks
  const dispatch = useDispatch()

  // Fetch User
  useEffect(() => {
    dispatch(fetchDataUsers())
    dispatch(fetchRoles())
  }, [dispatch])

  const handleFilter = useCallback(
    val => {
      setValue(val)
      if (val?.length) {
        const filteredRows = users.filter(row => row.name.toLowerCase().includes(val.toLowerCase()))
        setIsFilter(true)
        setFilteredUser(filteredRows)
      } else {
        setIsFilter(false)
        setFilteredUser(users)
      }
    },
    [users]
  )

  const submitFilter = useCallback(() => {
    if (filterInput.RoleId || filterInput.status) {
      dispatch(fetchDataUsers(filterInput))
    } else {
      dispatch(fetchDataUsers())
    }
  }, [dispatch, filterInput])

  const clearAllFilter = useCallback(
    val => {
      setValue('')
      setFilteredUser([])
      setIsFilter(false)
      dispatch(fetchDataUsers())
      setFilterInput(defaultFilter)
    },
    [dispatch]
  )

  const clearSearch = useCallback(
    val => {
      setValue('')
      handleFilter('')
      dispatch(fetchDataUsers(filterInput))
    },
    [filterInput, dispatch, handleFilter]
  )

  const handleFilterInput = useCallback(
    e => {
      const { value, name } = e.target
      setFilterInput({ ...filterInput, [name]: value })
    },
    [filterInput]
  )

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <CardHeader title='Daftar Pengguna' />
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
                    value: filterInput.RoleId,
                    displayEmpty: true,
                    onChange: e => handleFilterInput(e)
                  }}
                  name='RoleId'
                >
                  <MenuItem Select value=''>
                    Select Role
                  </MenuItem>
                  {roles?.map((data, index) => {
                    return (
                      <MenuItem Select key={index} value={data.id}>
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
                  name='status'
                  SelectProps={{
                    value: filterInput.status,
                    displayEmpty: true,
                    onChange: e => handleFilterInput(e)
                  }}
                >
                  <MenuItem value=''>Status Pengguna</MenuItem>
                  <MenuItem value='active'>Aktif</MenuItem>
                  <MenuItem value='notActive'>Tidak Aktif</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item>
                <Button
                  color='primary'
                  variant='contained'
                  sx={{ '& svg': { p: 0 } }}
                  onClick={() => {
                    clearAllFilter()
                  }}
                >
                  Clear Filter
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color='primary'
                  variant='contained'
                  sx={{ '& svg': { p: 0 } }}
                  onClick={() => {
                    submitFilter()
                  }}
                >
                  Apply Filter
                </Button>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
            clearFilter={clearSearch}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={isFilter ? filteredUser : users}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      {/* <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} /> */}
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
