import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, Divider, Grid, Typography } from '@mui/material'
import { useFormContext, useWatch } from 'react-hook-form'

export default function SummaryCost() {
  const { control, setValue } = useFormContext()

  // Watch all cost values from different sections
  const totalCostGeneral = +useWatch({ control, name: 'totalCostGeneral' }) || 0
  const totalCostEmployee = +useWatch({ control, name: 'totalCostEmployee' }) || 0
  const totalCostUnexpected = +useWatch({ control, name: 'totalCostUnexpected' }) || 0

  // Calculate grand total whenever any of the subtotals change
  useEffect(() => {
    const grandTotal = +totalCostGeneral || +totalCostEmployee + totalCostUnexpected
    setValue('grandTotal', grandTotal)
  }, [totalCostGeneral, totalCostEmployee, totalCostUnexpected, setValue])

  // Format currency
  const formatCurrency = amount => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader title='Summary Cost' />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant='body1'>General Cost & Deposit</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='body1' align='right'>
              {formatCurrency(totalCostGeneral)}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant='body1'>Employee Cost & Bonus</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='body1' align='right'>
              {formatCurrency(totalCostEmployee)}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant='body1'>Unexpected Cost</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='body1' align='right'>
              {formatCurrency(totalCostUnexpected)}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderWidth: 2 }} />
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant='h6'>Grand Total</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='h6' align='right' color='primary'>
              {formatCurrency(totalCostGeneral + totalCostEmployee + totalCostUnexpected)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
