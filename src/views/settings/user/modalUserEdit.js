// Mui import
import {
  Box,
  Grid,
  MenuItem,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { useState } from 'react'

// Custom Component
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'

// Store
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { editUser } from 'src/store/apps/user'
import encrypt from 'src/utils/encrypt'
import { defaultValues, showErrors } from './TableHeader'
import BaseModal from 'src/views/common/BaseModal'

export default function ModalUserEdit({ data, isOpen, closePress, isView }) {
  // store
  const roleStore = useSelector(state => state.role.dataRoles)
  const warehouseStore = useSelector(state => state.warehouse.data)
  const [role, setRole] = useState(data.roleId || '')
  const [showPassword, setShowPassword] = useState(false)
  const [changePassword, setChangePassword] = useState(false)

  const schema = yup.object().shape({
    name: yup
      .string()
      .min(3, obj => showErrors('Nama', obj.value.length, obj.min))
      .required(),
    userName: yup
      .string()
      .min(3, obj => showErrors('Username', obj.value.length, obj.min))
      .required(),
    email: yup.string().email('Masukkan email yang valid').required('Email harus diisi'),
    description: yup.string().optional(),
    roleId: yup.string().required('Otoritas harus diisi'),
    warehouseId: yup
      .string()
      .nullable()
      .test('warehouse-validation', 'Gudang harus diisi jika otoritas adalah admin gudang', (val, context) =>
        validateWarehouseId(val, context)
      ),
    password: yup
      .string()
      .nullable()
      .test('renew-password-validation', 'Password harus diisi jika ingin mengganti password', (val, context) =>
        validateNewPassword(val, context, changePassword)
      )
  })

  const validateWarehouseId = (val, context) => {
    if (role == 3 && !val) {
      return false
    } else {
      return true
    }
  }

  const validateNewPassword = (val, context, changePassword) => {
    if (changePassword) {
      if (!val) {
        throw new yup.ValidationError('Password harus diisi jika ingin mengganti password', null, context.path)
      } else if (val.length < 5) {
        throw new yup.ValidationError('Password minimal 5 karakter', null, context.path)
      } else {
        return true
      }
    } else {
      return true
    }
  }

  // Hooks
  const dispatch = useDispatch()

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues,
    values: data,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmitEdit = (data, e) => {
    e.preventDefault()
    let input = {}
    if (changePassword) {
      let encryptPassword = encrypt(data.password)
      delete data?.password
      input = { ...data, password: encryptPassword }
    } else {
      delete data?.password
      input = { ...data }
    }
    dispatch(editUser({ ...input }))
    closePress()
    reset()
  }

  return (
    <>
      <BaseModal
        open={isOpen}
        onClose={closePress}
        onSubmit={handleSubmit(onSubmitEdit)}
        title={'Edit Pengguna'}
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
                      disabled={isView}
                      placeholder='Cakra'
                      error={Boolean(errors.name)}
                      {...(errors.name && { helperText: errors.name.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={12} xs={8}>
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
                      disabled={isView}
                      placeholder='cakra'
                      error={Boolean(errors.userName)}
                      {...(errors.userName && { helperText: errors.userName.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='email'
                      disabled={isView}
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
              <Grid item sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'space-around', gap: 2 }}>
                <Controller
                  name='password'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Password'
                      value={value}
                      disabled={changePassword ? false : true}
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
                              disabled={!changePassword}
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
                <Box>
                  <Button
                    sx={{ fontSize: '12px', marginTop: '13px' }}
                    onClick={() => setChangePassword(!changePassword)}
                  >
                    Ganti password
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12}>
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
                      disabled={isView}
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
              </Grid>
              {role == 3 && (
                <Grid item xs={12}>
                  <Controller
                    name='warehouseId'
                    control={control}
                    defaultValue={data?.warehouseId ? data.warehouseId : ''}
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
                </Grid>
              )}
              <Grid item sm={12} xs={12}>
                <Controller
                  name='description'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      multiline
                      rows={3}
                      label='Deskripsi'
                      value={value}
                      onChange={onChange}
                      placeholder='akun cakra'
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
