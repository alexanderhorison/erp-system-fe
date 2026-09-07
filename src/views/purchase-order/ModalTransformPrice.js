// ** MUI Imports
import { Box, Grid, Typography } from '@mui/material'

import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useEffect, useMemo, useState } from 'react'
import { fetchTransformationByProductId } from 'src/store/apps/master/transformation'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import { fetchOneMasterDataProductPrice } from 'src/store/apps/master/product-price'
import { priceFormat } from 'src/helpers/priceFormatter'

// ** Shared Components
import AppModal from '../common/AppModal'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

export default function ModalTransformPrice({
  open,
  setOpen,
  data,
  setValueForm,
  handleCalculate,
  savedData,
  handleSave
}) {
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
    const transformedData = {
      ...getValues(),
      totalHarga: result.totalHarga,
      resultQuantity: result.resultQuantity
    }

    setValueForm(`data[${data?.noIndex}].price`, result.totalHarga / data?.quantity)
    setValueForm(`data[${data?.noIndex}].subTotal`, result.totalHarga)
    handleSave(data?.noIndex, transformedData)
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

  useEffect(() => {
    if (savedData) {
      setSelectedUnit(listTransformation.find(item => item.id == savedData.transformation))
      setValue
      Object.entries(savedData).forEach(([key, value]) => {
        setValue(key, value)
      })
    }
  }, [savedData, setValue, listTransformation])

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
  }, [selectedUnit, data, watch('basePrice'), setSelectedUnit])

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={'Transformasi Harga'}
      size='sm'
      showActions={true}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Controller
            name={`transformation`}
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomAutocomplete
                options={listTransformation}
                id='autocomplete-custom'
                value={listTransformation.find(item => item.id === value) || null}
                getOptionLabel={option => option.info || ''}
                onChange={(event, newValue) => {
                  onChange(+newValue?.id)
                  setSelectedUnit(newValue)
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
                    fullWidth
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
            <Box
              key={index}
              sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', py: 1 }}
            >
              <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>{item.label}</Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.foreground }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Grid>
      </Grid>
    </AppModal>
  )
}
