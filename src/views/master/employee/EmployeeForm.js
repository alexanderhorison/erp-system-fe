import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Store
import { addMasterDataEmployee, editMasterDataEmployee } from 'src/store/apps/master/employee'
import { priceFormat } from 'src/helpers/priceFormatter'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import FormActionBar from 'src/views/common/FormActionBar'
import SectionHeading from 'src/views/common/SectionHeading'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

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

const surfaceCardSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

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

/**
 * EmployeeForm
 * -------------------------------------------------------------------------------------
 * Shared body for the add and edit employee pages — same fields, same
 * numbered-section layout, only the submit thunk and initial values differ.
 */
export default function EmployeeForm({ mode, id }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { detail: dataDetail, loadingDetail, defaultValue, loadingAdd, loadingEdit } = useSelector(
    state => state.masterEmployee
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (mode === 'ADD') {
      reset(defaultValue)
    } else {
      reset({ ...dataDetail })
    }
  }, [mode, dataDetail, defaultValue, reset])

  const onSubmit = data => {
    if (mode === 'EDIT') {
      dispatch(editMasterDataEmployee({ id, data, router }))
    } else {
      dispatch(addMasterDataEmployee({ data, router }))
    }
  }

  const loading = mode === 'ADD' ? loadingAdd : loadingEdit

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title={mode === 'ADD' ? 'Tambah Karyawan baru' : 'Ubah Karyawan'}
        onBack={() => router.back()}
        breadcrumbs={[
          { label: 'Daily Cost' },
          { label: 'Master Data' },
          { label: 'Employees', href: '/master/employee' },
          { label: mode === 'ADD' ? 'Tambah' : 'Ubah' }
        ]}
      />

      {/* No `spacing` on this container: `FormActionBar`'s negative margins are
          measured against the content column, and grid gutters would offset it. */}
      <Grid container>
        <Grid item xs={12}>
          <SectionHeading number={1} title='Informasi Pribadi' />
          <Card elevation={0} sx={{ ...surfaceCardSx, mb: 4 }}>
            <CardContent sx={{ p: 5 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='nama'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value || ''}
                        label='Nama Karyawan'
                        onChange={onChange}
                        error={Boolean(errors.nama)}
                        disabled={mode === 'VIEW' || loadingDetail}
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
                        disabled={mode === 'VIEW' || loadingDetail}
                        placeholder='Masukkan Nomor Telepon'
                        helperText={errors.phone?.message}
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
                          dropdownMode='select'
                          popperPlacement='bottom-start'
                          popperClassName='datepicker-popper'
                          popperModifiers={[
                            {
                              name: 'zIndex',
                              enabled: true,
                              phase: 'write',
                              fn: ({ state }) => {
                                state.styles.popper.zIndex = '1300'
                              }
                            }
                          ]}
                          id='dob-picker'
                          placeholderText='DD/MM/YYYY'
                          dateFormat='dd/MM/yyyy'
                          customInput={<PickersComponent label='Tanggal Lahir' />}
                          onChange={onChange}
                          disabled={mode === 'VIEW' || loadingDetail}
                        />
                        {errors.dob && <FormHelperText sx={{ color: 'error.main' }}>{errors.dob?.message}</FormHelperText>}
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
                        <Typography sx={{ mb: 2, fontSize: '0.8125rem', color: colors.foreground }}>
                          Jenis Kelamin
                        </Typography>
                        <RadioGroup row {...field} value={field.value || 'Laki-laki'}>
                          <FormControlLabel
                            value='Laki-laki'
                            label='Laki-laki'
                            control={<Radio color='primary' />}
                            disabled={mode === 'VIEW' || loadingDetail}
                          />
                          <FormControlLabel
                            value='Perempuan'
                            label='Perempuan'
                            control={<Radio color='primary' />}
                            disabled={mode === 'VIEW' || loadingDetail}
                          />
                        </RadioGroup>
                        {errors.sex && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.sex?.message}</FormHelperText>
                        )}
                      </FormControl>
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
                        disabled={mode === 'VIEW' || loadingDetail}
                        placeholder='Masukkan Alamat'
                        helperText={errors.address?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <SectionHeading number={2} title='Informasi Pekerjaan' />
          <Card elevation={0} sx={{ ...surfaceCardSx, mb: 4 }}>
            <CardContent sx={{ p: 5 }}>
              <Grid container spacing={4}>
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
                        disabled={mode === 'VIEW' || loadingDetail}
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
                        disabled={mode === 'VIEW' || loadingDetail}
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
                        disabled={mode === 'VIEW' || loadingDetail}
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
                        disabled={mode === 'VIEW' || loadingDetail}
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
                  <Controller
                    name='is_active'
                    control={control}
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.is_active)}>
                        <Typography sx={{ mb: 2, fontSize: '0.8125rem', color: colors.foreground }}>
                          Status Karyawan
                        </Typography>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Boolean(field.value)}
                              onChange={e => field.onChange(e.target.checked)}
                              disabled={mode === 'VIEW' || loadingDetail}
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
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <FormActionBar
            onCancel={() => router.back()}
            loading={loading}
            submitLabel='Submit'
            cancelLabel='Cancel'
            loadingLabel='Submitting...'
          />
        </Grid>
      </Grid>
    </form>
  )
}
