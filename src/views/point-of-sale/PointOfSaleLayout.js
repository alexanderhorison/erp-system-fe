import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Typography
} from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import { priceFormat } from 'src/helpers/priceFormatter'
import * as yup from 'yup'

const products = [
  { id: 1, name: 'Product A', isFavorite: true, companyId: 1 },
  { id: 2, name: 'Product B', isFavorite: true, companyId: 2 },
  { id: 3, name: 'Product C', isFavorite: false, companyId: 1 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 4, name: 'Product D', isFavorite: true, companyId: 3 },
  { id: 5, name: 'Product E', isFavorite: false, companyId: 4 }
]

const listSaleProduct = [
  {
    subTotal: 45000,
    quantity: 3,
    price: 15000,
    warehouseProductId: 138,
    qty: 15,
    masterProductId: 31,
    rackName: 'default',
    unitName: 'SLOP',
    productName: 'GUDANG GARAM KALENG'
  },
  {
    subTotal: 360000,
    quantity: 4,
    price: 9000000000,
    warehouseProductId: 137,
    qty: 20,
    masterProductId: 32,
    rackName: 'default',
    unitName: 'KARTON',
    productName: 'SAMPOERNA MILD'
  },
  {
    subTotal: 500000,
    quantity: 5,
    price: 100000,
    warehouseProductId: 100,
    qty: 20,
    masterProductId: 27,
    rackName: 'default',
    unitName: 'BAL',
    productName: 'DJARUM 76'
  }
]

export default function PointOfSaleLayout() {
  const { data: companyData } = useSelector(state => state.company)
  const [filteredProducts, setFilteredProducts] = useState([])

  const {
    control: controlFilter,
    watch: watchFilter,
    setValue: setValueFilter
  } = useForm({
    defaultValues: {
      companyId: 'Company',
      typeProduct: 'all'
    }
  })
  const filterForm = watchFilter()

  const schema = yup.object({
    grandTotal: yup.number().typeError('Grand Total harus ada')
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    getValues,
    watch
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'formData'
  })
  const formField = watch('formData')

  const applyFilters = () => {
    const filtered = products.filter(product => {
      const isCompanyMatch =
        filterForm.companyId && filterForm.companyId != 'Company' ? product.companyId === filterForm.companyId : true
      const isFavoriteMatch =
        filterForm.typeProduct === 'all' ? true : filterForm.typeProduct === 'favorite' ? product.isFavorite : true // Handle custom if needed, for now assuming 'custom' shows all
      return isCompanyMatch && isFavoriteMatch
    })

    setFilteredProducts(filtered) // Set the filtered products to the state
  }

  useEffect(() => {
    applyFilters()
  }, [filterForm])

  useEffect(() => {
    // if (fields?.length == 0) {
    listSaleProduct.forEach(el => {
      append(el)
    })
    setValue('grandTotal', 500000)
    // }
  }, [])

  const helperTextPrice = index => {
    const info = {
      detailItem: `${getValues(`formData[${index}].unitName`)} @ ${priceFormat(getValues(`formData[${index}].price`))}`
    }
    return info
  }

  return (
    <Card fullwidth>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 4 }}>
        <Grid container spacing={2}>
          {/* Filters Section */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={2}>
                {/** Filter Company */}
                <Controller
                  name='companyId'
                  control={controlFilter}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Company'
                      SelectProps={{
                        value: value,
                        onChange: e => onChange(e)
                      }}
                      defaultValues='Company'
                    >
                      <MenuItem Select value='Company'>
                        Company
                      </MenuItem>
                      {companyData?.map((data, index) => {
                        return (
                          <MenuItem Select key={index} value={data.id}>
                            {data.name}
                          </MenuItem>
                        )
                      })}
                    </CustomTextField>
                  )}
                />
              </Grid>
              {/** Filter Type*/}
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  variant={filterForm.typeProduct === 'all' ? 'contained' : 'outlined'}
                  onClick={() => setValueFilter('typeProduct', 'all')}
                  sx={{ mt: 5 }}
                >
                  All
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  sx={{ mt: 5 }}
                  variant={filterForm.typeProduct === 'favorite' ? 'contained' : 'outlined'}
                  onClick={() => setValueFilter('typeProduct', 'favorite')}
                >
                  Favorite
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  sx={{ mt: 5 }}
                  variant={filterForm.typeProduct === 'custom' ? 'contained' : 'outlined'}
                  onClick={() => setValueFilter('typeProduct', 'custom')}
                >
                  Custom
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button fullWidth sx={{ mt: 5 }} variant='contained'>
                  Add Customer
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Company Section Filter */}
          <Grid item xs={2}>
            <Box
              sx={{
                maxHeight: 500, // Set the height for the scrollable area
                overflowY: 'auto', // Enable vertical scrolling
                // border: '1px solid #ccc', // Optional: Add a border for visual distinction
                p: 2, // Optional: Add padding inside the scrollable area
                mt: 2
              }}
            >
              <Grid container direction='column' spacing={2}>
                {companyData?.map((data, index) => (
                  <Grid item xs={6} sm={4} md={4} key={index}>
                    <Button
                      fullWidth
                      sx={{
                        maxWidth: '300px',
                        border: '1px solid',
                        p: 3,
                        textAlign: 'center',
                        width: '100%',
                        height: 60,
                        backgroundColor: 'primary',
                        textWrap: 'wrap'
                      }}
                      onClick={() => {
                        setValueFilter('companyId', data?.id)
                      }}
                    >
                      {data.name}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          {/** Products */}
          <Grid item xs={6} sx={{ p: 2, mt: 4 }}>
            <Box
              sx={{
                maxHeight: 1200,
                overflowY: 'auto',
                p: 2,
                mt: 2
              }}
            >
              <Grid container spacing={2}>
                {filteredProducts?.map((data, index) => (
                  <Grid item xs={6} sm={3} md={4} key={index}>
                    <Button
                      fullWidth
                      sx={{
                        maxWidth: '300px',
                        border: '1px solid',
                        p: 3,
                        textAlign: 'center',
                        width: '100%', // Ensures buttons expand horizontally
                        height: 100,
                        backgroundColor: 'primary',
                        textWrap: 'wrap'
                      }}
                    >
                      {data.name}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={6} md={4} sx={{ mt: 4 }}>
            <Card
              sx={{
                border: 1,
                maxHeight: 780,
                overflowY: 'auto',
                minHeight: 150
              }}
            >
              {fields.map((item, index) => (
                <React.Fragment key={item.id}>
                  <CardContent>
                    <Grid container spacing={6}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name={`formData[${index}].productName`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <div>
                              <Typography variant='h5' sx={{ marginTop: '4px', fontWeight: 'bold', textWrap: 'wrap' }}>
                                {value}
                              </Typography>
                              <Typography
                                variant='body2' // Adjusts the size (you can change this to 'body1' or 'subtitle2' for larger text)
                                color='textSecondary' // This can be customized to another color, like 'primary', 'secondary', etc.
                                sx={{ marginTop: '4px' }} // Adds some spacing between the input and the text
                              >
                                {helperTextPrice(index).detailItem}
                              </Typography>
                            </div>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Controller
                          name={`formData[${index}].quantity`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <Typography variant='h5' sx={{ marginTop: '4px', fontWeight: 'bold' }}>
                              x{value}
                            </Typography>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Controller
                          name={`formData[${index}].price`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <Typography variant='h5' sx={{ marginTop: '4px', fontWeight: 'bold', textAlign: 'right' }}>
                              {priceFormat(value)}
                            </Typography>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </React.Fragment>
              ))}
            </Card>
            <Button
              fullWidth
              variant={'contained'}
              sx={{ mt: 5 }}
              onClick={() => {
                remove()
              }}
            >
              Clear
            </Button>
            <Button fullWidth variant={'contained'} sx={{ mt: 5 }}>
              Charge {priceFormat(getValues('grandTotal'))}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}
