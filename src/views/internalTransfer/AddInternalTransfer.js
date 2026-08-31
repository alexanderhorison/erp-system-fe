import { useEffect, useRef } from 'react'
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
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import { fetchMasterDataWarehouseRack } from 'src/store/apps/master/warehouse-rack'
import { createInternalTransfer, fetchListProductInternalTransfer } from 'src/store/apps/internal-transfer'

// ** Shared Components
import FormActionBar from 'src/views/common/FormActionBar'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

// ** Each product line is its own outlined row, matching the goods-in/out and
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

const surfaceCardSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

export default function AddInternalTransfer() {
  const dispatch = useDispatch()
  const router = useRouter()
  const inputRefs = useRef([])

  const { data: masterDataWarehouse } = useSelector(state => state.warehouse)
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card elevation={0} sx={surfaceCardSx}>
        <RepeaterWrapper>
          {/* Warehouse. Changing it reloads the product and rack lists and
                  clears the rows, which referenced the previous warehouse. */}
          <Box sx={{ mb: 4 }}>
            <Controller
              name='warehouseId'
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
                    dispatch(fetchListProductInternalTransfer(+newValue?.id))
                    dispatch(fetchMasterDataWarehouseRack(+newValue?.id))
                    remove()
                  }}
                  renderInput={params => (
                    <CustomTextField
                      value={value}
                      {...params}
                      label='Gudang'
                      error={Boolean(errors?.warehouseId)}
                      {...(errors?.warehouseId && { helperText: errors?.warehouseId.message })}
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
                            options={OptionsGroup(masterDataListProduct, 'categoryName')}
                            id='autocomplete-grouped'
                            groupBy={option => option.categoryName}
                            getOptionLabel={option => option.productName || ''}
                            onChange={(event, newValue) => {
                              onChange(+newValue?.warehouseProductId)
                              const selectedProduct = masterDataListProduct.find(
                                product => product.warehouseProductId === +newValue?.warehouseProductId
                              )
                              // ** Selecting a product fills its current rack
                              // and company, which are read-only here.
                              if (selectedProduct) {
                                setValue(`data[${index}].rackName`, selectedProduct.rackName)
                                setValue(`data[${index}].warehouseRackFromId`, selectedProduct.warehouseRackFromId)
                                setValue(`data[${index}].companyName`, selectedProduct.companyName)
                              } else {
                                setValue(`data[${index}].rackName`, '')
                                setValue(`data[${index}].warehouseRackFromId`, '')
                                setValue(`data[${index}].companyName`, '')
                              }
                            }}
                            renderInput={params => (
                              <CustomTextField
                                value={item.warehouseProductId}
                                {...params}
                                label='Pilih produk'
                                inputRef={el => (inputRefs.current[index] = el)}
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
                    <Grid item xs={12} sm={6} md={2}>
                      <Controller
                        name={`data[${index}].companyName`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            label='Perusahaan'
                            disabled
                            value={value || ''}
                            onChange={e => onChange(e.target.value)}
                            sx={{ display: 'block' }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <Controller
                        name={`data[${index}].rackName`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            label='Rak Asal'
                            disabled
                            value={value || ''}
                            onChange={e => onChange(e.target.value)}
                            sx={{ display: 'block' }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <Controller
                        name={`data[${index}].warehouseRackToId`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange } }) => (
                          <CustomAutocomplete
                            fullWidth
                            options={masterDataRack}
                            id='autocomplete-rack'
                            getOptionLabel={option => option.name || ''}
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

      <FormActionBar onCancel={() => router.back()} loading={loadingCreateInternalTransfer} />
    </form>
  )
}
