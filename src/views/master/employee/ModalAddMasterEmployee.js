import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Switch,
  Typography,
  Checkbox
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomTextField from 'src/@core/components/mui/text-field'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { addMasterDataEmployee, editMasterDataEmployee } from 'src/store/apps/master/employee'
import { priceFormat } from 'src/helpers/priceFormatter'

const statusOptions = ['Tetap', 'Kontrak', 'Magang']
const roleOptions = [
  'Manager',
  'Supervisor',
  'Staff',
  'Admin',
  'Kasir',
  'Driver',
  'Helper',
  'Security',
  'Cleaning Service'
]

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

export default function ModalAddMasterEmployee({ open, setOpen, typeModal = 'ADD', id }) {
  const dispatch = useDispatch()

  const { detail: dataDetail, defaultValue } = useSelector(state => state.masterEmployee)

  const schema = yup.object({
    nama: yup.string().required('Nama karyawan harus diisi'),
    phone: yup.string().nullable(),
    address: yup.string().nullable(),
    dob: yup.date().nullable(),
    sex: yup.string().nullable(),
    role: yup.string().nullable(),
    status: yup.string().nullable(),
    salary: yup
      .number()
      .transform(value => (isNaN(value) ? null : value))
      .nullable(),
    bonus: yup
      .number()
      .transform(value => (isNaN(value) ? null : value))
      .nullable(),
    is_active: yup.boolean().nullable()
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleClose = () => {
    if (typeModal === 'ADD') {
      reset(defaultValue)
    }
    setOpen(false)
  }

  useEffect(() => {
    if (typeModal === 'ADD') {
      reset(defaultValue)
    } else {
      reset({
        ...dataDetail
      })
    }
  }, [dataDetail, defaultValue, reset, typeModal])

  const onSubmit = data => {
    if (typeModal === 'EDIT') {
      dispatch(editMasterDataEmployee({ id, data, setOpen }))
    } else {
      dispatch(addMasterDataEmployee({ data, setOpen }))
    }
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        scroll='body'
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <CustomCloseButton onClick={handleClose}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant='h3' sx={{ mb: 3 }}>
                {typeModal === 'ADD' ? 'Tambahkan Karyawan Baru' : typeModal === 'VIEW' ? 'Detail Karyawan' : 'Ubah Karyawan'}
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='nama'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value || ''}
                      label='Nama Karyawan'
                      onChange={onChange}
                      error={Boolean(errors.nama)}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Nama Karyawan'
                      helperText={errors.nama?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='phone'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value || ''}
                      label='Nomor Telepon'
                      onChange={onChange}
                      error={Boolean(errors.phone)}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Nomor Telepon'
                      helperText={errors.phone?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name='address'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      multiline
                      rows={3}
                      value={value || ''}
                      label='Alamat'
                      onChange={onChange}
                      error={Boolean(errors.address)}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Alamat'
                      helperText={errors.address?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='dob'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Box sx={{ overflow: 'visible' }}>
                      <DatePicker
                        selected={value ? new Date(value) : null}
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode='select' // This ensures full dropdown instead of scrollable menu
                        popperPlacement='bottom-start'
                        popperClassName='datepicker-popper'
                        popperModifiers={[
                          {
                            name: 'zIndex',
                            enabled: true,
                            phase: 'write',
                            fn: ({ state }) => {
                              state.styles.popper.zIndex = '1300' // Same as MUI Modal
                            }
                          }
                        ]}
                        id='dob-picker'
                        placeholderText='DD/MM/YYYY'
                        dateFormat='dd/MM/yyyy'
                        customInput={<PickersComponent label='Tanggal Lahir' />}
                        onChange={onChange}
                        disabled={typeModal === 'VIEW'}
                      />
                      {errors.dob && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.dob?.message}</FormHelperText>
                      )}
                    </Box>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='sex'
                  control={control}
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.sex)}>
                      <Typography sx={{ mb: 2 }}>Jenis Kelamin</Typography>
                      <RadioGroup row {...field} value={field.value || 'Laki-laki'}>
                        <FormControlLabel
                          value='Laki-laki'
                          label='Laki-laki'
                          control={<Radio color='primary' />}
                          disabled={typeModal === 'VIEW'}
                        />
                        <FormControlLabel
                          value='Perempuan'
                          label='Perempuan'
                          control={<Radio color='primary' />}
                          disabled={typeModal === 'VIEW'}
                        />
                      </RadioGroup>
                      {errors.sex && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.sex?.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='role'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Jabatan'
                      value={value || ''}
                      onChange={onChange}
                      error={Boolean(errors.role)}
                      disabled={typeModal === 'VIEW'}
                      helperText={errors.role?.message}
                    >
                      {roleOptions.map(option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='status'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Status'
                      value={value || ''}
                      onChange={onChange}
                      error={Boolean(errors.status)}
                      disabled={typeModal === 'VIEW'}
                      helperText={errors.status?.message}
                    >
                      {statusOptions.map(option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='salary'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Gaji'
                      onChange={e => {
                        const numericValue = e.target.value.replace(/[^\d]/g, '')
                        onChange(numericValue)
                      }}
                      error={Boolean(errors.salary)}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Gaji'
                      helperText={errors.salary?.message}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>Rp</InputAdornment>,
                        value: value ? priceFormat(value) : ''
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='bonus'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Bonus'
                      onChange={e => {
                        const numericValue = e.target.value.replace(/[^\d]/g, '')
                        onChange(numericValue)
                      }}
                      error={Boolean(errors.bonus)}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Bonus'
                      helperText={errors.bonus?.message}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>Rp</InputAdornment>,
                        value: value ? priceFormat(value) : ''
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl>
                  <Controller
                    name='is_active'
                    control={control}
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.is_active)}>
                        <Typography sx={{ mb: 2 }}>Status Karyawan</Typography>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Boolean(field.value)}
                              onChange={e => field.onChange(e.target.checked)}
                              disabled={typeModal === 'VIEW'}
                              color='primary'
                            />
                          }
                          label='Active'
                        />
                        {errors.is_active && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.is_active?.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            {typeModal !== 'VIEW' && (
              <>
                <Button variant='tonal' color='secondary' onClick={handleClose} hidden={typeModal === 'VIEW'}>
                  Cancel
                </Button>
                <Button type='submit' variant='contained' hidden={typeModal === 'VIEW'}>
                  Submit
                </Button>
              </>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}
