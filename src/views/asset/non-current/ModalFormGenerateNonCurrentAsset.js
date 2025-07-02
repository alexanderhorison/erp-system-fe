import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { Box, Button, Card, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomCloseButton from 'src/views/common/CustomCloseButton'
import { createMonthlyNonCurrentAsset } from 'src/store/apps/asset/non-current'
import { useEffect } from 'react'

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

export default function ModalFormGenerateNonCurrentAssets({ open, setOpen }) {
  const dispatch = useDispatch()

  const defaultValues = {
    nonCurrentDate: '',
    notes: ''
  }

  const schema = yup.object({
    nonCurrentDate: yup.date().required('Waktu harus diisi'),
    notes: yup.string().nullable()
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: defaultValues
  })

  const handleClose = () => {
    reset(defaultValues)
    setOpen(false)
  }

  const onSubmit = data => {
    const formattedData = {
      date: `${data.nonCurrentDate.getFullYear()}-${String(data.nonCurrentDate.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(data.nonCurrentDate.getDate()).padStart(2, '0')}`,
      notes: data.notes || ''
    }
    dispatch(
      createMonthlyNonCurrentAsset({
        data: formattedData,
        setOpen: setOpen
      })
    )
  }

  useEffect(() => {
    // Reset form when modal opens
    if (open) {
      reset(defaultValues)
    }
  }, [open, reset])

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='sm'
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
                Buat Aset Tidak Lancar Bulanan
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={12}>
                <Controller
                  name='nonCurrentDate'
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
                        maxDate={
                          new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() - 1,
                            new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()
                          )
                        }
                        placeholderText='Pilih bulan & tahun'
                        customInput={
                          <CustomTextField
                            fullWidth
                            label='Pilih bulan & tahun'
                            error={Boolean(errors.nonCurrentDate)}
                            helperText={errors.nonCurrentDate?.message}
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
            <Button variant='tonal' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' variant='contained'>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <style jsx global>
        {datePickerStyles}
      </style>
    </Card>
  )
}
