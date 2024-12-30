// ** MUI Imports
// import Box from '@mui/material/Box'
import { Box, Card, Grid, Button, Dialog, DialogContent, DialogActions, Typography } from '@mui/material'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useEffect, useMemo, useState } from 'react'
import { CustomCloseButton } from '../pages/dialog-examples/DialogEditUserInfo'
import { fetchTransformationByProductId } from 'src/store/apps/master/transformation'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import { fetchOneMasterDataProductPrice } from 'src/store/apps/master/product-price'
import { priceFormat } from 'src/helpers/priceFormatter'

export default function ModalTransformPrice({ open, setOpen, data, setValueForm, handleCalculate }) {
  const dispatch = useDispatch()
  const [selectedUnit, setSelectedUnit] = useState({})

  const { listTransformation } = useSelector(state => state.masterTransformation)

  const schema = yup.object().shape({
    transformation: yup.string().required('Rumus harus dipilih'),
    basePrice: yup.string().optional()
  })

  const onSubmit = payload => {
    const isTransformationError = Boolean(errors?.transformation)

    if (isTransformationError) {
      setError('transformation', {
        type: 'manual',
        message: 'Quantity asal harus sesuai dengan rumus transformasi'
      })
      return
    }
    setValueForm(`data[${data?.noIndex}].price`, result.totalHarga / data?.quantity)
    setValueForm(`data[${data?.noIndex}].subTotal`, result.totalHarga)
    handleCalculate()
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    clearErrors,
    setError,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    // Get list transformation by product id and unit Id
    dispatch(fetchTransformationByProductId({ productId: data?.masterProductId, unitId: data?.unitId }))
  }, [data])

  const result = useMemo(() => {
    let totalQuantity = 0
    let totalHarga = 0
    let formattedTotalHarga = ''
    let resultQuantity = ''
    let baseProductPrice = ''
    let basePrice = getValues('basePrice')

    if (selectedUnit?.amountTo) {
      if (selectedUnit.amountFrom > selectedUnit.amountTo) {
        if (data?.quantity % selectedUnit?.amountFrom !== 0) {
          setError('transformation', {
            type: 'manual',
            message: 'Quantity asal harus sesuai dengan rumus transformasi'
          })
        } else {
          clearErrors('transformation') // Clear error if the validation passes
          totalQuantity = data?.quantity / selectedUnit?.amountFrom
          resultQuantity = `${data?.quantity} / ${selectedUnit?.amountFrom} = ${totalQuantity} ${selectedUnit?.unitTo?.name}`
        }
      } else {
        totalQuantity = data?.quantity * selectedUnit?.amountTo
        resultQuantity = `${data?.quantity} * ${selectedUnit?.amountTo} = ${totalQuantity} ${selectedUnit?.unitTo?.name}`
      }
    }
    if (basePrice && totalQuantity) {
      totalHarga = basePrice * totalQuantity
      baseProductPrice = `${priceFormat(totalHarga / data?.quantity)}`
      formattedTotalHarga = `${priceFormat(basePrice)} * ${totalQuantity} = ${priceFormat(totalHarga)}`
    }
    return {
      resultQuantity,
      totalHarga,
      baseProductPrice,
      formattedTotalHarga
    }
  }, [selectedUnit, data, watch('basePrice')])

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
                Transformasi Harga
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <Grid container spacing={6}>
                      <Grid item xs={12}>
                        <Controller
                          name={`transformation`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomAutocomplete
                              options={listTransformation}
                              id='autocomplete-custom'
                              getOptionLabel={option => option.info || ''}
                              onChange={(event, newValue) => {
                                onChange(+newValue?.id)
                                setSelectedUnit(newValue)
                                console.log(newValue)

                                dispatch(
                                  fetchOneMasterDataProductPrice({
                                    productId: newValue?.masterProductId,
                                    unitId: newValue?.unitToId
                                  })
                                ).then(({ payload }) => {
                                  if (payload.data) {
                                    setValue('basePrice', payload?.data?.basePrice)
                                  } else {
                                    setValue('basePrice', '')
                                  }
                                })
                              }}
                              renderInput={params => (
                                <CustomTextField
                                  value={value}
                                  {...params}
                                  error={Boolean(errors?.transformation)}
                                  {...(errors?.transformation && {
                                    helperText: errors?.transformation.message
                                  })}
                                  label='Pilih rumus'
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name='basePrice'
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Base Price'
                              value={value}
                              onChange={e => {
                                onChange(e.target.value)
                              }}
                              type='number'
                              sx={{ display: 'block' }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {[
                          { label: 'Quantity Asal', value: `${data?.quantity} ${data?.unitName}` },
                          { label: 'Quantity Transformasi', value: result.resultQuantity },
                          { label: 'Total Harga', value: result.formattedTotalHarga },
                          { label: `Harga Per ${data?.unitName}`, value: result.baseProductPrice }
                        ].map((item, index) => (
                          <Box key={index} display='flex' justifyContent='space-between' width='100%'>
                            <Typography>{item.label}</Typography>
                            <Typography>{item.value}</Typography>
                          </Box>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
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
              <Button type='submit' variant='contained'>
                Submit
              </Button>
            </>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}
