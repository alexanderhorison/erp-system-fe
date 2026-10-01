// ** React Imports
import React, { useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { fetchMasterDataProduct } from 'src/store/apps/master/product'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import { createRequestOrder, updateFormRequestOrder } from 'src/store/apps/product-request-order'
import AppModal from 'src/views/common/AppModal'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

// Labels and entered text: black, weight 500 (placeholders stay muted)
const fieldSx = {
  '& .MuiInputLabel-root': { fontWeight: 500, color: `${colors.foreground} !important` },
  '& .MuiInputBase-input': { fontWeight: 500, color: colors.foreground }
}

export default function ModalAddRequestProduct({ open, setOpen, typeModal = 'ADD' }) {
  const dispatch = useDispatch()
  const { data: masterProduct, loading: loadingMasterProduct } = useSelector(state => state.masterProduct)
  const { data: masterUnit, loading: loadingMasterUnit } = useSelector(state => state.unit)
  const { detailRequestOrder, loadingDetailRequestOrder } = useSelector(state => state.productRequest)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    data: yup
      .array()
      .of(
        yup.object().shape({
          productId: yup.number().typeError('Produk harus diisi').required('Produk harus diisi'),
          unitId: yup.number().typeError('Satuan harus diisi').required('Satuan harus diisi'),
          quantityRequested: yup
            .number()
            .typeError('Kuantitas harus diisi')
            .required('Kuantitas harus diisi')
            .min(1, 'Kuantitas minimal 1')
        })
      )
      .required('Data Produk Request tidak boleh kosong') // 🔹 array must exist
      .min(1, 'Minimal 1 produk request harus diisi'),
    notes: yup.string().optional()
  })

  // REACT FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      data: [{ productId: '', unitId: '', quantityRequested: '' }],
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
    clearErrors()
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
      dispatch(
        updateFormRequestOrder({
          data: val,
          code: detailRequestOrder.code
        })
      )
    }
    reset({
      data: [{ productId: '', unitId: '', quantityRequested: '' }],
      notes: ''
    })
    setOpen(false)
  }

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    reset()
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
    if (typeModal === 'EDIT' && detailRequestOrder) {
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
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Tambahkan Request Produk' : 'Ubah Request Produk'}
      size='md'
      showActions={true}
      loadingPage={Boolean(loadingMasterProduct && loadingMasterUnit && loadingDetailRequestOrder)}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* One outlined card per requested product, delete inside it */}
        <Box sx={{ maxHeight: 360, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3, p: 1 }}>
          {fields.map((item, index) => (
            <Box
              key={item.id}
              sx={{
                p: 4,
                borderRadius: `${radii['3xl']}px`,
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.xs,
                backgroundColor: colors.background
              }}
            >
              <Grid container spacing={4} alignItems='flex-start'>
                <Grid item xs={12} md={6}>
                  <Controller
                    name={`data[${index}].productId`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <CustomAutocomplete
                          options={masterProduct}
                          id='autocomplete-custom'
                          getOptionLabel={option => option.name || ''}
                          onChange={(event, newValue) => {
                            onChange(+newValue?.id)
                          }}
                          value={masterProduct.find(option => option.id === value) || null}
                          renderInput={params => (
                            <CustomTextField
                              sx={fieldSx}
                              {...params}
                              fullWidth
                              error={Boolean(errors?.data?.[index]?.productId)}
                              {...(errors?.data?.[index]?.productId && {
                                helperText: errors?.data?.[index]?.productId.message
                              })}
                              label='Pilih Produk'
                              placeholder='Select'
                            />
                          )}
                        />
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2.5}>
                  <Controller
                    name={`data[${index}].unitId`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <CustomAutocomplete
                          options={masterUnit}
                          id='autocomplete-custom-unit'
                          getOptionLabel={option => option.name || ''}
                          onChange={(event, newValue) => {
                            onChange(+newValue?.id)
                          }}
                          value={masterUnit.find(option => option.id === value) || null}
                          renderInput={params => (
                            <CustomTextField
                              sx={fieldSx}
                              {...params}
                              fullWidth
                              error={Boolean(errors?.data?.[index]?.unitId)}
                              {...(errors?.data?.[index]?.unitId && {
                                helperText: errors?.data?.[index]?.unitId.message
                              })}
                              label='Pilih Unit'
                              placeholder='Select'
                            />
                          )}
                        />
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={9} sm={4} md={2}>
                  <Controller
                    name={`data[${index}].quantityRequested`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        sx={fieldSx}
                        fullWidth
                        label='Kuantiti'
                        value={value}
                        onChange={onChange}
                        type='number'
                        error={Boolean(errors?.data?.[index]?.quantityRequested)}
                        {...(errors?.data?.[index]?.quantityRequested && {
                          helperText: errors?.data?.[index]?.quantityRequested.message
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid
                  item
                  xs={3}
                  sm={2}
                  md={1.5}
                  sx={{ display: 'flex', justifyContent: 'center', pt: { xs: 7, md: 7 } }}
                >
                  <IconButton onClick={() => remove(index)} size='small' sx={{ color: colors.destructive }}>
                    <Icon icon='tabler:trash' fontSize='1.125rem' />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() =>
              append({
                productId: '',
                unitId: '',
                quantityRequested: ''
              })
            }
            startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
            variant='outlined'
            color='secondary'
            sx={{
              color: colors.foreground,
              backgroundColor: stone[100],
              borderColor: stone[400],
              boxShadow: shadows.xs,
              '&:hover': { backgroundColor: stone[200], borderColor: stone[400] }
            }}
          >
            Tambah Produk
          </Button>
        </Box>

        <Controller
          name={`notes`}
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              sx={fieldSx}
              multiline
              rows={3}
              fullWidth
              label='Catatan'
              placeholder='Catatan...'
              value={value}
              onChange={e => {
                onChange(e.target.value)
              }}
              type='text'
            />
          )}
        />
      </Box>
    </AppModal>
  )
}
