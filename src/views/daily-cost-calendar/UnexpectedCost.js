import React, { act, useEffect, useState } from 'react'
import { useFieldArray, useFormContext, useWatch, Controller } from 'react-hook-form'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import { formatNumber, parseNumber } from 'src/utils/formatNumber'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMasterDataUnexpectedCostCategory } from 'src/store/apps/master/unexpected-cost-category'
import safeNumberHandler from 'src/helpers/formFormatter'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

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

  // Pure computation, safe to call during render — does not call setValue.
  const computeTotal = () => {
    const costUnexpectedsValues = watch('costUnexpecteds') || []
    return costUnexpectedsValues.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
  }

  // Writes the computed total back into the form. Only call this from event
  // handlers/effects — never during render (see GeneralCostAndDeposit.js for
  // the "Maximum update depth exceeded" this pattern otherwise causes).
  const calculateTotal = () => {
    const total = computeTotal()
    setValue('totalCostUnexpected', total)
    return total
  }

  // Keeps totalCostUnexpected in sync whenever costUnexpecteds actually changes.
  const watchedCostUnexpecteds = useWatch({ control, name: 'costUnexpecteds' })
  useEffect(() => {
    calculateTotal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedCostUnexpecteds])

  const handleAddCost = () => {
    append({
      categoryId: null,
      description: '',
      price: 0
    })
  }

  return (
    <Card elevation={0} sx={{ borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}>
      <CardContent sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, mb: 4 }}>
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground }}>
              Biaya Tak Terduga
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
              Tambahkan pengeluaran tak terduga
            </Typography>
          </Box>
        </Box>

        {fields.length === 0 ? (
          <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground, textAlign: 'center', py: 6 }}>
            No Data
          </Typography>
        ) : (
          <>
            {fields.map((field, index) => (
              <Box
                key={field.id}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: `${radii.lg}px`,
                  border: `1px solid ${colors.border}`,
                  position: 'relative'
                }}
              >
                {!readOnly && (
                  <IconButton
                    color='error'
                    size='small'
                    onClick={() => remove(index)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <Icon icon='tabler:trash' fontSize='1.125rem' />
                  </IconButton>
                )}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
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
                              required
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
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`costUnexpecteds.${index}.price`}
                      control={control}
                      render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                        <CustomTextField
                          {...field}
                          value={value === null || isNaN(value) ? '0' : formatNumber(value)}
                          label='Harga'
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
                  <Grid item xs={12}>
                    <Controller
                      name={`costUnexpecteds.${index}.description`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <CustomTextField
                          {...field}
                          label='Deskripsi'
                          fullWidth
                          multiline
                          rows={2}
                          error={!!error}
                          helperText={error?.message}
                          disabled={readOnly}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: fields.length === 0 ? 0 : 2, gap: 3 }}>
          {!readOnly ? (
            <Button
              variant='outlined'
              color='secondary'
              onClick={handleAddCost}
              startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
              sx={{
                color: colors.foreground,
                borderColor: colors.border3,
                boxShadow: shadows.xs,
                '&:hover': { borderColor: colors.border3 }
              }}
            >
              Tambah
            </Button>
          ) : (
            <Box />
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 4,
              py: 2,
              borderRadius: `${radii.full}px`,
              border: `1px solid ${statusTokens.success.border}`,
              backgroundColor: statusTokens.success.bg
            }}
          >
            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>Total</Typography>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: statusTokens.success.fg }}>
              Rp {computeTotal().toLocaleString('id-ID')}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
