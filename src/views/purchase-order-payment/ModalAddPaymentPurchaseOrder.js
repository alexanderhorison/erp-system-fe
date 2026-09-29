// ** MUI Imports
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { priceFormat } from 'src/helpers/priceFormatter'
import { createPurchaseOrderPayment } from 'src/store/apps/purchase-order-payment'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'
import CurrencyInput from 'src/views/common/CurrencyInput'
import PaymentSummaryCards from 'src/views/common/PaymentSummaryCards'

export default function ModalAddPaymentPurchaseOrder({
  open,
  setOpen,
  typeModal,
  detailPayment,
  purchaseOrderId,
  amountDebt,
  amountPaid,
  purchaseOrderCode
}) {
  const dispatch = useDispatch()
  const {
    dataPurchaseOrderPayment: data,
    defaultValue,
    dataTypePayment
  } = useSelector(state => state.purchaseOrderPayment)

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
      purchaseOrderId
    }
    if (typeModal === 'ADD') {
      dispatch(createPurchaseOrderPayment({ data: transformedData, purchaseOrderCode: purchaseOrderCode }))
    }
    setOpen(false)
  }

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Buat Pembayaran' : 'Detail Pembayaran'}
      size='sm'
      showActions={typeModal !== 'VIEW'}
    >
      {typeModal === 'ADD' && <PaymentSummaryCards label='PO' amountPaid={amountPaid} amountDebt={amountDebt} />}
      <Grid container spacing={4}>
        <Grid item xs={12}>
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
                {dataTypePayment.map(item => (
                  <MenuItem key={item.id} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='amount'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CurrencyInput
                value={value}
                label='Total Pembayaran'
                onChange={onChange}
                disabled={typeModal === 'VIEW'}
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
    </AppModal>
  )
}
