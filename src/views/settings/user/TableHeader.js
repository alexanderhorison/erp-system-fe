// ** MUI Imports
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  IconButton,
  InputAdornment
} from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { showErrors } from './modalUserAdd'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { addUser } from 'src/store/apps/user'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { CustomCloseButton } from 'src/views/pages/dialog-examples/DialogEditUserInfo'
import encrypt from 'src/utils/encrypt'

export const defaultValues = {
  email: '',
  name: '',
  userName: '',
  description: '',
  password: '',
  roleId: '',
  warehouseId: ''
}

const TableHeader = props => {
  // ** Props
  const { handleFilter, value, clearFilter } = props
  const [role, setRole] = useState('')
  const dispatch = useDispatch()

  const roleStore = useSelector(state => state.role.dataRoles)
  const warehouseStore = useSelector(state => state.warehouse.data)

  // ** State
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const schema = yup.object().shape({
    name: yup
      .string()
      .min(3, obj => showErrors('Nama', obj.value.length, obj.min))
      .required(),
    userName: yup
      .string()
      .min(3, obj => showErrors('Username', obj.value.length, obj.min))
      .required(),
    password: yup
      .string()
      .min(5, obj => showErrors('Password', obj.value.length, obj.min))
      .required(),
    email: yup.string().email('Masukkan email yang valid').required('Email harus diisi'),
    description: yup.string().optional(),
    roleId: yup.string().required('Otoritas harus diisi'),
    warehouseId: yup
      .string()
      .test('warehouse-validation', 'Gudang harus diisi jika otoritas adalah admin gudang', (val, context) =>
        validateWarehouseId(val, context)
      )
  })

  const validateWarehouseId = (val, context) => {
    if (role == 3 && !val) {
      return false
    } else {
      return true
    }
  }

  const handleDialogToggle = () => {
    setOpen(!open)
    setRole('')
    reset()
  }

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
    let encryptPassword = encrypt(data.password)
    delete data?.password
    let input = { ...data, password: encryptPassword }
    dispatch(addUser(input))
    setOpen(false)
    reset()
  }

  return (
    <>
      <Box
        sx={{
          py: 4,
          px: 6,
          rowGap: 2,
          columnGap: 4,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box
          sx={{
            gap: 2,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}
          >
            <CustomTextField
              value={value}
              placeholder='Cari Pengguna'
              onChange={e => handleFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 4, display: 'flex' }}>
                    <Icon fontSize='1.25rem' icon='tabler:search' />
                  </Box>
                ),
                endAdornment: (
                  <IconButton size='small' title='Clear' aria-label='Clear' onClick={clearFilter}>
                    <Icon fontSize='1.25rem' icon='tabler:x' />
                  </IconButton>
                )
              }}
              sx={{
                width: {
                  xs: 1,
                  sm: 'auto'
                },
                '& .MuiInputBase-root > svg': {
                  mr: 2
                }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button onClick={handleDialogToggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              Tambah Pengguna Baru
            </Button>
          </Box>
        </Box>
      </Box>
      <Dialog
        fullWidth
        maxWidth='sm'
        onClose={handleDialogToggle}
        open={open}
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={handleDialogToggle}>
            <Icon icon='tabler:x' fontSize='1.5rem' />
          </CustomCloseButton>
          <DialogTitle
            component='div'
            sx={{
              textAlign: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Typography variant='h3' sx={{ mb: 2 }}>
              Tambah Pengguna
            </Typography>
          </DialogTitle>
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
                name='userName'
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
                    error={Boolean(errors.userName)}
                    {...(errors.userName && { helperText: errors.userName.message })}
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
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Password'
                    value={value}
                    sx={{ mb: 4 }}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.password)}
                    {...(errors.password && { helperText: errors.password.message })}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <Controller
                name='roleId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Pilih Otoritas'
                    error={Boolean(errors.roleId)}
                    {...(errors.roleId && { helperText: errors.roleId.message })}
                    SelectProps={{
                      value: value,
                      onChange: e => {
                        onChange(e)
                        setRole(e.target.value)
                      }
                    }}
                  >
                    {roleStore?.map((data, index) => {
                      return (
                        <MenuItem Select key={index} value={data.id}>
                          {data.name}
                        </MenuItem>
                      )
                    })}
                  </CustomTextField>
                )}
              />
              {role == 3 && (
                <Controller
                  name='warehouseId'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      sx={{ mb: 4 }}
                      label='Pilih Gudang'
                      error={Boolean(errors.warehouseId)}
                      {...(errors.warehouseId && { helperText: errors.warehouseId.message })}
                      SelectProps={{
                        value: value,
                        onChange: e => onChange(e)
                      }}
                    >
                      {warehouseStore?.map((data, index) => {
                        return (
                          <MenuItem Select key={index} value={data.id}>
                            {data.name}
                          </MenuItem>
                        )
                      })}
                    </CustomTextField>
                  )}
                />
              )}
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
                    multiline
                    rows={3}
                  />
                )}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <Button variant='tonal' color='secondary' onClick={handleDialogToggle}>
                  Cancel
                </Button>
                <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                  Submit
                </Button>
              </Box>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TableHeader
