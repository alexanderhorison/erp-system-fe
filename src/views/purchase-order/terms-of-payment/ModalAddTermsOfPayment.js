import 'react-datepicker/dist/react-datepicker.css'
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { priceFormat } from 'src/helpers/priceFormatter'
import { createPurchaseOrderPayment } from 'src/store/apps/purchase-order-payment'
import FormInputText from 'src/views/common/Form/FormInputText'
import { useState } from 'react'
import FormDatePicker from 'src/views/common/Form/FormDatePicker'
import FormCheckBox from 'src/views/common/Form/FormCheckBox'
import { createTermsOfPayment, updateFormTermsOfPayment } from 'src/store/apps/purchase-order/terms-of-payment'

export default function ModalAddTermsOfPayment({
  open,
  setOpen,
  typeModal,
  detailTermsOfPayment,
  purchaseOrderId,
  purchaseOrderCode
}) {
  const dispatch = useDispatch()

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

  const { dataTermsOfPayment: data, defaultValue } = useSelector(state => state.termsOfPayment)

  const schema = yup.object({
    dueDate: yup.date().required('Tanggal harus diisi').min(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'Tanggal harus lebih besar dari sekarang'),
    title: yup.string().required('Judul harus diisi'),
    reminderdate: yup.number().typeError('Jarak harus diisi').min(1, 'Jarak harus lebih dari 0'),
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
      dispatch(updateFormTermsOfPayment({ data: transformedData, termsOfPaymentId: detailTermsOfPayment.id, purchaseOrderCode: purchaseOrderCode }))
    }
    setOpen(false)
  }

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

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
                {typeModal === 'ADD' ? 'Buat Terms Of Payment' : typeModal === 'EDIT' ? 'Edit Terms Of Payment' : 'Detail Terms Of Payment'}
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={12}>
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
                {/* {typeModal === 'ADD' && (
                  <Typography variant='h6' sx={{ mt: 4 }}>
                    *Sisa Piutang belum terbayar Rp. {priceFormat(amountDebt)}
                  </Typography>
                )} */}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              // justifyContent: 'center',
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
            {
              typeModal === 'VIEW' && (
                <>
                  <Button variant='tonal' color='secondary' onClick={handleClose} hidden={typeModal === 'VIEW'}>
                    Close
                  </Button>
                </>
              )
            }
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}
