// ** MUI Imports
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Store
import { addUser, editUser } from 'src/store/apps/user'

// ** Utils
import encrypt from 'src/utils/encrypt'
import { showErrors } from 'src/helpers/validationMessages'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'
import FormInputText from 'src/views/common/Form/FormInputText'
import FormSelectSimple from 'src/views/common/Form/FormSelectSimple'

const defaultValues = {
  email: '',
  name: '',
  userName: '',
  description: '',
  password: '',
  pin: '1234',
  roleId: '',
  warehouseId: ''
}

export default function ModalFormMasterUser({ open, setOpen, typeModal, data }) {
  const dispatch = useDispatch()
  const [role, setRole] = useState(typeModal === 'EDIT' ? data?.roleId || '' : '')
  const [showPassword, setShowPassword] = useState(false)
  const [changePassword, setChangePassword] = useState(false)

  const { dataRoles: roles } = useSelector(state => state.role)
  const { data: warehouses } = useSelector(state => state.warehouse)
  const { loadingAdd, loadingEdit } = useSelector(state => state.user)

  const isEdit = typeModal === 'EDIT'

  const validateWarehouseId = (val, context) => {
    if (role == 3 && !val) {
      return false
    } else {
      return true
    }
  }

  const validateNewPassword = (val, context) => {
    if (isEdit && changePassword) {
      if (!val) {
        throw new yup.ValidationError('Password harus diisi jika ingin mengganti password', null, context.path)
      } else if (val.length < 5) {
        throw new yup.ValidationError('Password minimal 5 karakter', null, context.path)
      }
    }
    return true
  }

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
    pin: yup
      .string()
      .matches(/^\d{4}$/, 'Pin harus 4 digit')
      .required('Pin harus diisi'),
    roleId: yup.string().required('Otoritas harus diisi'),
    warehouseId: yup
      .string()
      .nullable()
      .test('warehouse-validation', 'Gudang harus diisi jika otoritas adalah admin gudang', (val, context) =>
        validateWarehouseId(val, context)
      ),
    password: isEdit
      ? yup
          .string()
          .nullable()
          .test('renew-password-validation', 'Password harus diisi jika ingin mengganti password', (val, context) =>
            validateNewPassword(val, context)
          )
      : yup
          .string()
          .min(5, obj => showErrors('Password', obj.value.length, obj.min))
          .required()
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    values: isEdit ? data : defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = formData => {
    let input = { ...formData }
    if (isEdit) {
      if (changePassword) {
        input = { ...input, password: encrypt(input.password) }
      } else {
        delete input.password
      }
      dispatch(editUser({ id: data.id, data: input, setOpen }))
    } else {
      input = { ...input, password: encrypt(input.password) }
      dispatch(addUser({ data: input, setOpen }))
    }
  }

  return (
    <AppModal
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={isEdit ? 'Ubah Pengguna' : 'Tambah Pengguna Baru'}
      size='sm'
      loading={isEdit ? loadingEdit : loadingAdd}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <FormInputText label='Nama' name='name' control={control} errors={errors} placeholder='Cakra' />
        </Grid>
        <Grid item xs={12}>
          <FormInputText
            label='Username'
            name='userName'
            control={control}
            errors={errors}
            placeholder='cakra'
          />
        </Grid>
        <Grid item xs={12}>
          <FormInputText
            label='Email'
            name='email'
            type='email'
            control={control}
            errors={errors}
            placeholder='cakra@email.com'
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='password'
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <FormInputTextPassword
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                locked={isEdit && !changePassword}
                changing={isEdit && changePassword}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onChangePassword={() => {
                  setValue('password', '')
                  setChangePassword(true)
                }}
                onCancelChange={() => {
                  setValue('password', '')
                  setShowPassword(false)
                  setChangePassword(false)
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <FormSelectSimple
            label='Pilih Otoritas'
            name='roleId'
            control={control}
            errors={errors}
            data={roles}
            optionsValue='id'
            optionsLabel='name'
            onChange={event => setRole(event.target.value)}
          />
        </Grid>
        {role == 3 && (
          <Grid item xs={12}>
            <FormSelectSimple
              label='Pilih Gudang'
              name='warehouseId'
              control={control}
              errors={errors}
              data={warehouses}
              optionsValue='id'
              optionsLabel='name'
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <FormInputText
            label='PIN (4 digit)'
            name='pin'
            control={control}
            errors={errors}
            placeholder='1234'
          />
        </Grid>
        <Grid item xs={12}>
          <FormInputText
            label='Deskripsi'
            name='description'
            control={control}
            errors={errors}
            placeholder='akun cakra'
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
    </AppModal>
  )
}

// ** Password field needs a visibility toggle `FormInputText` doesn't support.
// Editing a user keeps the field locked (masked) until "Ganti" is pressed; the
// stored password is never shown, so the field starts empty when unlocked.
function FormInputTextPassword({
  value,
  onChange,
  onBlur,
  locked,
  changing,
  error,
  helperText,
  showPassword,
  setShowPassword,
  onChangePassword,
  onCancelChange
}) {
  return (
    <CustomTextField
      fullWidth
      keepDisabledField
      label='Password'
      value={locked ? '••••••••' : value ?? ''}
      disabled={locked}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText || (changing ? 'Minimal 5 karakter' : undefined)}
      placeholder={changing ? 'Password baru' : undefined}
      type={locked || showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            {locked ? (
              <Button size='small' onClick={onChangePassword} sx={{ mr: 1.5, fontSize: '0.75rem' }}>
                Ganti
              </Button>
            ) : (
              <>
                <IconButton
                  edge='end'
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                </IconButton>
                {changing && (
                  <Button size='small' onClick={onCancelChange} sx={{ mx: 1.5, fontSize: '0.75rem' }}>
                    Batal
                  </Button>
                )}
              </>
            )}
          </InputAdornment>
        )
      }}
    />
  )
}
