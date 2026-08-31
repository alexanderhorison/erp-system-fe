import React, { useState, useEffect, useRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Imports
import Repeater from 'src/@core/components/repeater'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMasterDataProduct } from 'src/store/apps/master/product'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'
import { fetchMasterDataWarehouseRack } from 'src/store/apps/master/warehouse-rack'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { useRouter } from 'next/router'
import { initiateProductWarehouse } from 'src/store/apps/product-warehouse'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

// ** Each repeated product is its own outlined row (Figma: add-product form),
// which keeps the fields of one product visually grouped once several are added.
const RepeatingContent = styled(Grid)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  alignItems: 'flex-start',
  gap: theme.spacing(4),
  padding: theme.spacing(4),
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs,
  backgroundColor: colors.background,
  [theme.breakpoints.down('md')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}))

const RepeaterWrapper = styled(CardContent)(({ theme }) => ({
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4)
  }
}))

export default function TableAddProductWarehouseV3(props) {
  const dispatch = useDispatch()
  const router = useRouter()
  // ** States
  const [count, setCount] = useState(1)
  const [formValues, setFormValues] = useState([{ masterProductId: '', warehouseRackId: '', unitId: '', quantity: '', minimumStock: 1 }])
  const productAutoCompleteRef = useRef(null);
  const [errors, setErrors] = useState([]);

  // ** A field is only allowed to show its error once the user has interacted
  // with it (blur or edit), or once a submit has been attempted. Without this
  // every field of a fresh row renders red on mount, since the row starts empty.
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const touchKey = (index, field) => `${index}.${field}`

  const markTouched = (index, field) => {
    setTouched(prev => ({ ...prev, [touchKey(index, field)]: true }))
  }

  const showError = (index, field) => submitted || touched[touchKey(index, field)]

  // REDUX
  const { data: masterDataProduct } = useSelector(state => state.masterProduct)
  const { data: masterDataUnit } = useSelector(state => state.unit)
  const { data: masterWarehouseRack } = useSelector(state => state.masterWarehouseRack)
  // =================================================

  const handleChange = (index, field, value) => {
    const newValues = [...formValues]
    newValues[index][field] = value
    setFormValues(newValues)
    markTouched(index, field)
  }

  const deleteForm = index => {
    const newValues = formValues.filter((_, i) => i !== index)
    setFormValues(newValues)
    setCount(count - 1)

    // ** Touched flags are keyed by row index, so removing a row has to shift the
    // keys of every row after it. Otherwise the deleted row's flags would be
    // inherited by the row that takes its place.
    setTouched(prev => {
      const next = {}
      Object.keys(prev).forEach(key => {
        const [rowIndex, field] = key.split('.')
        const row = Number(rowIndex)
        if (row < index) next[key] = prev[key]
        else if (row > index) next[touchKey(row - 1, field)] = prev[key]
      })
      return next
    })
  }

  const handleSubmit = () => {
    setSubmitted(true)
    const newErrors = [];
    const uniquePairs = new Set();

    formValues.forEach((obj, index) => {
      const allKeysHaveValues = Object.values(obj).every(value => value !== undefined && value !== null && value !== '');
      if (!allKeysHaveValues) {
        newErrors.push({ index, type: 'Incomplete' });
      }
      const pair = `${obj.unitId}-${obj.masterProductId}`;
      if (uniquePairs.has(pair)) {
        newErrors.push({ index, message: 'This product and unit is already added' });
      } else {
        uniquePairs.add(pair);
      }
      if (obj.quantity < 0 || obj.quantity === null) {
        newErrors.push({ index });
      }
      if (obj.minimumStock < 0) {
        newErrors.push({ index });
      }
    });
    setErrors(newErrors);

    if (newErrors.length === 0) {
      dispatch(initiateProductWarehouse({ data: formValues, warehouse: props.warehouse, router }))
    }
  }

  useEffect(() => {
    dispatch(fetchMasterDataProduct())
    dispatch(fetchMasterDataUnit())
    if (props.warehouse.id) {
      dispatch(fetchMasterDataWarehouseRack(+props.warehouse.id))
    }
  }, [dispatch, props.warehouse.id])

  const getErrorMessage = (index, field) => {
    const error = errors.find(e => e.index === index);
    return error ? error.message : '';
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{ borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}
      >
        <RepeaterWrapper>
          <Repeater count={count}>
            {i => {
              const Tag = i === 0 ? Box : Collapse
              return (
                <Tag key={i} className='repeater-wrapper' {...(i !== 0 ? { in: true } : {})}>
                  <RepeatingContent item xs={12}>
                    <Grid container spacing={4} sx={{ flex: 1, minWidth: 0 }}>
                      <Grid item lg={4} md={4} sm={6} xs={12}>
                        <CustomAutocomplete
                          fullWidth
                          options={masterDataProduct}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <CustomTextField
                              {...params}
                              label="Product"
                              inputRef={productAutoCompleteRef}
                              onBlur={() => markTouched(i, 'masterProductId')}
                              error={
                                (showError(i, 'masterProductId') && !formValues[i]?.masterProductId) ||
                                !!getErrorMessage(i, 'masterProductId')
                              }
                              {...(getErrorMessage(i, 'masterProductId')
                                ? { helperText: getErrorMessage(i, 'masterProductId') }
                                : showError(i, 'masterProductId') && !formValues[i]?.masterProductId
                                ? { helperText: 'Product is required' }
                                : {})}
                            />
                          )}
                          value={masterDataProduct.find(masterProductId => masterProductId.id === formValues[i]?.masterProductId) || null}
                          onChange={(event, newValue) => {
                            handleChange(i, 'masterProductId', newValue ? newValue.id : '')
                          }}
                        />
                      </Grid>
                      <Grid item lg={2} md={3} sm={6} xs={12}>
                        <CustomAutocomplete
                          fullWidth
                          options={masterWarehouseRack}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <CustomTextField
                              {...params}
                              label="Rack"
                              onBlur={() => markTouched(i, 'warehouseRackId')}
                              error={showError(i, 'warehouseRackId') && !formValues[i]?.warehouseRackId}
                              {...(showError(i, 'warehouseRackId') && !formValues[i]?.warehouseRackId
                                ? { helperText: 'Rack is required' }
                                : {})}
                            />
                          )}
                          value={masterWarehouseRack.find(warehouseRackId => warehouseRackId.id === formValues[i]?.warehouseRackId) || null}
                          onChange={(event, newValue) => {
                            handleChange(i, 'warehouseRackId', newValue ? newValue.id : '')
                          }}
                        />
                      </Grid>
                      <Grid item lg={2} md={3} sm={6} xs={12}>
                        <CustomAutocomplete
                          fullWidth
                          options={masterDataUnit}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <CustomTextField
                              {...params}
                              label="Unit"
                              onBlur={() => markTouched(i, 'unitId')}
                              error={showError(i, 'unitId') && !formValues[i]?.unitId}
                              {...(showError(i, 'unitId') && !formValues[i]?.unitId
                                ? { helperText: 'Unit is required' }
                                : {})}
                            />
                          )}
                          value={masterDataUnit.find(unitId => unitId.id === formValues[i]?.unitId) || null}
                          onChange={(event, newValue) => {
                            handleChange(i, 'unitId', newValue ? newValue.id : '')
                          }}
                        />
                      </Grid>
                      <Grid item lg={2} md={3} sm={6} xs={12}>
                        <CustomTextField
                          fullWidth
                          label='Quantity'
                          type='number'
                          value={formValues[i]?.quantity || ''}
                          onChange={e => handleChange(i, 'quantity', e.target.value)}
                          onBlur={() => markTouched(i, 'quantity')}
                          error={
                            showError(i, 'quantity') && (!formValues[i]?.quantity || formValues[i]?.quantity < 0)
                          }
                          {...(showError(i, 'quantity') && formValues[i]?.quantity < 0
                            ? { helperText: 'Quantity must be greater than 0' }
                            : showError(i, 'quantity') && !formValues[i]?.quantity
                            ? { helperText: 'Quantity is required' }
                            : {})}
                        />
                      </Grid>
                      <Grid item lg={2} md={3} sm={6} xs={12}>
                        <CustomTextField
                          fullWidth
                          label='Minimum Stock'
                          type='number'
                          value={formValues[i]?.minimumStock || 1}
                          onBlur={() => markTouched(i, 'minimumStock')}
                          onChange={e => handleChange(i, 'minimumStock', e.target.value)}
                          error={
                            showError(i, 'minimumStock') &&
                            (!formValues[i]?.minimumStock || formValues[i]?.minimumStock < 0)
                          }
                          {...(showError(i, 'minimumStock') && formValues[i]?.minimumStock < 0
                            ? { helperText: 'Minimum stock must be greater than 0' }
                            : showError(i, 'minimumStock') && !formValues[i]?.minimumStock
                            ? { helperText: 'Minimum stock is required' }
                            : {})}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', alignItems: 'center', pt: 5, flexShrink: 0 }}>
                      <IconButton
                        onClick={() => deleteForm(i)}
                        size='small'
                        aria-label='remove product'
                        sx={{ color: colors.destructive, '&:hover': { backgroundColor: 'transparent' } }}
                      >
                        <Icon icon='tabler:trash' fontSize='1.125rem' />
                      </IconButton>
                    </Box>
                  </RepeatingContent>
                </Tag>
              )
            }}
          </Repeater>
          <Grid container sx={{ mt: 4 }}>
            <Grid item xs={12} sx={{ px: 0 }}>
              <Button
                variant='outlined'
                color='secondary'
                startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
                sx={{
                  borderRadius: `${radii.full}px`,
                  color: colors.foreground,
                  borderColor: colors.border3,
                  boxShadow: shadows.xs,
                  '&:hover': { borderColor: colors.border3 }
                }}
                onClick={() => {
                  setCount(count + 1)
                  setFormValues([...formValues, { masterProductId: '', warehouseRackId: '', unitId: '', quantity: '', minimumStock: 1 }])
                  setTimeout(() => {
                    if (productAutoCompleteRef.current) {
                      productAutoCompleteRef.current.focus();
                    }
                  }, 50);
                }}>
                Add Product
              </Button>
            </Grid>
          </Grid>
        </RepeaterWrapper>
      </Card>
      <Grid container sx={{ mt: 5 }} display='flex' justifyContent='flex-end'>
        <Grid item display='flex' justifyContent='flex-end' gap={4}>
          <Button
            variant='tonal'
            color='secondary'
            onClick={() => {
              router.push(`/product-warehouse/warehouse/${props.warehouse?.id}`)
            }}
            startIcon={<Icon icon='tabler:x' />}
          >
            Cancel
          </Button>
          <Button disabled={formValues.length === 0} variant='contained' onClick={handleSubmit} startIcon={<Icon icon='tabler:send' />}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  )
}
