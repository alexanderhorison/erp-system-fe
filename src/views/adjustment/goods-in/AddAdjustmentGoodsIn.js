import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, CircularProgress, Divider, Grid, IconButton } from '@mui/material'
import { useEffect, useRef } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'

import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import OptionsGroup from 'src/helpers/groupedInput'
import { createAdjustmentGoodsIn } from 'src/store/apps/adjustment/goods-in'
import { fetchMasterDataProduct } from 'src/store/apps/master/product'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'

export default function AddAdjustmentGoodsIn() {
  const dispatch = useDispatch()
  const router = useRouter()
  const inputRefs = useRef([])

  const { data: masterDataWarehouse } = useSelector(state => state.warehouse)
  const { data: masterDataProduct } = useSelector(state => state.masterProduct)
  const { data: masterDataUnit } = useSelector(state => state.unit)
  const { loadingCreateAdjustmentGoodsIn } = useSelector(state => state.adjustmentGoodsIn)

  const schema = yup.object({
    warehouseDestination: yup.string().required('Gudang tujuan harus diisi'),
    data: yup.array().of(
      yup.object().shape({
        masterProductId: yup.number().typeError('Produk harus dipilih'),
        unitId: yup.number().typeError('Satuan harus dipilih'),
        quantity: yup
          .string()
          .required('Kuantiti harus diisi')
          .test('is-valid-number', 'Kuantiti harus berupa angka', function (value) {
            const num = Number(value)
            return !isNaN(num)
          })
          .test('is-greater-than-zero', 'Kuantiti harus lebih dari 0', function (value) {
            const num = Number(value)
            return num > 0
          })
      })
    ),
    notes: yup.string().optional()
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'data'
  })

  const onSubmit = data => {
    const listItems = data.data
    const lastIndexMap = new Map()
    let duplicate = true
    let lastIndex = -1
    for (let i = 0; i < listItems.length; i++) {
      const { masterProductId, unitId } = listItems[i]
      const key = `${masterProductId}-${unitId}`
      if (lastIndexMap.has(key)) {
        lastIndex = i
      }
      lastIndexMap.set(key, i)
    }
    // Check duplicate index
    lastIndex !== -1 ? (lastIndex) : (duplicate = false)
    setError(`data[${lastIndex}].masterProductId`, {
      type: 'duplicate',
      message: `Produk dan Satuan sama dengan item lain`
    })
    if (!duplicate) {
      let sendData = {
        warehouseDestination: Number(data.warehouseDestination),
        listProduct: listItems,
        notes: data.notes
      }
      dispatch(createAdjustmentGoodsIn({ data: sendData, router }))
    }
  }

  const addMore = () => {
    append({ masterProductId: '', unitId: '', quantity: '' })
  }

  const deleteItem = itemIndex => {
    remove(itemIndex)
  }

  useEffect(() => {
    if (fields.length == 0) {
      append({
        masterProductId: '',
        unitId: '',
        quantity: ''
      })
    }
    dispatch(fetchMasterDataWarehouse())
    dispatch(fetchMasterDataProduct())
    dispatch(fetchMasterDataUnit())
  }, [dispatch, append, fields])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container display='flex' gap={4} justifyContent='space-between'>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name={`warehouseDestination`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomAutocomplete
                          options={masterDataWarehouse}
                          id='autocomplete-custom'
                          getOptionLabel={option => option.name || ''}
                          onChange={(event, newValue) => {
                            onChange(+newValue?.id)
                          }}
                          renderInput={params => (
                            <CustomTextField
                              value={value}
                              {...params}
                              error={Boolean(errors?.warehouseDestination)}
                              {...(errors?.warehouseDestination && {
                                helperText: errors?.warehouseDestination.message
                              })}
                              label='Gudang Tujuan'
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              {fields.map((item, index) => (
                <>
                  <CardContent key={index}>
                    <Grid container spacing={6}>
                      <Grid item xs={12} md={7}>
                        <Controller
                          name={`data[${index}].masterProductId`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomAutocomplete
                              key={index}
                              options={OptionsGroup(masterDataProduct, 'category')}
                              id='autocomplete-grouped'
                              groupBy={option => option.category}
                              getOptionLabel={option => option.name || ''}
                              onChange={(event, newValue) => {
                                onChange(+newValue?.id)
                              }}
                              renderInput={params => (
                                <CustomTextField
                                  value={item.masterProductId}
                                  {...params}
                                  error={Boolean(errors?.data?.[index]?.masterProductId)}
                                  {...(errors?.data?.[index]?.masterProductId && {
                                    helperText: errors?.data?.[index]?.masterProductId.message
                                  })}
                                  label='Pilih produk'
                                  inputRef={el => (inputRefs.current[index] = el)}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={2}>
                        <Controller
                          name={`data[${index}].unitId`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomAutocomplete
                              options={masterDataUnit}
                              id='autocomplete-custom'
                              getOptionLabel={option => option.name || ''}
                              onChange={(event, newValue) => {
                                onChange(+newValue?.id)
                              }}
                              renderInput={params => (
                                <CustomTextField
                                  value={isNaN(value) ? '' : value}
                                  {...params}
                                  label='Pilih satuan'
                                  error={Boolean(errors?.data?.[index]?.unitId)}
                                  {...(errors?.data?.[index]?.unitId && {
                                    helperText: errors?.data?.[index]?.unitId.message
                                  })}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={2}>
                        <Controller
                          name={`data[${index}].quantity`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Kuantiti'
                              value={value}
                              onChange={e => {
                                onChange(e.target.value)
                              }}
                              type='number'
                              sx={{ display: 'block' }}
                              error={Boolean(errors?.data?.[index]?.quantity)}
                              {...(errors?.data?.[index]?.quantity && {
                                helperText: errors?.data?.[index]?.quantity.message
                              })}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={1} md={1} sx={{ marginTop: 'auto' }}>
                        {index !== 0 && fields.length - 1 === index && (
                          <IconButton onClick={() => deleteItem(index)} sx={{ color: 'text.primary' }}>
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                </>
              ))}
              <CardContent>
                <Grid item>
                  <Button onClick={addMore} startIcon={<Icon icon='tabler:plus' />}>
                    Tambahkan produk
                  </Button>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
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
                        placeholder={'Catatan...'}
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
              </CardContent>
            </Card>
          </Grid>
          <Grid
            container
            sx={{ paddingLeft: '25px', marginTop: '20px' }}
            display='flex'
            justifyContent='flex-end'
            gap={6}
          >
            {
              loadingCreateAdjustmentGoodsIn ? (
                <Button variant='contained' disabled>
                  <CircularProgress size={20} sx={{ color: 'white', mr: 2 }} />
                  Submitting...
                </Button>
              ) : (
                <>
                  <Button
                    variant='tonal'
                    color='secondary'
                    onClick={() => router.back()}
                    startIcon={<Icon icon='tabler:x' />}
                  >
                    Cancel
                  </Button>
                  <Button variant='contained' type='submit' startIcon={<Icon icon='tabler:send' />}>
                    Submit
                  </Button>
                </>
              )
            }
          </Grid>
        </Grid>
      </form>
    </>
  )
}
