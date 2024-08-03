import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, Divider, Grid, IconButton } from '@mui/material'
import { useEffect, useRef } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import { fetchMasterDataProduct } from 'src/store/apps/master/product'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'

import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { initiateProductWarehouse } from 'src/store/apps/product-warehouse'
import { useRouter } from 'next/router'
import OptionsGroup from 'src/helpers/groupedInput'
import { fetchMasterDataWarehouseRack } from 'src/store/apps/master/warehouse-rack'

export default function TableAddProductWarehouse({ warehouse }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const inputRefs = useRef([]);
  
  const { data: masterDataProduct } = useSelector(state => state.masterProduct)
  const { data: masterDataUnit } = useSelector(state => state.unit)
  const { data: masterWarehouseRack } = useSelector(state => state.masterWarehouseRack)


  const schemaNew = yup.object({
    data: yup.array().of(
      yup.object().shape({
        masterProductId: yup.number().typeError('Produk harus dipilih'),
        unitId: yup.number().typeError('Satuan harus dipilih'),
        warehouseRackId: yup.number().typeError("Rak harus dipilih"),
        quantity: yup
          .string()
          .required('Kuantiti harus diisi')
          .test(
            'is-valid-number',
            'Kuantiti harus berupa angka',
            function (value) {
              const num = Number(value);
              return !isNaN(num);
            }
          )
          .test(
            'is-greater-than-zero',
            'Kuantiti harus lebih dari 0',
            function (value) {
              const num = Number(value);
              return num > 0;
            }
          ),
        minimumStock: yup
          .string()
          .required('Jumlah stok minimal harus diisi')
          .test(
            'is-valid-number',
            'Jumlah stok minimal harus berupa angka',
            function (value) {
              const num = Number(value);
              return !isNaN(num);
            }
          )
          .test(
            'is-greater-than-zero',
            'Jumlah stok minimal harus lebih dari 0',
            function (value) {
              const num = Number(value);
              return num >= 0;
            }
          )
      })
    )
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaNew)
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
      dispatch(initiateProductWarehouse({ data: data.data, warehouse, router }))
    }
  }

  const addMore = () => {
    append({ masterProductId: '', warehouseRackId: '', unitId: '', quantity: '', minimumStock: 1 })
  }
  useEffect(() => {
    inputRefs.current[fields.length - 1]?.focus()
  }, [fields])

  const deleteItem = itemIndex => {
    remove(itemIndex)
  }

  useEffect(() => {
    if (!fields.length) {
      append({
        masterProductId: '',
        warehouseRackId: '',
        unitId: '',
        quantity: '',
        minimumStock: 1
      })
    }
    dispatch(fetchMasterDataProduct())
    dispatch(fetchMasterDataUnit())
    if (warehouse.id){
      dispatch(fetchMasterDataWarehouseRack(+warehouse.id))
    }
  }, [dispatch, append, warehouse.id])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              {fields.map((item, index) => (
                <>
                  <CardContent key={index}>
                    <Grid container spacing={6}>
                      <Grid item xs={4}>
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
                      <Grid item xs={2}>
                        <Controller
                          name={`data[${index}].warehouseRackId`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomAutocomplete
                              options={masterWarehouseRack}
                              id='autocomplete-custom'
                              getOptionLabel={option => option.name || ''}
                              onChange={(event, newValue) => {
                                onChange(+newValue?.id)
                              }}
                              renderInput={params => (
                                <CustomTextField
                                  value={item.warehouseRackId}
                                  {...params}
                                  label='Pilih rak'
                                  error={Boolean(errors?.data?.[index]?.warehouseRackId)}
                                  {...(errors?.data?.[index]?.warehouseRackId && {
                                    helperText: errors?.data?.[index]?.warehouseRackId.message
                                  })}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={2}>
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
                      <Grid item xs={1}>
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
                              sx={{ display: 'block',  }}
                              error={Boolean(errors?.data?.[index]?.quantity)}
                              {...(errors?.data?.[index]?.quantity && {
                                helperText: errors?.data?.[index]?.quantity.message
                              })}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Controller
                          name={`data[${index}].minimumStock`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Minimum Stock'
                              value={value || 1}
                              onChange={e => {
                                onChange(e.target.value)
                              }}
                              type='number'
                              sx={{ display: 'block' }}
                              error={Boolean(errors?.data?.[index]?.minimumStock)}
                              {...(errors?.data?.[index]?.minimumStock && {
                                helperText: errors?.data?.[index]?.minimumStock.message
                              })}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={1} sx={{ marginTop: 'auto' }}>
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
          <Grid container sx={{ paddingLeft: '25px', marginTop: '20px' }} display='flex' justifyContent='space-between'>
            <Grid item>
            </Grid>
            <Grid display='flex' justifyContent='space-between' gap={4}>
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
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  )
}
