import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useMemo, useState } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  fetchListProductTransformation,
  fetchProductWarehouseDetail,
  transformProductFromPointOfSale
} from 'src/store/apps/product-warehouse'
import AppModal from 'src/views/common/AppModal'
import ProductInfoHeader from 'src/views/common/ProductInfoHeader'

// ** Design Tokens
import { colors, radii, status as statusTokens } from 'src/configs/designTokens'

export default function TransformProductPointOfSale({ open, setOpen, transformationData, setSelectedProductPos }) {
  const dispatch = useDispatch()

  const [selectedUnit, setSelectedUnit] = useState({})
  const [qty] = useState(transformationData?.qty)

  const { detailProductWarehouse, listTransformation } = useSelector(state => state.productWarehouse)

  useEffect(() => {
    dispatch(fetchProductWarehouseDetail(transformationData?.id))
    dispatch(fetchListProductTransformation(transformationData?.id))
  }, [transformationData?.id])

  const handleClose = () => {
    setOpen(false)
  }

  const schema = yup.object().shape({
    transformation: yup.string().required('Rumus harus dipilih')
  })

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    values: detailProductWarehouse,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const result = useMemo(() => {
    const from = qty || 0
    const fromUnit = selectedUnit?.unitFrom?.name || detailProductWarehouse?.unitName
    const toUnit = selectedUnit?.unitTo?.name

    if (qty > detailProductWarehouse.quantity) {
      setError(`qtyTransformation`, {
        type: 'duplicate',
        message: `Jumlah melebihi stok tersedia`
      })
      return { from, fromUnit, to: 0, toUnit, error: 'Jumlah melebihi stok tersedia' }
    }
    if (qty && selectedUnit?.unitTo?.name) {
      if (qty % selectedUnit?.amountFrom !== 0) {
        return { from, fromUnit, to: 0, toUnit, error: `Jumlah harus kelipatan ${selectedUnit?.amountFrom}` }
      }
      const total = (qty / selectedUnit?.amountFrom) * selectedUnit?.amountTo
      return { from, fromUnit, to: total, toUnit }
    }
    return { from, fromUnit, to: 0, toUnit }
  }, [selectedUnit, qty, detailProductWarehouse, setError])

  const onSubmit = data => {
    if (!selectedUnit) {
      setError(`transformation`, {
        type: 'duplicate',
        message: `Rumus harus dipilih`
      })
    } else {
      if (qty % selectedUnit?.amountFrom !== 0) {
        setError(`qtyTransformation`, {
          type: 'duplicate',
          message: `Jumlah harus kelipatan ${selectedUnit.amountFrom}`
        })
      } else if (qty > detailProductWarehouse.quantity) {
        setError(`qtyTransformation`, {
          type: 'duplicate',
          message: `Jumlah melebihi stok tersedia`
        })
      } else {
        const warehouse = JSON.parse(localStorage.getItem('warehousePos'))
        const sendData = {
          masterTransformationId: selectedUnit.id,
          productWarehouseId: detailProductWarehouse.id,
          qtyTransformation: qty,
          warehouseRackId: detailProductWarehouse.warehouseRackId,
          productId: transformationData.productId,
          warehouseId: warehouse?.warehouseId
        }
        dispatch(transformProductFromPointOfSale(sendData))
        setSelectedProductPos(null)
        handleClose()
      }
    }
  }

  const tone = result.error ? statusTokens.danger : statusTokens.info

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={'Transformasi Produk'}
      size='sm'
      showActions={true}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ProductInfoHeader data={detailProductWarehouse} />
        </Grid>
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
          <Controller
            name='qtyTransformation'
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange } }) => (
              <CustomTextField
                fullWidth
                label='Jumlah'
                value={transformationData.qty}
                disabled
                onChange={e => {
                  onChange(e.target.value)
                }}
                type='number'
                error={Boolean(errors.qtyTransformation)}
                {...(errors.qtyTransformation && { helperText: errors.qtyTransformation.message })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.foreground, mb: 2 }}>
            Hasil
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              px: 4,
              py: 3,
              borderRadius: `${radii['3xl']}px`,
              border: `1px solid ${tone.border}`,
              backgroundColor: tone.bg
            }}
          >
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: tone.fg }}>
              {result.from} {result.fromUnit}
            </Typography>
            <Box
              sx={{
                width: 28,
                height: 28,
                flexShrink: 0,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.background,
                color: tone.fg,
                border: `1px solid ${tone.border}`
              }}
            >
              <Icon icon='tabler:arrow-right' fontSize='1rem' />
            </Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: tone.fg }}>
              {result.to} {result.toUnit}
            </Typography>
          </Box>
          {result.error && (
            <Typography sx={{ mt: 2, fontSize: '0.75rem', color: statusTokens.danger.fg }}>{result.error}</Typography>
          )}
        </Grid>
      </Grid>
    </AppModal>
  )
}
