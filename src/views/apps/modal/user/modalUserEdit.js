// Mui import
import { Dialog, DialogContent, Box, Typography, Fade, Grid, MenuItem, Button } from '@mui/material'
import { forwardRef } from 'react'

// Custom Component
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'

// Store
import { useSelector, useDispatch } from 'react-redux'
import { defaultValues, showErrors } from '../../user/list/AddUserDrawer'
import { CustomCloseButton } from 'src/views/pages/dialog-examples/DialogEditUserInfo'
import Icon from 'src/@core/components/icon'
import { editUser } from 'src/store/apps/user'

export const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

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
  roleId: yup.string().required('Otoritas harus diisi')
})

export default function ModalUserEdit({ data, isOpen, closePress, isView }) {
  // store
  const roleStore = useSelector(state => state.role.dataRoles)

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
    dispatch(editUser({ ...data }))
    closePress()
    reset()
  }

  return (
    <>
      <Dialog
        fullWidth
        open={isOpen}
        onClose={closePress}
        maxWidth='sm'
        scroll='body'
        TransitionComponent={Transition}
        onBackdropClick={closePress}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={closePress}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            {isView ? (
              <>
                <Typography variant='h3' sx={{ mb: 3 }}>
                  Informasi Akun {data?.name}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant='h3' sx={{ mb: 3 }}>
                  Sunting Informasi Akun
                </Typography>
                <Typography variant='h6' sx={{ mb: 3 }}>
                  Anda akan menyunting akun {data?.name}
                </Typography>
              </>
            )}
          </Box>
          <form onSubmit={handleSubmit(onSubmitEdit)}>
            <Grid container spacing={1}>
              <Grid item sm={12} xs={12}>
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
                      sx={{ mb: 4 }}
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
                      sx={{ mb: 4 }}
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
                        onChange: e => onChange(e)
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
                      sx={{ mb: 4 }}
                      onChange={onChange}
                      placeholder='akun cakra'
                      disabled={isView}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
              <Button variant='tonal' color='secondary' onClick={closePress}>
                Cancel
              </Button>
              {!isView && (
                <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                  Submit
                </Button>
              )}
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
