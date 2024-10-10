// ** React Imports
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

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { IconButton, MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { priceFormat } from 'src/helpers/priceFormatter'
import { createSalesOrderPayment } from 'src/store/apps/sales-order-payment'

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
                {typeModal === 'ADD' ? 'Buat Pembayaran' : 'Detail Pembayaran'}
              </Typography>
            </Box>
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
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}
