import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import { useTheme } from '@mui/material'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'
import DatePickerHighZIndexStyles from 'src/views/common/DatePickerHighZIndexStyles'

// ** Store
import { createMasterNonCurrentAsset, updateMasterNonCurrentAsset } from 'src/store/apps/asset/master-non-current'

// ** Data & Helpers
import { nonCurrentAssetsType } from 'src/data/nonCurrentAssetsType'
import { priceFormat } from 'src/helpers/priceFormatter'

const schema = yup.object({
  name: yup.string().required('Nama aset harus diisi'),
  assetValue: yup
    .number()
    .transform(value => (isNaN(value) ? null : value))
    .required('Nilai aset harus diisi')
    .positive('Nilai aset harus bernilai positif'),
  assetType: yup.string().required('Jenis aset harus diisi'),
  acquisitionDate: yup.date().required().typeError('Waktu akuisisi harus diisi'),
  depreciationMonths: yup
    .number()
    .transform(value => (isNaN(value) ? null : value))
    .when('assetType', {
      is: assetType => assetType === 'VEHICLE' || assetType === 'BUILDING',
      then: schema =>
        schema.required('Bulan depresiasi harus diisi').positive('Bulan depresiasi harus bernilai positif'),
      otherwise: schema => schema.nullable()
    }),
  notes: yup.string().nullable()
})

/**
 * ModalFormMasterNonCurrentAssets
 * -------------------------------------------------------------------------------------
 * Add/Edit dialog for a master non-current (fixed) asset. Uses the shared
 * `AppModal` shell; the Periode-style date picker matches Sales Order's
 * DatePicker usage (`PickersComponent` + `popperPlacement`).
 *
 * View mode has its own dedicated dialog (`ModalViewMasterNonCurrentAsset`) —
 * this component only ever renders ADD/EDIT.
 */
export default function ModalFormMasterNonCurrentAssets({ open, setOpen, typeModal = 'ADD', data }) {
  const dispatch = useDispatch()
  const { defaultValue, loadingAction } = useSelector(state => state.masterNonCurrentAsset)

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // Watch assetType to disable depreciationMonths for VEHICLE and BUILDING
  const watchedAssetType = watch('assetType')
  const isDepreciationDisabled = watchedAssetType !== 'VEHICLE' && watchedAssetType !== 'BUILDING'

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
      reset({ ...data })
    }
  }, [defaultValue, typeModal, data, open])

  // Clear depreciationMonths when assetType is VEHICLE or BUILDING
  useEffect(() => {
    if (isDepreciationDisabled) {
      setValue('depreciationMonths', '')
    }
  }, [isDepreciationDisabled, setValue])

  const onSubmit = formValues => {
    // Format acquisitionDate to YYYY-MM-DD using local timezone
    const formattedData = {
      ...formValues,
      acquisitionDate: formValues.acquisitionDate
        ? `${formValues.acquisitionDate.getFullYear()}-${String(formValues.acquisitionDate.getMonth() + 1).padStart(
            2,
            '0'
          )}-${String(formValues.acquisitionDate.getDate()).padStart(2, '0')}`
        : ''
    }

    if (typeModal === 'EDIT') {
      dispatch(updateMasterNonCurrentAsset({ id: data.id, data: formattedData, setOpen }))
    } else {
      dispatch(createMasterNonCurrentAsset({ data: formattedData, setOpen }))
    }
  }

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Tambah Aset Tidak Lancar' : 'Ubah Aset Tidak Lancar'}
      size='sm'
      loading={loadingAction}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value || ''}
                label='Nama Aset'
                onChange={onChange}
                error={Boolean(errors.name)}
                placeholder='Masukkan Nama Aset'
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name='assetType'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                fullWidth
                label='Jenis Aset'
                value={value || ''}
                onChange={onChange}
                error={Boolean(errors.assetType)}
                helperText={errors.assetType?.message}
                displayEmpty
                SelectProps={{
                  displayEmpty: true,
                  renderValue: selected => {
                    if (!selected || selected === '') {
                      return <span style={{ color: '#999' }}>Pilih jenis aset</span>
                    }
                    const selectedOption = nonCurrentAssetsType.find(option => option.value === selected)
                    return selectedOption ? selectedOption.key : selected
                  }
                }}
              >
                <MenuItem value='' disabled>
                  Pilih jenis aset
                </MenuItem>
                {nonCurrentAssetsType.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.key}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name='assetValue'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label='Nilai Aset'
                onChange={e => {
                  const numericValue = e.target.value.replace(/[^\d]/g, '')
                  onChange(numericValue)
                }}
                error={Boolean(errors.assetValue)}
                placeholder='Masukkan Nilai Aset'
                helperText={errors.assetValue?.message}
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
            name='depreciationMonths'
            control={control}
            rules={{ required: !isDepreciationDisabled }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='number'
                value={isDepreciationDisabled ? '' : value || ''}
                defaultValue=''
                label='Waktu Depresiasi (Bulan)'
                onChange={onChange}
                error={Boolean(errors.depreciationMonths)}
                disabled={isDepreciationDisabled}
                placeholder={isDepreciationDisabled ? '' : 'Dalam bulan'}
                helperText={errors.depreciationMonths?.message}
                inputProps={{ min: 1 }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name='acquisitionDate'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <DatePicker
                selected={value ? new Date(value) : null}
                onChange={onChange}
                dateFormat='MMM yyyy'
                showMonthYearPicker
                popperPlacement={popperPlacement}
                popperProps={{ strategy: 'fixed' }}
                popperClassName='high-z-index-popper'
                placeholderText='Pilih bulan & tahun'
                customInput={
                  <PickersComponent
                    fullWidth
                    label='Waktu Akuisisi'
                    placeholder='Pilih waktu akuisisi'
                    error={Boolean(errors.acquisitionDate)}
                    helperText={errors.acquisitionDate?.message}
                  />
                }
              />
            )}
          />
          <DatePickerHighZIndexStyles />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name='notes'
            control={control}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                value={value || ''}
                label='Catatan'
                onChange={onChange}
                error={Boolean(errors.notes)}
                placeholder='Masukkan Catatan (Opsional)'
                helperText={errors.notes?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </AppModal>
  )
}
