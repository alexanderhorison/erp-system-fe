import React, { useState, useEffect, useRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
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

const RepeatingContent = styled(Grid)(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
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
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(10)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6)
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

  // REDUX
  const { data: masterDataProduct } = useSelector(state => state.masterProduct)
  const { data: masterDataUnit } = useSelector(state => state.unit)
  const { data: masterWarehouseRack } = useSelector(state => state.masterWarehouseRack)
  // =================================================

  const handleChange = (index, field, value) => {
    const newValues = [...formValues]
    newValues[index][field] = value
    setFormValues(newValues)
  }

  const deleteForm = index => {
    const newValues = formValues.filter((_, i) => i !== index)
    setFormValues(newValues)
    setCount(count - 1)
  }

  const handleSubmit = () => {
    const newErrors = [];
    const uniquePairs = new Set();

    formValues.forEach((obj, index) => {
      const allKeysHaveValues = Object.values(obj).every(value => value !== undefined && value !== null && value !== '');
      if (!allKeysHaveValues) {
        newErrors.push({ index, type: 'Belum Lengkap' });
      }
      const pair = `${obj.unitId}-${obj.masterProductId}`;
      if (uniquePairs.has(pair)) {
        newErrors.push({ index, message: 'Produk dan unit sudah ada' });
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
      <Card>
        <RepeaterWrapper>
          <Repeater count={count}>
            {i => {
              const Tag = i === 0 ? Box : Collapse
              return (
                <Tag key={i} className='repeater-wrapper' {...(i !== 0 ? { in: true } : {})}>
                  <RepeatingContent item xs={12} gap={6}>
                    <Grid container gap={6} mb={6}>
                      <Grid item lg={4} md={4} xs={12} >
                        <CustomAutocomplete
                          fullWidth
                          options={masterDataProduct}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <CustomTextField
                              {...params}
                              label="Pilih Produk"
                              inputRef={productAutoCompleteRef}
                              error={!formValues[i]?.masterProductId || !!getErrorMessage(i, 'masterProductId')}
                              {...(formValues[i]?.masterProductId ? {} : { helperText: 'Produk harus dipilih' }) || getErrorMessage(i, 'masterProductId')}
                              {...(getErrorMessage(i, 'masterProductId') ? { helperText: getErrorMessage(i, 'masterProductId') } : {})}
                            />
                          )}
                          value={masterDataProduct.find(masterProductId => masterProductId.id === formValues[i]?.masterProductId) || null}
                          onChange={(event, newValue) => {
                            handleChange(i, 'masterProductId', newValue ? newValue.id : '')
                          }}
                        />
                      </Grid>
                      <Grid item lg={2} md={3} xs={12} >
                        <CustomAutocomplete
                          fullWidth
                          options={masterWarehouseRack}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <CustomTextField
                              {...params}
                              label="Pilih Rak"
                              error={!formValues[i]?.warehouseRackId}
                              {...(formValues[i]?.warehouseRackId ? {} : { helperText: 'Rak harus dipilih' })}
                            />
                          )}
                          value={masterWarehouseRack.find(warehouseRackId => warehouseRackId.id === formValues[i]?.warehouseRackId) || null}
                          onChange={(event, newValue) => {
                            handleChange(i, 'warehouseRackId', newValue ? newValue.id : '')
                          }}
                        />
                      </Grid>
                      <Grid item lg={2} md={2} xs={12} >
                        <CustomAutocomplete
                          fullWidth
                          options={masterDataUnit}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <CustomTextField
                              {...params}
                              label="Pilih Satuan"
                              error={!formValues[i]?.unitId}
                              {...(formValues[i]?.unitId ? {} : { helperText: 'Satuan harus dipilih' })}
                            />
                          )}
                          value={masterDataUnit.find(unitId => unitId.id === formValues[i]?.unitId) || null}
                          onChange={(event, newValue) => {
                            handleChange(i, 'unitId', newValue ? newValue.id : '')
                          }}
                        />
                      </Grid>
                      <Grid item lg={1} md={2} xs={12} sx={{ px: 0, my: { lg: 0 }, mt: 0 }}>
                        <CustomTextField
                          fullWidth
                          label='Kuantiti'
                          type='number'
                          value={formValues[i]?.quantity || ''}
                          onChange={e => handleChange(i, 'quantity', e.target.value)}
                          error={!formValues[i]?.quantity || formValues[i]?.quantity < 0}
                          {...(formValues[i]?.quantity ? {} : { helperText: 'Kuantiti harus diisi' })}
                          {...(formValues[i]?.quantity < 0 ? { helperText: 'Kuantiti harus lebih dari 0' } : {})}
                        />
                      </Grid>
                      <Grid item lg={1} md={2} xs={12} sx={{ px: 0, my: { lg: 0 }, mt: 0 }}>
                        <CustomTextField
                          fullWidth
                          label='Minimum Stok'
                          type='number'
                          value={formValues[i]?.minimumStock || 1}
                          onChange={e => handleChange(i, 'minimumStock', e.target.value)}
                          error={!formValues[i]?.minimumStock || formValues[i]?.minimumStock < 0}
                          {...(formValues[i]?.minimumStock ? {} : { helperText: 'Minimum stok harus diisi' })}
                          {...(formValues[i]?.minimumStock < 0 ? { helperText: 'Minimum stok harus lebih dari 0' } : {})}
                        />
                      </Grid>
                      <div style={{ display: 'flex' }}> {/* Adjust height as needed */}
                        <IconButton
                          onClick={() => deleteForm(i)}
                          sx={{ color: 'text.primary', ":hover": { backgroundColor: 'transparent' } }}
                        >
                          <Icon icon='tabler:trash' />
                        </IconButton>
                      </div>
                    </Grid>
                  </RepeatingContent>
                  <Divider />
                </Tag>
              )
            }}
          </Repeater>
          <Grid container sx={{ mt: 4 }}>
            <Grid item xs={12} sx={{ px: 0 }}>
              <Button
                variant='none'
                startIcon={<Icon icon='tabler:plus' />}
                onClick={() => {
                  setCount(count + 1)
                  setFormValues([...formValues, { masterProductId: '', warehouseRackId: '', unitId: '', quantity: '', minimumStock: 1 }])
                  setTimeout(() => {
                    if (productAutoCompleteRef.current) {
                      productAutoCompleteRef.current.focus();
                    }
                  }, 50);
                }}>
                Tambahkan produk
              </Button>
            </Grid>
          </Grid>
        </RepeaterWrapper>
        <Divider />
      </Card>
      <Grid container sx={{ paddingLeft: '25px', marginTop: '20px' }} display='flex' justifyContent='space-between'>
        <Grid item>
        </Grid>
        <Grid display='flex' justifyContent='space-between' gap={4}>
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
