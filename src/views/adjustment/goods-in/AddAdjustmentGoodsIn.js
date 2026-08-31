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
import { createAdjustmentGoodsIn } from 'src/store/apps/adjustment/goods-in'
import { fetchMasterDataProduct } from 'src/store/apps/master/product'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'

// ** Design Tokens
import FormActionBar from 'src/views/common/FormActionBar'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

// ** Each product line is its own outlined row, matching the warehouse
// add-product form so both "add items" screens read the same.
const RepeatingContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(4),
  padding: theme.spacing(4),
  // ** Fully rounded to match the pill inputs inside it. A literal 9999 would
  // bow the sides of a tall row into a stadium, so the radius is capped at the
  // largest value that still reads as round on a single-line row.
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
    lastIndex !== -1 ? lastIndex : (duplicate = false)
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card elevation={0} sx={surfaceCardSx}>
        <RepeaterWrapper>
          {/* Destination */}
          <Box sx={{ mb: 4 }}>
            <Controller
              name='warehouseDestination'
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
                  }}
                  renderInput={params => (
                    <CustomTextField
                      value={value}
                      {...params}
                      label='Gudang Tujuan'
                      error={Boolean(errors?.warehouseDestination)}
                      {...(errors?.warehouseDestination && {
                        helperText: errors?.warehouseDestination.message
                      })}
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
                        name={`data[${index}].masterProductId`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange } }) => (
                          <CustomAutocomplete
                            fullWidth
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
                                label='Pilih produk'
                                inputRef={el => (inputRefs.current[index] = el)}
                                error={Boolean(errors?.data?.[index]?.masterProductId)}
                                {...(errors?.data?.[index]?.masterProductId && {
                                  helperText: errors?.data?.[index]?.masterProductId.message
                                })}
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name={`data[${index}].unitId`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomAutocomplete
                            fullWidth
                            options={masterDataUnit}
                            id='autocomplete-unit'
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
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name={`data[${index}].quantity`}
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
                            error={Boolean(errors?.data?.[index]?.quantity)}
                            {...(errors?.data?.[index]?.quantity && {
                              helperText: errors?.data?.[index]?.quantity.message
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
                      <Tooltip title='Remove'>
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

      <FormActionBar onCancel={() => router.back()} loading={loadingCreateAdjustmentGoodsIn} />
    </form>
  )
}
