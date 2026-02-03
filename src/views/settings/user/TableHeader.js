// ** MUI Imports
import {
  Box,
  Button,
  Grid,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { addUser } from 'src/store/apps/user'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import encrypt from 'src/utils/encrypt'
import BaseModal from 'src/views/common/BaseModal'

export const defaultValues = {
  email: '',
  name: '',
  userName: '',
  description: '',
  password: '',
  pin: '1234',
  roleId: '',
  warehouseId: ''
}

export const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} harus diisi`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} minimal harus ${min} karakter`
  } else {
    return ''
  }
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
    pin: yup
      .string()
      .matches(/^\d{4}$/, 'Pin harus 4 digit')
      .required('Pin harus diisi'),
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
      {/**Modal Add */}
      <BaseModal
        open={open}
        onClose={handleDialogToggle}
        onSubmit={handleSubmit(onSubmit)}
        title={'Tambah Pengguna'}
        size="sm"
        showActions={true}
      >
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Nama'
                      onChange={onChange}
                      placeholder='Cakra'
                      error={Boolean(errors.name)}
                      {...(errors.name && { helperText: errors.name.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='userName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Username'
                      onChange={onChange}
                      placeholder='cakra'
                      error={Boolean(errors.userName)}
                      {...(errors.userName && { helperText: errors.userName.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
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
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder='cakra@email.com'
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Password'
                      value={value}
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
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='pin'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='PIN (4 digit)'
                      onChange={onChange}
                      placeholder='1234'
                      error={Boolean(errors.pin)}
                      {...(errors.pin && { helperText: errors.pin.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='roleId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
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
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='description'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Deskripsi'
                      value={value}
                      onChange={onChange}
                      placeholder='akun cakra'
                      multiline
                      rows={3}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </BaseModal>
    </>
  )
}

export default TableHeader
