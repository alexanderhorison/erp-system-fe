import 'react-datepicker/dist/react-datepicker.css'
// ** MUI Imports
import Grid from '@mui/material/Grid'

import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FormInputText from 'src/views/common/Form/FormInputText'
import FormDatePicker from 'src/views/common/Form/FormDatePicker'
import FormCheckBox from 'src/views/common/Form/FormCheckBox'
import { createTermsOfPayment, updateFormTermsOfPayment } from 'src/store/apps/purchase-order/terms-of-payment'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'

export default function ModalAddTermsOfPayment({
  open,
  setOpen,
  typeModal,
  detailTermsOfPayment,
  purchaseOrderId,
  purchaseOrderCode
}) {
  const dispatch = useDispatch()

  const { dataTermsOfPayment: data, defaultValue } = useSelector(state => state.termsOfPayment)

  const schema = yup.object({
    dueDate: yup
      .date()
      .required('Tanggal harus diisi')
      .min(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'Tanggal harus lebih besar dari sekarang'),
    title: yup.string().required('Judul harus diisi'),
    reminderdate: yup.number().typeError('Jarak harus diisi').min(1, 'Jarak harus lebih dari 0')
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: typeModal === 'ADD' ? defaultValue : detailTermsOfPayment,
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
      dispatch(createTermsOfPayment({ data: transformedData, purchaseOrderCode: purchaseOrderCode }))
    }
    if (typeModal === 'EDIT') {
      dispatch(
        updateFormTermsOfPayment({
          data: transformedData,
          termsOfPaymentId: detailTermsOfPayment.id,
          purchaseOrderCode: purchaseOrderCode
        })
      )
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
      title={
        typeModal === 'ADD'
          ? 'Buat Terms Of Payment'
          : typeModal === 'EDIT'
          ? 'Edit Terms Of Payment'
          : 'Detail Terms Of Payment'
      }
      size='sm'
      showActions={typeModal !== 'VIEW'}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <FormInputText
            label={'Judul'}
            name={'title'}
            control={control}
            errors={errors}
            disabled={typeModal === 'VIEW'}
            placeholder='Masukkan Judul'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormDatePicker
            label='Tanggal Tengat Pembayaran'
            name={'dueDate'}
            control={control}
            errors={errors}
            disabled={typeModal === 'VIEW'}
            placeholder='Pilih Tanggal'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormInputText
            label={'Reminder (H - Jumlah Input)'}
            name={'reminderDate'}
            control={control}
            errors={errors}
            disabled={typeModal === 'VIEW'}
            placeholder='Masukkan '
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormCheckBox
            label={'Kirim Email'}
            name={'isSendEmail'}
            control={control}
            errors={errors}
            disabled={typeModal === 'VIEW'}
          />
        </Grid>
      </Grid>
    </AppModal>
  )
}
