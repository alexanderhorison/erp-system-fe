// ** React Imports
import { useCallback, useEffect, useState } from 'react'

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
import { CardContent, IconButton, MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { addMasterDataTransformation, editMasterDataTransformation } from 'src/store/apps/master/transformation'

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

// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'center'
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
  const { defaultValue, detail: detailTransformation } = useSelector(data => data.masterTransformation)

  const [valueTransform, setValueTransform] = useState({
    UnitFromId: '',
    UnitToId: '',
    amount_to: ''
  })

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    UnitFromId: yup.string().required('Asal satuan produk harus ada'),
    UnitToId: yup.string().required('Tujuan satuan produk harus ada'),
    amount_to: yup.string().required('Jumlah tujuan konversi produk harus ada')
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
        UnitFromId: +data.UnitFromId,
        UnitToId: +data.UnitToId,
        MasterProductId: product.id,
        amount_from: 1,
        amount_to: +data.amount_to,
        info1: `1 ${valueTransform.UnitFromId} = ${valueTransform.amount_to} ${valueTransform.UnitToId}`,
        info2: `${valueTransform.amount_to} ${valueTransform.UnitToId} = 1 ${valueTransform.UnitFromId}`
      }
      dispatch(addMasterDataTransformation(input))
    } else {
      input = {
        MasterProductId: data.MasterProductId,
        UnitFromId: +data.UnitFromId,
        UnitToId: +data.UnitToId,
        product_transformation_id: '',
        amount_from: 1,
        amount_to: +data.amount_to,
        product_transformation_id: data.product_transformation_id,
        info1: `1 ${valueTransform.UnitFromId} = ${valueTransform.amount_to} ${valueTransform.UnitToId}`,
        info2: `${valueTransform.amount_to} ${valueTransform.UnitToId} = 1 ${valueTransform.UnitFromId}`
      }
      dispatch(editMasterDataTransformation({ id, data: input }))
    }
    setOpen(false)
  }

  useEffect(() => {
    if (detailTransformation && masterDataUnit.length > 0) {
      const unitFromPcs = masterDataUnit?.find(unit => unit.id == detailTransformation.UnitFromId)
      const unitToPcs = masterDataUnit?.find(unit => unit.id == detailTransformation.UnitToId)
      setValueTransform({
        UnitFromId: unitFromPcs?.name,
        UnitToId: unitToPcs?.name,
        amount_to: detailTransformation.amount_to
      })
    }
  }, [detailTransformation, masterDataUnit])

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

      if (key != 'amount_to') {
        const namePcs = masterDataUnit.find(unit => unit.id === value)
        setValueTransform({ ...valueTransform, [key]: namePcs.name })
      } else {
        setValueTransform({ ...valueTransform, [key]: value })
      }
    },
    [masterDataUnit, getValues, valueTransform]
  )

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
                {typeModal === 'ADD'
                  ? `${product.name}`
                  : typeModal === 'VIEW'
                  ? 'Detail Transformasi'
                  : 'Ubah Transformasi'}
              </Typography>
            </Box>

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
                      name='UnitFromId'
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
                            handleValueTransform('UnitFromId')
                          }}
                          disabled={typeModal === 'VIEW'}
                          error={Boolean(errors.UnitFromId)}
                          aria-describedby='validation-schema-UnitFromId'
                          {...(errors.UnitFromId && { helperText: errors.UnitFromId.message })}
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
                      name='UnitToId'
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
                            handleValueTransform('UnitToId')
                          }}
                          disabled={typeModal === 'VIEW'}
                          error={Boolean(errors.UnitToId)}
                          aria-describedby='validation-schema-UnitToId'
                          {...(errors.UnitToId && { helperText: errors.UnitToId.message })}
                        >
                          <MenuItem />
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
                      name='amount_to'
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
                            handleValueTransform('amount_to')
                          }}
                          disabled={typeModal === 'VIEW'}
                          error={Boolean(errors.amount_to)}
                          aria-describedby='validation-schema-amount_to'
                          {...(errors.amount_to && { helperText: errors.amount_to.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant=''>{'Hasil'}</Typography>
                  </Grid>
                  {valueTransform.UnitFromId && valueTransform.amount_to && valueTransform.UnitToId && (
                    <>
                      <Grid item xs={12} sx={{ marginTop: -4 }}>
                        <Typography variant=''>{`1 ${valueTransform.UnitFromId} = ${valueTransform.amount_to} ${valueTransform.UnitToId}`}</Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ marginTop: -4 }}>
                        <Typography variant=''>{`${valueTransform.amount_to} ${valueTransform.UnitToId} = 1 ${valueTransform.UnitFromId}`}</Typography>
                      </Grid>
                    </>
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
