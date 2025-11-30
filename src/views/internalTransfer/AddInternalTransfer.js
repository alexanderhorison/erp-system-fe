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
// import { fetchMasterDataUnit } from 'src/store/apps/master/unit'
import { createInternalTransfer, fetchListProductInternalTransfer } from 'src/store/apps/internal-transfer'
import { fetchMasterDataWarehouseRack } from 'src/store/apps/master/warehouse-rack'

export default function AddInternalTransfer() {
  const dispatch = useDispatch()
  const router = useRouter()
  const inputRefs = useRef([])

  const { data: masterDataWarehouse } = useSelector(state => state.warehouse)
  // const { data: masterDataUnit } = useSelector(state => state.unit)
  const { data: masterDataRack } = useSelector(state => state.masterWarehouseRack)
  const { listProductInternalTransfer: masterDataListProduct, loadingCreateInternalTransfer } = useSelector(
    state => state.internalTransfer
  )

  const schema = yup.object({
    warehouseId: yup.string().required('Gudang harus diisi'),
    data: yup.array().of(
      yup.object().shape({
        warehouseProductId: yup.number().typeError('Produk warehouse harus dipilih'),
        warehouseRackFromId: yup.number().typeError('Rak asal harus dipilih'),
        warehouseRackToId: yup.number().typeError('Rak tujuan harus dipilih')
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
    let validationRack = false
    for (let i = 0; i < listItems.length; i++) {
      const { warehouseProductId, warehouseRackFromId, warehouseRackToId } = listItems[i]
      const key = `${warehouseProductId}`
      if (lastIndexMap.has(key)) {
        lastIndex = i
      }
      lastIndexMap.set(key, i)

      // Check if transferring to the same rack
      if (warehouseRackFromId === warehouseRackToId) {
        setError(`data[${i}].warehouseRackToId`, {
          type: 'invalidTransfer',
          message: 'Rak asal dan rak tujuan tidak boleh sama'
        })
        validationRack = true // Set duplicate to true to prevent sending the data
      }
    }
    // Check duplicate index
    lastIndex !== -1 ? lastIndex : (duplicate = false)
    setError(`data[${lastIndex}].warehouseProductId`, {
      type: 'duplicate',
      message: `Produk sudah dipilih`
    })
    if (!duplicate && !validationRack) {
      let sendData = {
        warehouseId: Number(data.warehouseId),
        listProduct: listItems,
        notes: data.notes
      }
      dispatch(createInternalTransfer({ data: sendData, router }))
    }
  }

  const addMore = () => {
    append({ warehouseProductId: '', warehouseRackToId: '', warehouseRackFromId: '' })
  }

  const deleteItem = itemIndex => {
    remove(itemIndex)
  }

  useEffect(() => {
    if (fields.length == 0) {
      append({
        warehouseProductId: '',
        warehouseRackToId: '',
        warehouseRackFromId: ''
      })
    }
    dispatch(fetchMasterDataWarehouse())
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
                      name={`warehouseId`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomAutocomplete
                          options={masterDataWarehouse}
                          id='autocomplete-custom'
                          getOptionLabel={option => option.name || ''}
                          onChange={(event, newValue) => {
                            onChange(+newValue?.id)
                            dispatch(fetchListProductInternalTransfer(+newValue?.id))
                            dispatch(fetchMasterDataWarehouseRack(+newValue?.id))
                            remove()
                          }}
                          renderInput={params => (
                            <CustomTextField
                              value={value}
                              {...params}
                              error={Boolean(errors?.warehouseId)}
                              {...(errors?.warehouseId && {
                                helperText: errors?.warehouseId.message
                              })}
                              label='Gudang'
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
                      <Grid item xs={12} md={5}>
                        <Controller
                          name={`data[${index}].warehouseProductId`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomAutocomplete
                              key={index}
                              options={OptionsGroup(masterDataListProduct, 'categoryName')}
                              id='autocomplete-grouped'
                              groupBy={option => option.categoryName}
                              getOptionLabel={option => option.productName || ''}
                              onChange={(event, newValue) => {
                                onChange(+newValue?.warehouseProductId)
                                const selectedProduct = masterDataListProduct.find(
                                  product => product.warehouseProductId === +newValue?.warehouseProductId
                                )
                                if (selectedProduct) {
                                  // setValue(`data[${index}].unitName`, selectedProduct.unitName)
                                  setValue(`data[${index}].rackName`, selectedProduct.rackName)
                                  setValue(`data[${index}].warehouseRackFromId`, selectedProduct.warehouseRackFromId)
                                  setValue(`data[${index}].companyName`, selectedProduct.companyName)
                                } else {
                                  // setValue(`data[${index}].unitName`, '')
                                  setValue(`data[${index}].rackName`, '')
                                  setValue(`data[${index}].warehouseRackFromId`, selectedProduct.warehouseRackFromId)
                                  setValue(`data[${index}].companyName`, '')
                                }
                              }}
                              renderInput={params => (
                                <CustomTextField
                                  value={item.warehouseProductId}
                                  {...params}
                                  error={Boolean(errors?.data?.[index]?.warehouseProductId)}
                                  {...(errors?.data?.[index]?.warehouseProductId && {
                                    helperText: errors?.data?.[index]?.warehouseProductId.message
                                  })}
                                  label='Pilih produk'
                                  inputRef={el => (inputRefs.current[index] = el)}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      {/* <Grid item xs={5} md={2}>
                        <Controller
                          name={`data[${index}].unitName`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Unit'
                              disabled
                              value={value}
                              onChange={e => {
                                onChange(e.target.value)
                              }}
                              sx={{ display: 'block' }}
                            />
                          )}
                        />
                      </Grid> */}
                      <Grid item xs={5} md={2}>
                        <Controller
                          name={`data[${index}].companyName`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Perusahaan'
                              disabled
                              value={value}
                              onChange={e => {
                                onChange(e.target.value)
                              }}
                              sx={{ display: 'block' }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={2}>
                        <Controller
                          name={`data[${index}].rackName`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Rak Asal'
                              disabled
                              value={value}
                              onChange={e => {
                                onChange(e.target.value)
                              }}
                              sx={{ display: 'block' }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={2}>
                        <Controller
                          name={`data[${index}].warehouseRackToId`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomAutocomplete
                              options={masterDataRack}
                              getOptionLabel={option => option.name || ''}
                              id='autocomplete-custom'
                              onChange={(event, newValue) => {
                                onChange(+newValue?.id)
                              }}
                              renderInput={params => (
                                <CustomTextField
                                  value={item.warehouseRackToId}
                                  {...params}
                                  label='Rak Tujuan'
                                  error={Boolean(errors?.data?.[index]?.warehouseRackToId)}
                                  {...(errors?.data?.[index]?.warehouseRackToId && {
                                    helperText: errors?.data?.[index]?.warehouseRackToId.message
                                  })}
                                />
                              )}
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
              loadingCreateInternalTransfer ? (
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
