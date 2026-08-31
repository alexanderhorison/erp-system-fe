import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'

// ** Third Party Imports
import * as yup from 'yup'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Component Imports
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

// ** Store
import OptionsGroup from 'src/helpers/groupedInput'
import { fetchInvoiceListProductByWarehouseId } from 'src/store/apps/delivery-order'
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import { createAdjustmentGoodsOut } from 'src/store/apps/adjustment/goods-out'

// ** Shared Components
import FormActionBar from 'src/views/common/FormActionBar'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

// ** Each product line is its own outlined row, matching the goods-in and
// warehouse add-product forms.
const RepeatingContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(4),
  padding: theme.spacing(4),
  borderRadius: `${radii['3xl']}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs,
  backgroundColor: colors.background
}))

const RepeaterWrapper = styled(CardContent)(({ theme }) => ({
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4)
  }
}))

export default function AddAdjustmentGoodsOut() {
  const dispatch = useDispatch()
  const router = useRouter()

  const { data: masterDataWarehouse } = useSelector(state => state.warehouse)
  const { dataListProductWarehouse: listProduct } = useSelector(state => state.deliveryOrder)
  const { loadingCreateAdjustmentGoodsOut } = useSelector(state => state.adjustmentGoodsOut)

  const schema = yup.object({
    warehouseOrigin: yup.string().required('Gudang asal harus diisi'),
    data: yup.array().of(
      yup.object().shape({
        warehouseProductId: yup.number().typeError('Produk harus dipilih'),
        quantity: yup.number().typeError('Produk harus dipilih'),
        qty: yup
          .number()
          .typeError('Kuantiti harus diisi')
          .test('max', 'Kuantiti tidak boleh lebih besar dari stock tersedia', function (value) {
            const { quantity } = this.parent

            return value <= quantity
          })
          .test('is-greater-than-zero', 'Jumlah stok minimal harus lebih dari 0', function (value) {
            const num = Number(value)

            return num >= 0
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
      const { warehouseProductId } = listItems[i]
      const key = `${warehouseProductId}`
      if (lastIndexMap.has(key)) {
        lastIndex = lastIndexMap.get(key)
      }
      lastIndexMap.set(key, i)
    }

    // Check duplicate index
    lastIndex !== -1 ? lastIndex : (duplicate = false)
    setError(`data[${lastIndex}].warehouseProductId`, {
      type: 'duplicate',
      message: `Produk dan Satuan sudah dipilih`
    })
    if (!duplicate) {
      // remove qty and masterProductId from the items
      const result = listItems.map(({ quantity, masterProductId, ...rest }) => rest)
      let sendData = {
        warehouseOrigin: Number(data.warehouseOrigin),
        listProduct: result,
        notes: data.notes
      }
      dispatch(createAdjustmentGoodsOut({ data: sendData, router }))
    }
  }

  const addMore = () => {
    append({ warehouseProductId: '', qty: '', quantity: '' })
  }

  const deleteItem = itemIndex => {
    remove(itemIndex)
  }

  useEffect(() => {
    if (fields.length == 0) {
      append({
        warehouseProductId: '',
        quantity: '',
        qty: '',
        masterProductId: ''
      })
    }
    dispatch(fetchMasterDataWarehouse())
  }, [dispatch, append, listProduct, fields])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        elevation={0}
        sx={{ borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}
      >
        <RepeaterWrapper>
          {/* Source warehouse. Changing it reloads the product list and clears
              the rows, since the previous rows referenced the old warehouse. */}
          <Box sx={{ mb: 4, maxWidth: { md: 420 } }}>
            <Controller
              name='warehouseOrigin'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomAutocomplete
                  fullWidth
                  options={masterDataWarehouse}
                  id='autocomplete-warehouse'
                  getOptionLabel={option => option.name || ''}
                  onChange={(event, newValue) => {
                    onChange(+newValue?.id)
                    dispatch(fetchInvoiceListProductByWarehouseId(+newValue?.id))
                    remove()
                  }}
                  renderInput={params => (
                    <CustomTextField
                      value={value}
                      {...params}
                      label='Gudang Asal'
                      error={Boolean(errors?.warehouseOrigin)}
                      {...(errors?.warehouseOrigin && { helperText: errors?.warehouseOrigin.message })}
                    />
                  )}
                />
              )}
            />
          </Box>

          {/* Product lines */}
          {fields.map((item, index) => {
            const Tag = index === 0 ? Box : Collapse

            return (
              <Tag key={item.id} className='repeater-wrapper' {...(index !== 0 ? { in: true } : {})}>
                <RepeatingContent>
                  <Grid container spacing={4} sx={{ flex: 1, minWidth: 0 }}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name={`data[${index}].warehouseProductId`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange } }) => (
                          <CustomAutocomplete
                            fullWidth
                            options={OptionsGroup(listProduct, 'categoryName')}
                            id='autocomplete-grouped'
                            groupBy={option => option.categoryName}
                            getOptionLabel={option => option.productName || ''}
                            onChange={(event, newValue) => {
                              // Ini menggunakan productWarehouseId data mapping dari delivery order
                              onChange(+newValue?.productWarehouseId)
                              const selectedProduct = listProduct.find(
                                product => product.productWarehouseId === +newValue?.productWarehouseId
                              )
                              if (selectedProduct) {
                                setValue(`data[${index}].quantity`, selectedProduct.quantity)
                                setValue(`data[${index}].masterProductId`, selectedProduct.masterProductId)
                              } else {
                                setValue(`data[${index}].quantity`, '')
                                setValue(`data[${index}].masterProductId`, '')
                              }
                            }}
                            renderInput={params => (
                              <CustomTextField
                                value={item.warehouseProductId}
                                {...params}
                                label='Produk'
                                error={Boolean(errors?.data?.[index]?.warehouseProductId)}
                                {...(errors?.data?.[index]?.warehouseProductId && {
                                  helperText: errors?.data?.[index]?.warehouseProductId.message
                                })}
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name={`data[${index}].quantity`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            label='Stok Tersedia'
                            value={value}
                            disabled
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
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name={`data[${index}].qty`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            label='Kuantiti'
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            type='number'
                            sx={{ display: 'block' }}
                            error={Boolean(errors?.data?.[index]?.qty)}
                            {...(errors?.data?.[index]?.qty && {
                              helperText: errors?.data?.[index]?.qty.message
                            })}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  {/* The first line is never removable, so the slot stays
                      reserved to keep every row's fields aligned. */}
                  <Box sx={{ display: 'flex', alignItems: 'center', pt: 5, width: 34, flexShrink: 0 }}>
                    {index !== 0 && (
                      <Tooltip title='Hapus'>
                        <IconButton
                          onClick={() => deleteItem(index)}
                          size='small'
                          aria-label='remove product'
                          sx={{ color: colors.destructive, '&:hover': { backgroundColor: 'transparent' } }}
                        >
                          <Icon icon='tabler:trash' fontSize='1.125rem' />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </RepeatingContent>
              </Tag>
            )
          })}

          <Box sx={{ mt: 4 }}>
            <Button
              variant='outlined'
              color='secondary'
              onClick={addMore}
              startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              sx={{
                borderRadius: `${radii.full}px`,
                color: colors.foreground,
                borderColor: colors.border3,
                boxShadow: shadows.xs,
                '&:hover': { borderColor: colors.border3 }
              }}
            >
              Tambahkan produk
            </Button>
          </Box>

          {/* Notes */}
          <Box sx={{ mt: 5 }}>
            <Controller
              name='notes'
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  multiline
                  rows={3}
                  fullWidth
                  label='Catatan'
                  placeholder='Catatan...'
                  value={value || ''}
                  onChange={e => onChange(e.target.value)}
                  sx={{ display: 'block' }}
                />
              )}
            />
          </Box>
        </RepeaterWrapper>
      </Card>

      <FormActionBar onCancel={() => router.back()} loading={loadingCreateAdjustmentGoodsOut} />
    </form>
  )
}
