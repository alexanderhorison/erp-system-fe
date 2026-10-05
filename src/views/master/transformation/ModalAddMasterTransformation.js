// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { addMasterDataTransformation, editMasterDataTransformation } from 'src/store/apps/master/transformation'
import AppModal from 'src/views/common/AppModal'

// ** Design Tokens
import { colors, radii, status } from 'src/configs/designTokens'

// ** One conversion reading, "1 Karton → 10 Slop", in the same tinted pill the warehouse Transformasi dialog uses.
const ConversionPill = ({ from, to }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 3,
      px: 4,
      py: 3,
      borderRadius: `${radii['3xl']}px`,
      border: `1px solid ${status.info.border}`,
      backgroundColor: status.info.bg
    }}
  >
    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: status.info.fg }}>{from}</Typography>
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
        color: status.info.fg,
        border: `1px solid ${status.info.border}`
      }}
    >
      <Icon icon='tabler:arrow-right' fontSize='1rem' />
    </Box>
    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: status.info.fg }}>{to}</Typography>
  </Box>
)

export default function ModalAddMasterTransformation({ open, setOpen, typeModal, product, id }) {
  const dispatch = useDispatch()
  const { data: masterDataUnit } = useSelector(state => state.unit)
  const {
    defaultValue,
    detail: detailTransformation,
    loadingDetail,
    loadingAdd,
    loadingEdit
  } = useSelector(data => data.masterTransformation)

  const [valueTransform, setValueTransform] = useState({
    unitFromId: '',
    unitToId: '',
    amountTo: ''
  })

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    unitFromId: yup.string().required('Asal satuan produk harus ada'),
    unitToId: yup.string().required('Tujuan satuan produk harus ada'),
    amountTo: yup.string().required('Jumlah tujuan konversi produk harus ada')
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    values: typeModal === 'ADD' ? defaultValue : detailTransformation,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = data => {
    let input
    if (typeModal === 'ADD') {
      input = {
        unitFromId: +data.unitFromId,
        unitToId: +data.unitToId,
        masterProductId: product.id,
        amountFrom: 1,
        amountTo: +data.amountTo,
        info1: `1 ${valueTransform.unitFromId} = ${valueTransform.amountTo} ${valueTransform.unitToId}`,
        info2: `${valueTransform.amountTo} ${valueTransform.unitToId} = 1 ${valueTransform.unitFromId}`
      }
      dispatch(addMasterDataTransformation(input))
    } else {
      input = {
        masterProductId: data.masterProductId,
        unitFromId: +data.unitFromId,
        unitToId: +data.unitToId,
        amountFrom: 1,
        amountTo: +data.amountTo,
        code: data.code,
        info1: `1 ${valueTransform.unitFromId} = ${valueTransform.amountTo} ${valueTransform.unitToId}`,
        info2: `${valueTransform.amountTo} ${valueTransform.unitToId} = 1 ${valueTransform.unitFromId}`
      }
      dispatch(editMasterDataTransformation({ id, data: input }))
    }
    setOpen(false)
  }

  useEffect(() => {
    if (detailTransformation && masterDataUnit.length > 0 && typeModal === 'EDIT') {
      const unitFromPcs = masterDataUnit?.find(unit => unit.id == detailTransformation.unitFromId)
      const unitToPcs = masterDataUnit?.find(unit => unit.id == detailTransformation.unitToId)
      setValueTransform({
        unitFromId: unitFromPcs?.name,
        unitToId: unitToPcs?.name,
        amountTo: detailTransformation.amountTo
      })
    }
  }, [detailTransformation, masterDataUnit, typeModal])

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

  const handleValueTransform = useCallback(
    key => {
      const value = getValues(key)

      if (!value) {
        setValueTransform({ ...valueTransform, [key]: '' })
      }

      if (key != 'amountTo') {
        const namePcs = masterDataUnit.find(unit => unit.id === value)
        setValueTransform({ ...valueTransform, [key]: namePcs.name })
      } else {
        setValueTransform({ ...valueTransform, [key]: value })
      }
    },
    [masterDataUnit, getValues, valueTransform]
  )

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={
        typeModal === 'ADD' ? `${product.name}` : typeModal === 'VIEW' ? 'Detail Transformasi' : 'Ubah Transformasi'
      }
      size='sm'
      showActions={typeModal !== 'VIEW'}
      loading={typeModal === 'ADD' ? loadingAdd : loadingEdit}
      loadingPage={typeModal === 'EDIT' && loadingDetail}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Controller
            name='unitFromId'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                fullWidth
                label='Unit Awal'
                value={value || ''}
                onChange={e => {
                  onChange(e)
                  handleValueTransform('unitFromId')
                }}
                disabled={typeModal === 'VIEW'}
                error={Boolean(errors.unitFromId)}
                aria-describedby='validation-schema-unitFromId'
                {...(errors.unitFromId && { helperText: errors.unitFromId.message })}
              >
                {masterDataUnit.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='unitToId'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                fullWidth
                label='Unit Tujuan'
                value={value || ''}
                onChange={e => {
                  onChange(e)
                  handleValueTransform('unitToId')
                }}
                disabled={typeModal === 'VIEW'}
                error={Boolean(errors.unitToId)}
                aria-describedby='validation-schema-unitToId'
                {...(errors.unitToId && { helperText: errors.unitToId.message })}
              >
                {masterDataUnit.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='amountTo'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                label='Quantity'
                placeholder=''
                type='number'
                onChange={e => {
                  onChange(e)
                  handleValueTransform('amountTo')
                }}
                disabled={typeModal === 'VIEW'}
                error={Boolean(errors.amountTo)}
                aria-describedby='validation-schema-amountTo'
                {...(errors.amountTo && { helperText: errors.amountTo.message })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.foreground, mb: 2 }}>
            Hasil
          </Typography>
          {valueTransform.unitFromId && valueTransform.amountTo && valueTransform.unitToId && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <ConversionPill
                from={`1 ${valueTransform.unitFromId}`}
                to={`${valueTransform.amountTo} ${valueTransform.unitToId}`}
              />
              <ConversionPill
                from={`${valueTransform.amountTo} ${valueTransform.unitToId}`}
                to={`1 ${valueTransform.unitFromId}`}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </AppModal>
  )
}
