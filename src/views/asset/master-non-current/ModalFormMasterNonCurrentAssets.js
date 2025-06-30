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
  Grid,
  IconButton,
  MenuItem,
  Typography,
  InputAdornment
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomTextField from 'src/@core/components/mui/text-field'
import { createMasterNonCurrentAsset, updateMasterNonCurrentAsset } from 'src/store/apps/asset/master-non-current'
import { nonCurrentAssetsType } from 'src/data/nonCurrentAssetsType'
import { priceFormat } from 'src/helpers/priceFormatter'

// Global styles for DatePicker
const datePickerStyles = `
  .react-datepicker-popper {
    z-index: 1500 !important;
  }
  .react-datepicker {
    z-index: 1500 !important;
  }
  .high-z-index-popper {
    z-index: 1500 !important;
  }
  .react-datepicker__month-year-dropdown-container {
    display: flex;
    gap: 10px;
  }
  .react-datepicker__month-dropdown {
    min-width: 120px !important;
    width: 120px !important;
  }  .react-datepicker__month-option {
    width: 100% !important;
    text-align: center;
    padding: 12px 16px !important;
    margin: 4px 0 !important;
    line-height: 1.6 !important;
    min-height: 40px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 4px !important;
  }
  .react-datepicker__month-option:hover {
    background-color: #e3f2fd !important;
  }
  .react-datepicker__month-year-dropdown {
    min-width: 120px !important;
    max-height: 200px !important;
    overflow-y: auto !important;
  }
  .react-datepicker__year-option {
    padding: 12px 16px !important;
    margin: 4px 0 !important;
    line-height: 1.6 !important;
    min-height: 40px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 4px !important;
  }  .react-datepicker__year-option:hover {
    background-color: #e3f2fd !important;
  }
`

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

export default function ModalFormMasterNonCurrentAssets({ open, setOpen, typeModal = 'ADD', data }) {
  const dispatch = useDispatch()
  const { detail: dataDetail, defaultValue } = useSelector(state => state.masterNonCurrentAsset)

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
      reset({
        ...data
      })
    }
  }, [dataDetail, defaultValue, reset, typeModal, data])
  

  // Clear depreciationMonths when assetType is VEHICLE or BUILDING
  useEffect(() => {
    if (isDepreciationDisabled) {
      setValue('depreciationMonths', '')
    }
  }, [isDepreciationDisabled, setValue, watch])

  const onSubmit = data => {
    // Format acquisitionDate to YYYY-MM-DD using local timezone
    const formattedData = {
      ...data,
      acquisitionDate: data.acquisitionDate 
        ? `${data.acquisitionDate.getFullYear()}-${String(data.acquisitionDate.getMonth() + 1).padStart(2, '0')}-${String(data.acquisitionDate.getDate()).padStart(2, '0')}`
        : ''
    }

    if (typeModal === 'EDIT') {
      dispatch(updateMasterNonCurrentAsset({ id: data.id, data: formattedData, setOpen }))
    } else {
      dispatch(createMasterNonCurrentAsset({ data: formattedData, setOpen }))
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
                {typeModal === 'ADD'
                  ? 'Tambahkan Aset Tidak Lancar'
                  : typeModal === 'VIEW'
                  ? 'Detail Aset Tidak Lancar'
                  : 'Ubah Aset Tidak Lancar'}
              </Typography>
            </Box>
            <Grid container spacing={6}>
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
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Nama Aset'
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>{' '}
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
                      disabled={typeModal === 'VIEW'}
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
              <Grid item xs={12} sm={6}>
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
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Nilai Aset'
                      helperText={errors.assetValue?.message}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>Rp</InputAdornment>,
                        value: value ? priceFormat(value) : ''
                      }}
                    />
                  )}
                />
              </Grid>{' '}
              <Grid item xs={12} sm={3}>
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
                      disabled={typeModal === 'VIEW' || isDepreciationDisabled}
                      placeholder={isDepreciationDisabled ? '' : 'Dalam bulan'}
                      helperText={errors.depreciationMonths?.message}
                      inputProps={{
                        min: 1
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Controller
                  name='acquisitionDate'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Box sx={{ overflow: 'visible', position: 'relative', zIndex: 1500 }}>
                      <DatePicker
                        selected={value ? new Date(value) : null}
                        onChange={onChange}
                        dateFormat='MMM yyyy'
                        showMonthYearPicker
                        showFullMonthYearPicker={false}
                        disabled={typeModal === 'VIEW'}
                        placeholderText='Pilih bulan & tahun'
                        customInput={
                          <CustomTextField
                            fullWidth
                            label='Waktu Akuisisi'
                            placeholder='Pilih waktu akuisisi'
                            error={Boolean(errors.acquisitionDate)}
                            helperText={errors.acquisitionDate?.message}
                            InputProps={{
                              style: { cursor: 'pointer' }
                            }}
                          />
                        }
                        popperProps={{
                          strategy: 'fixed',
                          modifiers: [
                            {
                              name: 'preventOverflow',
                              options: {
                                boundary: 'viewport'
                              }
                            },
                            {
                              name: 'flip',
                              options: {
                                fallbackPlacements: ['top-start', 'bottom-start', 'top-end', 'bottom-end']
                              }
                            },
                            {
                              name: 'offset',
                              options: {
                                offset: [0, 8]
                              }
                            }
                          ]
                        }}
                        popperClassName='high-z-index-popper'
                      />
                    </Box>
                  )}
                />
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
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan Catatan (Opsional)'
                      helperText={errors.notes?.message}
                    />
                  )}
                />
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
      <style jsx global>
        {datePickerStyles}
      </style>
    </Card>
  )
}
