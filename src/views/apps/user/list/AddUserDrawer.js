// ** React Imports
// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'

export const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} harus diisi`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} minimal harus ${min} karakter`
  } else {
    return ''
  }
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, obj => showErrors('Nama', obj.value.length, obj.min))
    .required(),
  user_name: yup
    .string()
    .min(3, obj => showErrors('Username', obj.value.length, obj.min))
    .required(),
  email: yup.string().email('Masukkan email yang valid').required('Email harus diisi'),
  description: yup.string().optional(),
  RoleId: yup.string().required('Otoritas harus diisi')
})

export const defaultValues = {
  email: '',
  name: '',
  user_name: '',
  description: '',
  RoleId: ''
}

const SidebarAddUser = props => {
  // ** Props
  const { open, toggle } = props

  // ** Hooks
  const dispatch = useDispatch()
  const roleStore = useSelector(state => state.role.dataRoles)

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data, e) => {
    e.preventDefault()
    dispatch(addUser({ ...data }))
    toggle()
    reset()
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>Tambah Pengguna</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Nama'
                onChange={onChange}
                placeholder='Cakra'
                error={Boolean(errors.name)}
                {...(errors.name && { helperText: errors.name.message })}
              />
            )}
          />
          <Controller
            name='user_name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Username'
                onChange={onChange}
                placeholder='cakra'
                error={Boolean(errors.user_name)}
                {...(errors.user_name && { helperText: errors.user_name.message })}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='email'
                label='Email'
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.email)}
                placeholder='cakra@email.com'
                {...(errors.email && { helperText: errors.email.message })}
              />
            )}
          />
          <Controller
            name='description'
            control={control}
            rules={{ required: false }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label='Deskripsi'
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                placeholder='akun cakra'
              />
            )}
          />
          <Controller
            name='RoleId'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                fullWidth
                sx={{ mb: 4 }}
                label='Pilih Otoritas'
                error={Boolean(errors.RoleId)}
                {...(errors.RoleId && { helperText: errors.RoleId.message })}
                SelectProps={{
                  value: value,
                  onChange: e => onChange(e)
                }}
              >
                {roleStore?.map(data => {
                  return (
                    <MenuItem Select value={data.id}>
                      {data.name}
                    </MenuItem>
                  )
                })}
              </CustomTextField>
            )}
          />
          {/* <CustomTextField
            select
            fullWidth
            control={control}
            value={role}
            sx={{ mb: 4 }}
            label='Pilih Otoritas'
            onChange={e => setRole(e.target.value)}
            SelectProps={{ value: role, onChange: e => setRole(e.target.value) }}
          >
            {roleStore?.map(data => {
              return (
                <MenuItem Select value={data.id}>
                  {data.name}
                </MenuItem>
              )
            })}
          </CustomTextField> */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button variant='tonal' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </form>
    </Drawer>
  )
}

export default SidebarAddUser
