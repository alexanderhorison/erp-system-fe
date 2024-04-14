// ** React Imports
import { useEffect } from 'react'
import * as yup from 'yup'

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
import { IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { editProductWarehouse } from 'src/store/apps/product-warehouse'

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

export default function ModalAddProduct({ open, setOpen, typeModal, WarehouseId }) {
  const dispatch = useDispatch()

  const { detailProductWarehouse } = useSelector(state => state.productWarehouse)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    adjustment_type: yup.string().required('Tipe adjustment harus dipilih'),
    quantity: yup.number().required('Kuantiti harus diisi'),
    quantityAdjustment: yup
      .number()
      .required('Jumlah adjustment harus diisi')
      .test(
        'quantity-adjustment',
        'Jumlah Adjustment tidak boleh lebih besar dari Kuantiti ketika adjustment_type adalah MINUS',
        function (value) {
          if (this.parent.adjustment_type === 'MINUS' && value > this.parent.quantity) {
            throw new yup.ValidationError(
              'Jumlah Adjustment tidak boleh lebih besar dari Kuantiti jika tipe adjustment minus',
              null,
              'quantityAdjustment'
            )
          }
          return true
        }
      ),
    minimum_stock: yup.number().required('Jumlah stok minimal harus diisi')
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: detailProductWarehouse,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = data => {
    const idProduct = data.id
    const sendData = {
      quantityAdjustment: data.quantityAdjustment,
      quantity: data.quantity,
      minimum_stock: data.minimum_stock,
      adjustment_type: data.adjustment_type
    }

    dispatch(editProductWarehouse({ id: idProduct, data: sendData, WarehouseId }))
    setOpen(false)
  }

  useEffect(() => {
    // disable warn for select if select not have a child item
    console.warn = () => {}
  }, [dispatch])

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
                Sesuaikan jumlah produk
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={12}>
                    <Controller
                      name='productName'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={detailProductWarehouse.productName}
                          label='Nama Produk'
                          placeholder=''
                          onChange={onChange}
                          disabled={true}
                          error={Boolean(errors.name)}
                          aria-describedby='validation-schema-name'
                          {...(errors.name && { helperText: errors.name.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Controller
                      name='unitName'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={detailProductWarehouse.unitName}
                          label='Nama Satuan'
                          placeholder=''
                          onChange={onChange}
                          disabled={true}
                          error={Boolean(errors.name)}
                          aria-describedby='validation-schema-name'
                          {...(errors.name && { helperText: errors.name.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name='quantity'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Kuantiti'
                          value={detailProductWarehouse.quantity}
                          disabled={true}
                          onChange={e => {
                            const newValue = parseInt(e.target.value, 10)
                            if (!isNaN(newValue) && newValue >= 0) {
                              onChange(+newValue)
                            }
                          }}
                          type='number'
                          sx={{ display: 'block' }}
                          error={Boolean(errors.quantity)}
                          {...(errors.quantity && { helperText: errors.quantity.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name={`adjustment_type`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomAutocomplete
                          options={[
                            { name: 'Plus', value: 'PLUS' },
                            { name: 'Minus', value: 'MINUS' }
                          ]}
                          id='autocomplete-custom'
                          getOptionLabel={option => option.name || ''}
                          onChange={(event, newValue) => {
                            onChange(newValue?.value)
                          }}
                          renderInput={params => (
                            <CustomTextField
                              value={detailProductWarehouse.quantity}
                              {...params}
                              error={Boolean(errors?.adjustment_type)}
                              {...(errors?.adjustment_type && {
                                helperText: errors?.adjustment_type.message
                              })}
                              label='Tipe Adjustment'
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name='quantityAdjustment'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Jumlah Adjustment'
                          value={value}
                          onChange={e => {
                            const newValue = parseInt(e.target.value, 10)
                            if (!isNaN(newValue) && newValue >= 0) {
                              onChange(+newValue)
                            }
                          }}
                          type='number'
                          sx={{ display: 'block' }}
                          error={Boolean(errors.quantityAdjustment)}
                          {...(errors.quantityAdjustment && { helperText: errors.quantityAdjustment.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name='minimum_stock'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Stok Minimal'
                          value={value}
                          onChange={e => {
                            const newValue = parseInt(e.target.value, 10)
                            if (!isNaN(newValue) && newValue >= 0) {
                              onChange(+newValue)
                            }
                          }}
                          type='number'
                          sx={{ display: 'block' }}
                          error={Boolean(errors.minimum_stock)}
                          {...(errors.minimum_stock && { helperText: errors.minimum_stock.message })}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            {typeModal !== 'VIEW' && (
              <>
                <Button type='submit' variant='contained' hidden={typeModal === 'VIEW'}>
                  Submit
                </Button>
                <Button variant='tonal' color='secondary' onClick={handleClose} hidden={typeModal === 'VIEW'}>
                  Batal
                </Button>
              </>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}
