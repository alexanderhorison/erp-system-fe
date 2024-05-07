import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, Divider, Grid, IconButton } from '@mui/material'
import { useEffect, useMemo } from 'react'
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

export default function TableAddProductWarehouse({ warehouse }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { data: masterDataProduct } = useSelector(state => state.masterProduct)
  const { data: masterDataUnit } = useSelector(state => state.unit)

  const schemaNew = yup.object({
    data: yup.array().of(
      yup.object().shape({
        MasterProductId: yup.number().typeError('Produk harus dipilih'),
        UnitId: yup.number().typeError('Satuan harus dipilih'),
        quantity: yup.number().typeError('Kuantiti harus diisi'),
        minimum_stock: yup.number().typeError('Jumlah stok minimal harus diisi')
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
      const { MasterProductId, UnitId } = listItems[i]
      const key = `${MasterProductId}-${UnitId}`
      if (lastIndexMap.has(key)) {
        lastIndex = lastIndexMap.get(key)
      }
      lastIndexMap.set(key, i)
    }
    // Check duplicate index
    lastIndex !== -1 ? (lastIndex += 1) : (duplicate = false)
    setError(`data[${lastIndex}].MasterProductId`, {
      type: 'duplicate',
      message: `Produk dan Satuan sama dengan item lain`
    })
    if (!duplicate) {
      dispatch(initiateProductWarehouse({ data: data.data, warehouse, router }))
    }
  }

  const addMore = () => {
    append({ MasterProductId: '', UnitId: '', quantity: '', minimum_stock: '' })
  }

  const deleteItem = itemIndex => {
    remove(itemIndex)
  }

  useEffect(() => {
    append({
      MasterProductId: '',
      UnitId: '',
      quantity: '',
      minimum_stock: ''
    })
    dispatch(fetchMasterDataProduct())
    dispatch(fetchMasterDataUnit())
  }, [dispatch, append])

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
                          name={`data[${index}].MasterProductId`}
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
                                  value={item.MasterProductId}
                                  {...params}
                                  error={Boolean(errors?.data?.[index]?.MasterProductId)}
                                  {...(errors?.data?.[index]?.MasterProductId && {
                                    helperText: errors?.data?.[index]?.MasterProductId.message
                                  })}
                                  label='Pilih produk'
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Controller
                          name={`data[${index}].UnitId`}
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
                                  error={Boolean(errors?.data?.[index]?.UnitId)}
                                  {...(errors?.data?.[index]?.UnitId && {
                                    helperText: errors?.data?.[index]?.UnitId.message
                                  })}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={2}>
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
                                const newValue = parseInt(e.target.value, 10)
                                if (!isNaN(newValue) && newValue >= 0) {
                                  onChange(+newValue)
                                }
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
                      <Grid item xs={2}>
                        <Controller
                          name={`data[${index}].minimum_stock`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Minimum Stock'
                              value={value}
                              onChange={e => {
                                const newValue = parseInt(e.target.value, 10)
                                if (!isNaN(newValue) && newValue >= 0) {
                                  onChange(+newValue)
                                }
                              }}
                              type='number'
                              sx={{ display: 'block' }}
                              error={Boolean(errors?.data?.[index]?.minimum_stock)}
                              {...(errors?.data?.[index]?.minimum_stock && {
                                helperText: errors?.data?.[index]?.minimum_stock.message
                              })}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={1} sx={{ marginTop: 'auto' }}>
                        <IconButton onClick={() => deleteItem(index)} sx={{ color: 'text.primary' }}>
                          <Icon icon='tabler:trash' />
                        </IconButton>
                        {/* {index !== 0 && fields.length - 1 === index && (
                        )} */}
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
