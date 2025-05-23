import { Button, Card, Dialog, DialogActions, DialogContent, Grid, IconButton, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/system'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import safeNumberHandler from 'src/helpers/formFormatter'
import { fetchAddEmployeeDebt } from 'src/store/apps/master/employee'

// Add formatNumber function to format numbers with commas
const formatNumber = value => {
  if (value === null || value === undefined || value === '') return '0'
  return parseFloat(value.toString().replace(/[^\d.-]/g, '')).toLocaleString('id-ID')
}

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

export default function ModalFormDebt({ open, handleClose, type, employeeId }) {
  const dispatch = useDispatch()
  const today = new Date().toISOString().split('T')[0]

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      date: today
    }
    // resolver: yupResolver(schema)
  })
  const onSubmit = data => {
    const sendData = {
      type: type,
      date: data.date,
      amount: data.amount,
      category: 'MANUAL',
      notes: data.notes || ''
    }
    dispatch(fetchAddEmployeeDebt({ id: +employeeId, setOpen: handleClose, data: sendData, type }))
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='xs'
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
                {type === 'PEMINJAMAN' ? 'Tambah Kasbon' : type === 'PEMBAYARAN' ? 'Bayar Kasbon' : '-'}
              </Typography>
            </Box>
            <Grid container spacing={6}>
              {' '}
              <Grid item xs={12} sm={12}>
                <Controller
                  name='date'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='date'
                      value={value || ''}
                      label={`Pilih Tanggal ` + (type === 'PEMINJAMAN' ? 'Kasbon' : 'Pembayaran')}
                      onChange={onChange}
                      error={Boolean(errors.date)}
                      InputLabelProps={{ shrink: true }}
                      helperText={errors.date?.message}
                    />
                  )}
                />
              </Grid>{' '}
              <Grid item xs={12} sm={12}>
                <Controller
                  name='amount'
                  control={control}
                  render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      value={value === null || isNaN(value) ? '0' : formatNumber(value)}
                      label={`Masukkan Nominal ` + (type === 'PEMINJAMAN' ? 'Kasbon' : 'Pembayaran')}
                      error={!!error}
                      placeholder='Masukkan Nominal'
                      helperText={error?.message}
                      inputProps={{
                        inputMode: 'numeric'
                      }}
                      onChange={e => {
                        safeNumberHandler(e.target.value, onChange)
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name={`notes`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label='Notes'
                      fullWidth
                      multiline
                      rows={3}
                      error={!!error}
                      helperText={error?.message}
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
            <>
              <Button variant='tonal' color='secondary' onClick={handleClose}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={!watch('amount')} color='primary'>
                Submit
              </Button>
            </>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}
