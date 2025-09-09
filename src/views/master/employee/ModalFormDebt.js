import { Grid } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import safeNumberHandler from 'src/helpers/formFormatter'
import { fetchAddEmployeeDebt } from 'src/store/apps/master/employee'
import BaseModal from 'src/views/common/BaseModal'

// Add formatNumber function to format numbers with commas
const formatNumber = value => {
  if (value === null || value === undefined || value === '') return '0'
  return parseFloat(value.toString().replace(/[^\d.-]/g, '')).toLocaleString('id-ID')
}

export default function ModalFormDebt({ open, handleClose, type, employeeId }) {
  const dispatch = useDispatch()
  const today = new Date().toISOString().split('T')[0]

  const {
    control,
    handleSubmit,
    formState: { errors }
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
    <BaseModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={type === 'PEMINJAMAN' ? 'Tambah Kasbon' : type === 'PEMBAYARAN' ? 'Bayar Kasbon' : '-'}
      size='sm'
      showActions={type !== 'VIEW'}
    >
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
    </BaseModal>
  )
}
