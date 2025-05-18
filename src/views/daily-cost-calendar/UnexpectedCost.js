import React, { act, useEffect, useState } from 'react'
import { useFieldArray, useFormContext, Controller } from 'react-hook-form'
import { Button, Card, CardContent, CardHeader, Divider, Grid, IconButton, Typography, Box } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { formatNumber, parseNumber } from 'src/utils/formatNumber'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMasterDataUnexpectedCostCategory } from 'src/store/apps/master/unexpected-cost-category'
import safeNumberHandler from 'src/helpers/formFormatter'

export default function UnexpectedCost({ readOnly = false }) {
  const dispatch = useDispatch()

  const { control, watch, setValue } = useFormContext()

  const { data: categories } = useSelector(state => state.masterUnexpectedCostCategory)
  // Use Field Array to manage dynamic form fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'costUnexpecteds'
  })

  // Load categories from API
  useEffect(() => {
    dispatch(fetchMasterDataUnexpectedCostCategory({ active: true }))
  }, [])

  // Helper to calculate the total cost
  const calculateTotal = () => {
    const costUnexpectedsValues = watch('costUnexpecteds') || []
    const total = costUnexpectedsValues.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
    setValue('totalCostUnexpected', total)
    return total
  }

  const handleAddCost = () => {
    append({
      categoryId: null,
      description: '',
      price: 0
    })
  }

  return (
    <Card>
      <CardHeader
        title='Unexpected Cost'
        action={
          !readOnly && (
            <Button size='small' variant='contained' startIcon={<Icon icon='tabler:plus' />} onClick={handleAddCost}>
              Tambah
            </Button>
          )
        }
      />

      <CardContent>
        {fields.length === 0 ? (
          <Typography variant='body2' color='text.secondary' align='center' sx={{ py: 4 }}>
            No Data
          </Typography>
        ) : (
          <>
            {fields.map((field, index) => (
              <Grid container spacing={3} key={field.id} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={3}>
                  <Controller
                    name={`costUnexpecteds.${index}.categoryId`}
                    control={control}
                    render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                      <CustomAutocomplete
                        {...field}
                        options={categories}
                        getOptionLabel={option => option.name || ''}
                        value={categories.find(cat => cat.id === value) || null}
                        onChange={(_, newValue) => {
                          onChange(newValue?.id || null)
                        }}
                        renderInput={params => (
                          <CustomTextField
                            {...params}
                            label='Kategori'
                            fullWidth
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                        disabled={readOnly}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Controller
                    name={`costUnexpecteds.${index}.price`}
                    control={control}
                    render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                      <CustomTextField
                        {...field}
                        value={value === null || isNaN(value) ? '0' : formatNumber(value)}
                        label='Price'
                        fullWidth
                        required
                        error={!!error}
                        helperText={error?.message}
                        disabled={readOnly}
                        inputProps={{
                          inputMode: 'numeric'
                        }}
                        onChange={e => {
                          safeNumberHandler(e.target.value, onChange, calculateTotal)
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Controller
                    name={`costUnexpecteds.${index}.description`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <CustomTextField
                        {...field}
                        label='Deskripsi'
                        fullWidth
                        // multiline
                        // rows={3}
                        error={!!error}
                        helperText={error?.message}
                        disabled={readOnly}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={1} sx={{ display: 'flex', mt: 4 }}>
                  {!readOnly && (
                    <IconButton color='error' onClick={() => remove(index)}>
                      <Icon icon='tabler:trash' />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}

            <Divider sx={{ mt: 4, mb: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant='subtitle1'>Total: Rp {calculateTotal().toLocaleString('id-ID')}</Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  )
}
