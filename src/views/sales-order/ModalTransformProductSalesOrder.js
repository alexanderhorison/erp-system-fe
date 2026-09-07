import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'
import * as yup from 'yup'
import {
  fetchListProductTransformation,
  fetchProductWarehouseDetail,
  transformProductFromSalesOrder
} from 'src/store/apps/product-warehouse'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import AppModal from 'src/views/common/AppModal'

// ** Design Tokens
import { colors, radii, status as statusTokens } from 'src/configs/designTokens'

const infoChipSx = {
  height: 24,
  borderRadius: `${radii.full}px`,
  border: `1px solid ${colors.border}`,
  backgroundColor: 'transparent',
  '& .MuiChip-label': {
    px: 2,
    fontSize: '0.75rem',
    lineHeight: '16px',
    color: colors.mutedForeground
  }
}

export default function ModalTransformProductSalesOrder({
  open,
  setOpen,
  warehouseProductId,
  quantity,
  setValue,
  getValues,
  indexForm,
  update,
  listProduct,
  warehouseId,
  handleTransformProductUpdate,
  setDataWarehouseIds
}) {
  const dispatch = useDispatch()

  const [selectedUnit, setSelectedUnit] = useState({})
  const [qty, setQty] = useState(quantity)

  const { detailProductWarehouse, listTransformation } = useSelector(state => state.productWarehouse)

  const title = useMemo(() => {
    return 'Transformasi Produk'
  }, [])

  const schema = yup.object().shape({
    transformation: yup.string().required('Rumus harus dipilih')
  })

  const handleClose = () => {
    setOpen(false)
  }

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

  useEffect(() => {
    dispatch(fetchProductWarehouseDetail(warehouseProductId))
    dispatch(fetchListProductTransformation(warehouseProductId))
  }, [warehouseProductId])

  const result = useMemo(() => {
    if (qty > detailProductWarehouse.quantity) {
      setError(`qtyTransformation`, {
        type: 'duplicate',
        message: `Jumlah melebihi stok tersedia`
      })
      return 'Jumlah melebihi stok tersedia'
    }
    if (qty && selectedUnit?.unitTo?.name) {
      if (qty % selectedUnit?.amountFrom !== 0) {
        return `Jumlah harus kelipatan ${selectedUnit?.amountFrom}`
      }
      const total = (qty / selectedUnit?.amountFrom) * selectedUnit?.amountTo
      return { from: qty, fromUnit: detailProductWarehouse?.unitName, to: total, toUnit: selectedUnit?.unitTo?.name }
    }
    return null
  }, [selectedUnit, qty, detailProductWarehouse, setError])

  // ON SUBMIT
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
        const sendData = {
          masterTransformationId: selectedUnit.id,
          productWarehouseId: detailProductWarehouse.id,
          qtyTransformation: qty,
          warehouseRackId: detailProductWarehouse.warehouseRackId
        }

        dispatch(
          transformProductFromSalesOrder({
            id: detailProductWarehouse.id,
            data: sendData,
            setOpen: setOpen,
            setValue: setValue,
            getValues: getValues,
            indexForm: indexForm,
            update: update,
            listProduct: listProduct,
            warehouseId: warehouseId,
            handleTransformProductUpdate: handleTransformProductUpdate,
            setDataWarehouseIds: setDataWarehouseIds
          })
        )
      }
    }
  }

  return (
    <AppModal open={open} onClose={handleClose} onSubmit={handleSubmit(onSubmit)} title={title} size='sm' showActions>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground, mb: 2 }}>
            {detailProductWarehouse?.productName}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Chip
              size='small'
              label={`Stok Tersedia: ${detailProductWarehouse?.quantity ?? '-'}`}
              sx={{
                height: 24,
                borderRadius: `${radii.full}px`,
                border: `1px solid ${statusTokens.success.border}`,
                backgroundColor: statusTokens.success.bg,
                '& .MuiChip-label': {
                  px: 2,
                  fontSize: '0.75rem',
                  lineHeight: '16px',
                  color: statusTokens.success.fg
                }
              }}
            />
            <Chip size='small' label={`Stok Minimal: ${detailProductWarehouse?.minimumStock ?? '-'}`} sx={infoChipSx} />
            <Chip size='small' label={`Unit: ${detailProductWarehouse?.unitName || '-'}`} sx={infoChipSx} />
          </Box>
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
                    label='Pilih Rumus'
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
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label='Jumlah'
                value={quantity}
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
          {result && typeof result === 'object' ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                px: 4,
                py: 3,
                borderRadius: `${radii.lg}px`,
                border: `1px solid ${statusTokens.info.border}`,
                backgroundColor: statusTokens.info.bg
              }}
            >
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: statusTokens.info.fg }}>
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
                  color: statusTokens.info.fg,
                  border: `1px solid ${statusTokens.info.border}`
                }}
              >
                <Icon icon='tabler:arrow-right' fontSize='1rem' />
              </Box>
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: statusTokens.info.fg }}>
                {result.to} {result.toUnit}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 4,
                py: 3,
                borderRadius: `${radii.lg}px`,
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.background
              }}
            >
              <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>{result || '-'}</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </AppModal>
  )
}
