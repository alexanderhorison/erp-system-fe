// ** React Imports
import React, { useCallback, useEffect, useMemo, useState } from 'react'

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

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { CardContent, CircularProgress, IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { fetchMasterDataProduct } from 'src/store/apps/master/product'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import { createRequestOrder, updateFormRequestOrder } from 'src/store/apps/product-request-order'
import data from 'src/@fake-db/components/data'

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

export default function ModalAddRequestProduct({ open, setOpen, typeModal = 'ADD' }) {
  const dispatch = useDispatch()
  const { data: masterProduct, loading: loadingMasterProduct } = useSelector(state => state.masterProduct)
  const { data: masterUnit, loading: loadingMasterUnit } = useSelector(state => state.unit)
  const { detailRequestOrder, loadingDetailRequestOrder } = useSelector(state => state.productRequest)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    data: yup.array().of(
      yup.object().shape({
        productId: yup.number().typeError('Produk harus diisi').required('Produk harus diisi'),
        unitId: yup.number().typeError('Satuan harus diisi').required('Satuan harus diisi'),
        quantityRequested: yup
          .number()
          .typeError('Kuantitas harus diisi')
          .required('Kuantitas harus diisi')
          .min(1, 'Kuantitas minimal 1'),
      })),
    notes: yup.string().optional()
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      data: [
        { productId: '', unitId: '', quantityRequested: '' }
      ],
      notes: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ON SUBMIT
  const onSubmit = val => {

    // Check Duplicates
    const lastIndexMap = new Map()
    let hasDuplicate = false
    clearErrors();
    const listItems = val.data
    listItems.forEach((item, index) => {
      const key = `${item.productId}-${item.unitId}`
      if (lastIndexMap.has(key)) {
        hasDuplicate = true
        const firstIndex = lastIndexMap.get(key)
        // Mark both duplicates with errors
        setError(`data[${firstIndex}].productId`, {
          type: 'duplicate',
          message: 'Produk dan Satuan sudah dipilih'
        })
        setError(`data[${firstIndex}].unitId`, {
          type: 'duplicate',
          message: 'Produk dan Satuan sudah dipilih'
        })
        setError(`data[${index}].productId`, {
          type: 'duplicate',
          message: 'Produk dan Satuan sudah dipilih'
        })
        setError(`data[${index}].unitId`, {
          type: 'duplicate',
          message: 'Produk dan Satuan sudah dipilih'
        })
        return
      } else {
        lastIndexMap.set(key, index)
      }
    })

    if (hasDuplicate) return

    if (typeModal === 'ADD') {
      dispatch(createRequestOrder(val))
    } else {
      console.log(val)
      dispatch(updateFormRequestOrder({
        data: val,
        code: detailRequestOrder.code
      }))
    }
    reset()
    remove()
    setOpen(false)
  }

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    reset()
    remove()
    setOpen(false)
  }

  const { fields, remove, append, update } = useFieldArray({
    control,
    name: 'data'
  })

  useEffect(() => {
    dispatch(fetchMasterDataProduct())
    dispatch(fetchMasterDataUnit())
  }, [dispatch])

  useEffect(() => {
    if (['VIEW', 'EDIT'].includes(typeModal) && detailRequestOrder) {
      reset({
        data: detailRequestOrder?.listProducts || [],
        notes: detailRequestOrder?.notes || ''
      })
    }
    if (typeModal === 'ADD') {
      reset({
        data: [{ productId: '', unitId: '', quantityRequested: '' }],
        notes: ''
      })
    }
  }, [typeModal, detailRequestOrder, reset])

  return (
    <>
      <Card>
        <Dialog
          fullWidth
          open={open}
          maxWidth='md'
          scroll='body'
          onClose={handleClose}
          sx={{ '& .MuiDialog-paper': { overflow: 'visible' }, zoom: 1.2 }}
        >
          {loadingMasterProduct && loadingMasterUnit && loadingDetailRequestOrder && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              <CircularProgress />
            </Box>
          )}
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
                  {typeModal === 'ADD' ? 'Tambahkan Request Produk' : typeModal === 'VIEW' ? 'Detail Request Produk' : 'Ubah Request Produk'}
                </Typography>
              </Box>
              {/* <Grid container spacing={6}>
                <Grid item xs={12}> */}
              <Box
                sx={{
                  maxHeight: 300, // ~3 rows visible
                  overflowY: 'auto',
                  pr: 2,
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                {fields.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <CardContent>
                      <Grid container spacing={6}>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name={`data[${index}].productId`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => {
                              if (typeModal === 'VIEW') {
                                return (
                                  <CustomTextField
                                    fullWidth
                                    label='Produk'
                                    value={item.productName || ''}
                                    disabled
                                    sx={{ display: 'block' }}
                                  />
                                )
                              }
                              return (
                                <CustomAutocomplete
                                  options={masterProduct}
                                  id='autocomplete-custom'
                                  getOptionLabel={option => option.name || ''}
                                  onChange={(event, newValue) => {
                                    onChange(+newValue?.id)
                                  }}
                                  disabled={typeModal === 'VIEW'}
                                  value={masterProduct.find(option => option.id === value) || null}
                                  renderInput={params => (
                                    <CustomTextField
                                      {...params}
                                      sx={{ zIndex: 0 }}
                                      error={Boolean(errors?.data?.[index]?.productId)}
                                      {...(errors?.data?.[index]?.productId && {
                                        helperText: errors?.data?.[index]?.productId.message
                                      })}
                                      label='Pilih Produk'
                                    />
                                  )}
                                />
                              )

                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Controller
                            name={`data[${index}].unitId`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => {
                              if (typeModal === 'VIEW') {
                                return (
                                  <CustomTextField
                                    fullWidth
                                    label='Satuan'
                                    value={item.unitName || ''}
                                    disabled
                                    sx={{ display: 'block' }}
                                  />
                                )
                              }
                              return (
                                <CustomAutocomplete
                                  options={masterUnit}
                                  id='autocomplete-custom-unit'
                                  getOptionLabel={option => option.name || ''}
                                  onChange={(event, newValue) => {
                                    onChange(+newValue?.id)
                                  }}
                                  disabled={typeModal === 'VIEW'}
                                  value={masterUnit.find(option => option.id === value) || null}
                                  renderInput={params => (
                                    <CustomTextField
                                      {...params}
                                      sx={{ zIndex: 0 }}
                                      error={Boolean(errors?.data?.[index]?.unitId)}
                                      {...(errors?.data?.[index]?.unitId && {
                                        helperText: errors?.data?.[index]?.unitId.message
                                      })}
                                      label='Pilih Unit'
                                    />
                                  )}
                                />
                              )

                            }}
                          />
                        </Grid>
                        <Grid item xs={5} md={2}>
                          <Controller
                            name={`data[${index}].quantityRequested`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <div>
                                <CustomTextField
                                  fullWidth
                                  label='Kuantiti'
                                  value={value}
                                  disabled={typeModal === 'VIEW'}
                                  onChange={onChange}
                                  type='number'
                                  sx={{ display: 'block' }}
                                  error={Boolean(errors?.data?.[index]?.quantityRequested)}
                                  {...(errors?.data?.[index]?.quantityRequested && {
                                    helperText: errors?.data?.[index]?.quantityRequested.message
                                  })}
                                />
                              </div>
                            )}
                          />
                        </Grid>
                        {
                          typeModal !== 'VIEW' && (
                            <Grid item xs={0.5} md={0.5} sx={{ marginTop: '1.2rem', ml: -4 }}>
                              <IconButton onClick={() => remove(index)} sx={{ color: 'text.primary' }}>
                                <Icon icon='tabler:trash' />
                              </IconButton>
                            </Grid>
                          )
                        }
                      </Grid>
                    </CardContent>
                  </React.Fragment>
                ))}
              </Box>
              {
                typeModal !== 'VIEW' && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, mt: 3 }}>
                    <Button
                      onClick={() =>
                        append({
                          productId: '',
                          unitId: '',
                          quantityRequested: '',
                        })
                      }
                      startIcon={<Icon icon='tabler:plus' />}
                      variant='outlined'
                    >
                      Tambahkan Produk
                    </Button>
                  </Box>
                )
              }
              <Grid item xs={12}>
                <Controller
                  name={`notes`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      multiline
                      rows={3}
                      fullWidth
                      label='Catatan'
                      disabled={typeModal === 'VIEW'}
                      placeholder={typeModal === 'VIEW' ? "" : 'Catatan...'}
                      value={value}
                      onChange={e => {
                        onChange(e.target.value)
                      }}
                      type='text'
                      sx={{ display: 'block' }}
                    />
                  )}
                />
              </Grid>
              <DialogActions
                sx={{
                  px: theme => [`${theme.spacing(0)} !important`, `${theme.spacing(0)} !important`]
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
            </DialogContent>
          </form>
        </Dialog>
      </Card>
    </>
  )
}
