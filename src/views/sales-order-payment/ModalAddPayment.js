// ** React Imports
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import { MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { priceFormat } from 'src/helpers/priceFormatter'
import { createSalesOrderPayment } from 'src/store/apps/sales-order-payment'
import BaseModal from '../common/BaseModal'

export default function ModalAddPayment({
  open,
  setOpen,
  typeModal,
  detailPayment,
  salesOrderId,
  amountDebt,
  salesOrderCode
}) {
  const dispatch = useDispatch()
  const { dataSalesOrderPayment: data, defaultValue, dataTypePayment } = useSelector(state => state.salesOrderPayment)

  const schema = yup.object({
    amount: yup
      .number()
      .typeError('Jumlah pembayaran harus diisi')
      .test('is-greater-than-zero', 'Pembayaran harus lebih dari 0', function (value) {
        const num = Number(value)
        return num >= 0
      }),
    typePayment: yup.string().required('Tipe Pembayaran harus diisi'),
    notes: yup.string().optional()
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: typeModal === 'ADD' ? defaultValue : detailPayment,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = data => {
    const transformedData = {
      ...data,
      salesOrderId
    }
    if (typeModal === 'ADD') {
      dispatch(createSalesOrderPayment({ data: transformedData, salesOrderCode: salesOrderCode }))
    }
    setOpen(false)
  }

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Buat Pembayaran' : 'Detail Pembayaran'}
      size='sm'
      showActions={typeModal !== 'VIEW'}
    >
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12}>
              <Controller
                name='typePayment'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Tipe Pembayaran'
                    value={value || ''}
                    onChange={onChange}
                    disabled={typeModal === 'VIEW'}
                    error={Boolean(errors.typePayment)}
                    aria-describedby='validation-schema-typePayment'
                    {...(errors.typePayment && { helperText: errors.typePayment.message })}
                  >
                    {dataTypePayment.map(item => {
                      return (
                        <MenuItem key={item.id} value={item.value}>
                          {item.name}
                        </MenuItem>
                      )
                    })}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='amount'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value ? priceFormat(value) : ''}
                    label='Total Pembayaran'
                    placeholder=''
                    onChange={e => {
                      const rawValue = e.target.value.replace(/\D/g, '') // Remove non-digit characters
                      onChange(rawValue)
                    }}
                    disabled={typeModal === 'VIEW'}
                    type={'text'}
                    error={Boolean(errors.amount)}
                    aria-describedby='validation-schema-amount'
                    {...(errors.amount && { helperText: errors.amount.message })}
                  />
                )}
              />
            </Grid>
            {typeModal === 'VIEW' && (
              <Grid item xs={12}>
                <Controller
                  name='dateCreated'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      value={value}
                      fullWidth
                      onChange={onChange}
                      disabled={typeModal === 'VIEW'}
                      label='Tanggal di Bayar'
                      aria-describedby='validation-basic-dateCreated'
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Controller
                name='notes'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    rows={4}
                    value={value}
                    fullWidth
                    multiline
                    onChange={onChange}
                    disabled={typeModal === 'VIEW'}
                    label='Notes'
                    aria-describedby='validation-basic-notes'
                  />
                )}
              />
            </Grid>
          </Grid>
          {typeModal === 'ADD' && (
            <Typography variant='h6' sx={{ mt: 4 }}>
              *Sisa Piutang belum terbayar Rp. {priceFormat(amountDebt)}
            </Typography>
          )}
        </Grid>
      </Grid>
    </BaseModal>
  )
}
