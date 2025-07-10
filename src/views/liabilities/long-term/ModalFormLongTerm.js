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
  Typography,
  InputAdornment
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomTextField from 'src/@core/components/mui/text-field'
import { addLongTerm, editLongTerm, fetchLongTermDetail } from 'src/store/apps/liabilities/long-term'
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
  }
  .react-datepicker__month-option {
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
  }
  .react-datepicker__year-option:hover {
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

export default function ModalFormLongTerm({ open, setOpen, typeModal = 'ADD', id }) {
  const dispatch = useDispatch()
  const { detailLongTerm, loadingDetailLongTerm } = useSelector(state => state.longTerm)

  const schema = yup.object({
    date: yup.date().required().typeError('Tanggal harus diisi'),
    shareholderLoans: yup
      .number()
      .transform(value => (isNaN(value) ? null : value))
      .required('Pinjaman Kepada Pemegang Saham harus diisi')
      .min(0, 'Nilai harus bernilai positif'),
    longTermBankLoans: yup
      .number()
      .transform(value => (isNaN(value) ? null : value))
      .required('Hutang Bank Jangka Panjang harus diisi')
      .min(0, 'Nilai harus bernilai positif'),
    otherLongtermLiabilities: yup
      .number()
      .transform(value => (isNaN(value) ? null : value))
      .required('Kewajiban Jangka Panjang Lainnya harus diisi')
      .min(0, 'Nilai harus bernilai positif'),
    totalLongtermLiabilities: yup
      .number()
      .transform(value => (isNaN(value) ? null : value))
      .required('Jumlah Liabilitas Jangka Panjang harus diisi')
      .min(0, 'Nilai harus bernilai positif'),
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

  // Watch values for calculating total
  const watchedValues = watch(['shareholderLoans', 'longTermBankLoans', 'otherLongtermLiabilities'])

  // Calculate total automatically
  useEffect(() => {
    const [shareholders, bankLoans, otherLiabilities] = watchedValues
    const total = [shareholders, bankLoans, otherLiabilities].reduce((sum, value) => {
      const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, ''), 10) : value
      return sum + (isNaN(numericValue) ? 0 : numericValue)
    }, 0)
    setValue('totalLongtermLiabilities', total)
  }, [watchedValues, setValue])

  const handleClose = () => {
    reset()
    setOpen(false)
  }

  // Format date transformation helper
  const transformDetailLongTerm = data => {
    if (!data) return null
    return {
      ...data,
      date: data.date ? new Date(data.date) : null,
      shareholderLoans: data.shareHolderLoans || '',
      longTermBankLoans: data.longTermBankLoans || '',
      otherLongtermLiabilities: data.otherLongtermLiabilities || '',
      totalLongtermLiabilities: data.totalLongtermLiabilities || '',
      notes: data.notes || ''
    }
  }

  useEffect(() => {
    if (typeModal === 'ADD') {
      reset({
        date: null,
        shareholderLoans: '',
        longTermBankLoans: '',
        otherLongtermLiabilities: '',
        totalLongtermLiabilities: '',
        notes: ''
      })
    } else if (typeModal === 'EDIT' && id) {
      dispatch(fetchLongTermDetail(id))
    }
  }, [typeModal, id, dispatch, reset])

  useEffect(() => {
    if (typeModal === 'EDIT' && detailLongTerm) {
      const transformedData = transformDetailLongTerm(detailLongTerm)
      if (transformedData) {
        reset(transformedData)
      }
    }
  }, [detailLongTerm, typeModal, reset])

  const onSubmit = data => {
    // Format date to YYYY-MM-DD using local timezone
    const formattedData = {
      ...data,
      date: data.date
        ? `${data.date.getFullYear()}-${String(data.date.getMonth() + 1).padStart(2, '0')}-${String(
            data.date.getDate()
          ).padStart(2, '0')}`
        : '',
      shareHolderLoans: data.shareholderLoans, // Backend expects shareHolderLoans
      longTermBankLoans: data.longTermBankLoans,
      otherLongtermLiabilities: data.otherLongtermLiabilities,
      totalLongtermLiabilities: data.totalLongtermLiabilities,
      notes: data.notes
    }

    // Remove frontend-only fields
    delete formattedData.shareholderLoans

    if (typeModal === 'EDIT') {
      dispatch(editLongTerm({ id, data: formattedData }))
    } else {
      dispatch(addLongTerm(formattedData))
    }

    handleClose()
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
                  ? 'Tambahkan Liabilitas Jangka Panjang'
                  : typeModal === 'VIEW'
                  ? 'Detail Liabilitas Jangka Panjang'
                  : 'Ubah Liabilitas Jangka Panjang'}
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='date'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Box sx={{ overflow: 'visible', position: 'relative', zIndex: 1500 }}>
                      <DatePicker
                        selected={value}
                        onChange={onChange}
                        dateFormat='MMM yyyy'
                        showMonthYearPicker
                        showFullMonthYearPicker={false}
                        disabled={typeModal === 'VIEW'}
                        placeholderText='Pilih bulan & tahun'
                        customInput={
                          <CustomTextField
                            fullWidth
                            label='Tanggal'
                            placeholder='Pilih bulan & tahun'
                            error={Boolean(errors.date)}
                            helperText={errors.date?.message}
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
              <Grid item xs={12} sm={6}>
                <Controller
                  name='shareholderLoans'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Pinjaman Kepada Pemegang Saham'
                      onChange={e => {
                        const numericValue = e.target.value.replace(/[^\d]/g, '')
                        onChange(numericValue)
                      }}
                      error={Boolean(errors.shareholderLoans)}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan nilai pinjaman'
                      helperText={errors.shareholderLoans?.message}
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
                  name='longTermBankLoans'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Hutang Bank Jangka Panjang'
                      onChange={e => {
                        const numericValue = e.target.value.replace(/[^\d]/g, '')
                        onChange(numericValue)
                      }}
                      error={Boolean(errors.longTermBankLoans)}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan hutang bank'
                      helperText={errors.longTermBankLoans?.message}
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
                  name='otherLongtermLiabilities'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Kewajiban Jangka Panjang Lainnya'
                      onChange={e => {
                        const numericValue = e.target.value.replace(/[^\d]/g, '')
                        onChange(numericValue)
                      }}
                      error={Boolean(errors.otherLongtermLiabilities)}
                      disabled={typeModal === 'VIEW'}
                      placeholder='Masukkan kewajiban lainnya'
                      helperText={errors.otherLongtermLiabilities?.message}
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
                  name='totalLongtermLiabilities'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Jumlah Liabilitas Jangka Panjang'
                      disabled={true}
                      placeholder='Total akan dihitung otomatis'
                      helperText={errors.totalLongtermLiabilities?.message}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>Rp</InputAdornment>,
                        value: value ? priceFormat(value) : ''
                      }}
                      sx={{
                        '& .MuiInputBase-input.Mui-disabled': {
                          color: 'text.primary',
                          WebkitTextFillColor: 'text.primary'
                        }
                      }}
                    />
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
