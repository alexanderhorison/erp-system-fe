// ** React Imports
import { useEffect, useMemo } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'

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

import { editProductWarehouse } from 'src/store/apps/product-warehouse'
import CardAdjustProduct from './CardAdjustProduct'

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

const titleMap = {
  PLUS: 'Tambah Produk',
  MINUS: 'Kurangi Produk',
  MINIMUM_STOCK: 'Atur Stok Minimum'
  // Tambahkan lebih banyak pemetaan jika diperlukan
}

export default function ModalAdjustProduct({ open, setOpen, typeModal, WarehouseId }) {
  const dispatch = useDispatch()

  const { detailProductWarehouse } = useSelector(state => state.productWarehouse)

  const title = useMemo(() => {
    return titleMap[typeModal] || 'Title Default'
  }, [typeModal])

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    quantity: yup
      .string()
      .required('Jumlah stok minimal harus diisi')
      .test(
        'is-non-negative',
        'Jumlah stok minimal tidak boleh minus',
        value => {
          // Check if the value is a number and is non-negative
          const num = Number(value);
          return !isNaN(num) && num >= 0;
        }
      ),
    quantityAdjustment:
      typeModal !== 'MINIMUM_STOCK'
        ? yup
          .string()
          .required('Jumlah adjustment harus diisi')
          .test(
            'is-valid-number',
            'Jumlah adjustment harus berupa angka',
            function (value) {
              const num = Number(value);
              return !isNaN(num);
            }
          )
          .test(
            'is-non-negative',
            'Jumlah adjustment tidak boleh minus',
            function (value) {
              const num = Number(value);
              return num >= 0;
            }
          )
          .test(
            'quantity-adjustment',
            'Jumlah Adjustment tidak boleh lebih besar dari Kuantiti ketika adjustment_type adalah MINUS',
            function (value) {
              const num = Number(value);
              if (typeModal === 'MINUS' && num > this.parent.quantity) {
                throw new yup.ValidationError(
                  'Jumlah tidak boleh lebih besar dari Kuantiti jika mengurangi produk',
                  null,
                  'quantityAdjustment'
                );
              }
              return true;
            }
          ) : yup.mixed(),
    minimum_stock: yup
      .string()
      .required('Jumlah stok minimal harus diisi')
      .test(
        'is-non-negative',
        'Jumlah stok minimal tidak boleh minus',
        value => {
          // Check if the value is a number and is non-negative
          const num = Number(value);
          return !isNaN(num) && num >= 0;
        }
      )
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
      ...(typeModal !== 'MINIMUM_STOCK' ? { quantityAdjustment: data.quantityAdjustment } : {}),
      ...(typeModal !== 'MINIMUM_STOCK' ? { quantity: data.quantity } : {}),
      ...(typeModal === 'MINIMUM_STOCK' ? { minimum_stock: data.minimum_stock } : {}),
      adjustment_type: typeModal
    }
    dispatch(editProductWarehouse({ id: idProduct, data: sendData, WarehouseId }))
    setOpen(false)
  }

  useEffect(() => {
    // disable warn for select if select not have a child item
    console.warn = () => { }
  }, [dispatch])

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

  console.log(errors);
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
                {title}
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={12}>
                <CardAdjustProduct data={detailProductWarehouse} />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  {typeModal !== 'MINIMUM_STOCK' && (
                    <>
                      <Grid item xs={12}>
                        <Controller
                          name='quantityAdjustment'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Jumlah'
                              value={value}
                              onChange={e => {
                                // const newValue = parseInt(e.target.value, 10)
                                // if (!isNaN(newValue) && newValue >= 0) {
                                // }
                                onChange(e.target.value)
                              }}
                              type='number'
                              sx={{ display: 'block' }}
                              error={Boolean(errors.quantityAdjustment)}
                              {...(errors.quantityAdjustment && { helperText: errors.quantityAdjustment.message })}
                            />
                          )}
                        />
                      </Grid>
                    </>
                  )}
                  {typeModal === 'MINIMUM_STOCK' && (
                    <Grid item xs={12}>
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
                              onChange(e.target.value)
                            }}
                            type='number'
                            sx={{ display: 'block' }}
                            error={Boolean(errors.minimum_stock)}
                            {...(errors.minimum_stock && { helperText: errors.minimum_stock.message })}
                          />
                        )}
                      />
                    </Grid>
                  )}
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
                <Button variant='tonal' color='secondary' onClick={handleClose}>
                  Cancel
                </Button>
                <Button type='submit' variant='contained'>
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
