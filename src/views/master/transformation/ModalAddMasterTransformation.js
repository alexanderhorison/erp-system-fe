// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import { CardContent, CircularProgress, MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { addMasterDataTransformation, editMasterDataTransformation } from 'src/store/apps/master/transformation'
import BaseModal from 'src/views/common/BaseModal'

// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center'
  // justifyContent: 'center'
  // border: '1px solid'
  // [theme.breakpoints.down('md')]: {
  //   borderBottom: `1px solid ${theme.palette.divider}`
  // },
  // [theme.breakpoints.up('md')]: {
  //   // borderRight: `1px solid ${theme.palette.divider}`,
  //   // borders: `1px solid ${theme.palette.divider}`,
  //   border: `1px solid ${theme.palette.divider}`
  // }
}))

export default function ModalAddMasterTransformation({ open, setOpen, typeModal, product, id }) {
  const dispatch = useDispatch()
  const { data: masterDataUnit } = useSelector(state => state.unit)
  const { defaultValue, detail: detailTransformation, loadingDetail } = useSelector(data => data.masterTransformation)

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

  if (typeModal == 'EDIT' && loadingDetail) {
    return (
      <CircularProgress
        sx={{
          color: 'common.white',
          width: '20px !important',
          height: '20px !important',
          mr: theme => theme.spacing(2)
        }}
      />
    )
  }
  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={
        typeModal === 'ADD' ? `${product.name}` : typeModal === 'VIEW' ? 'Detail Transformasi' : 'Ubah Transformasi'
      }
      size='sm'
      showActions={typeModal !== 'VIEW'}
    >
      <Grid container spacing={6}>
        <StyledGrid item xs={12} md={12}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              width={140}
              height={140}
              alt='Product'
              src='https://img.freepik.com/premium-vector/cigarettes-pack-illustration-design-element-flat-icon_645658-280.jpg'
            />
          </CardContent>
        </StyledGrid>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12}>
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
                    {masterDataUnit.map(item => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
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
                    {masterDataUnit.map(item => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      )
                    })}
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
              <Typography variant=''>{'Hasil'}</Typography>
            </Grid>
            {valueTransform.unitFromId && valueTransform.amountTo && valueTransform.unitToId && (
              <>
                <Grid item xs={12} sx={{ marginTop: -4 }}>
                  <Typography variant=''>{`1 ${valueTransform.unitFromId} = ${valueTransform.amountTo} ${valueTransform.unitToId}`}</Typography>
                </Grid>
                <Grid item xs={12} sx={{ marginTop: -4 }}>
                  <Typography variant=''>{`${valueTransform.amountTo} ${valueTransform.unitToId} = 1 ${valueTransform.unitFromId}`}</Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </BaseModal>
  )
}
