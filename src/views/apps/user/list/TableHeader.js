// ** MUI Imports
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, MenuItem } from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { showErrors } from './AddUserDrawer'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { addUser } from 'src/store/apps/user'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'

const defaultValues = {
  email: '',
  name: '',
  user_name: '',
  description: '',
  RoleId: ''
}

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

const TableHeader = props => {
  // ** Props
  const { handleFilter, value, clearFilter } = props
  const dispatch = useDispatch()

  const roleStore = useSelector(state => state.role.dataRoles)

  // ** State
  const [open, setOpen] = useState(false)

  const handleDialogToggle = () => {
    setOpen(!open)
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
    dispatch(addUser({ ...data }))
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
            <CustomTextField value={value} placeholder='Cari Pengguna' onChange={e => handleFilter(e.target.value)} />
            <Button
              onClick={e => {
                clearFilter()
              }}
              sx={{ ml: -12, p: 0 }}
              color='secondary'
            >
              X
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button onClick={handleDialogToggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              Tambah Pengguna Baru
            </Button>
          </Box>
        </Box>
      </Box>
      <Dialog fullWidth maxWidth='sm' onClose={handleDialogToggle} open={open}>
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
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
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
