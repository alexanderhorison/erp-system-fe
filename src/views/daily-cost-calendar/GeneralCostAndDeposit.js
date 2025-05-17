import React, { useEffect, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Card, CardContent, CardHeader, Divider, Grid, Typography, Box } from '@mui/material'
import { formatNumber, parseNumber } from 'src/utils/formatNumber'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMasterDataCar } from 'src/store/apps/master/car'
import { fetchMasterDataEmployee } from 'src/store/apps/master/employee'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import { fetchAllSalesOrder } from 'src/store/apps/sales-order'
import { useRouter } from 'next/router'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { fetchConfigDailyCost } from 'src/store/apps/config/configDailyCost'

export default function GeneralCostAndDeposit({ readOnly = false }) {
  const dispatch = useDispatch()
  const params = useRouter().query

  const { control, watch, setValue, formState, getValues } = useFormContext()

  const { data: cars } = useSelector(state => state.masterCar)
  const { data: employees } = useSelector(state => state.masterEmployee)
  const { dataSalesOrder: salesOrders } = useSelector(state => state.salesOrder)
  const { configDailyCost } = useSelector(state => state.configDailyCost)

  const [loading, setLoading] = useState(false)

  // Helper function to find selected option by id
  const findOptionById = (options, id) => {
    return options?.find(option => option.id === Number(id)) || null
  }

  useEffect(() => {
    dispatch(fetchMasterDataCar({ active: true }))
    dispatch(fetchMasterDataEmployee({ active: true }))
    dispatch(fetchAllSalesOrder({ date: params.date }))
    dispatch(fetchConfigDailyCost())
  }, [])

  const calculateTotal = () => {
    const costGeneralsValues = watch('costGenerals') || []
    let totals = 0
    costGeneralsValues.forEach(item => {
      totals += Number(item.tollCost) || 0
      totals += Number(item.fuelCost) || 0
      totals += Number(item.travelMoney) || 0
    })
    setValue('totalCostGeneral', totals)
    setValue('grandTotal', totals + getValues('totalCostEmployee') + getValues('totalCostUnexpected'))
    return totals
  }

  // Helper to calculate remaining deposit
  const calculateRemainingDeposit = index => {
    const item = watch(`costGenerals.${index}`)

    const deposit = Number(item?.deposit) || 0
    const fuelCost = Number(item?.fuelCost) || 0
    const travelMoney = Number(item?.travelMoney) || 0

    const remainingDeposit = deposit - fuelCost - travelMoney
    setValue(`costGenerals.${index}.remainingDeposit`, remainingDeposit)

    return remainingDeposit
  }

  // Helper to calculate remaining emoney
  const calculateRemainingEmoney = index => {
    const item = watch(`costGenerals.${index}`)
    const lastEmoney = Number(item?.lastEmoneyBalance) || 0
    const addedEmoney = Number(item?.emoney) || 0
    const tollCost = Number(item?.tollCost) || 0

    const remainingEmoney = lastEmoney + addedEmoney - tollCost
    setValue(`costGenerals.${index}.remainingEmoney`, remainingEmoney)

    return remainingEmoney
  }

  // Update the last emoney balance when car is selected
  const handleCarChange = (event, index) => {
    const carsId = event.target.value

    const selectedCar = cars.find(car => car.id === Number(carsId))
    if (selectedCar) {
      setValue(`costGenerals.${index}.lastEmoneyBalance`, selectedCar.emoneyBalance || 0)
      calculateRemainingEmoney(index)
    }
  }

  const handleNavigateToSalesOrder = code => {
    window.open(`/sales-order/${code}/`, '_blank')
  }

  useEffect(() => {
    if (salesOrders && salesOrders.length > 0 && configDailyCost) {
      salesOrders.forEach((order, index) => {
        setValue(`costGenerals.${index}.salesOrderId`, order.id)

        // Set default deposit and travel money from config if they don't have values
        const depositConfig = configDailyCost.find(item => item.key === 'DC_DEPOSIT')?.value || 0
        const travelMoneyConfig = configDailyCost.find(item => item.key === 'DC_TRANSPORT_ALLOWANCE')?.value || 0

        if (!watch(`costGenerals.${index}.deposit`)) {
          setValue(`costGenerals.${index}.deposit`, depositConfig)
        }

        if (!watch(`costGenerals.${index}.travelMoney`)) {
          setValue(`costGenerals.${index}.travelMoney`, travelMoneyConfig)
        }

        calculateRemainingDeposit(index)
      })
    }
  }, [salesOrders, configDailyCost, setValue, watch])

  if (salesOrders?.length === 0) {
    return (
      <Card>
        <CardHeader title='General Cost & Deposit' />
        <CardContent>
          <Typography variant='body2' color='text.secondary' align='center' sx={{ py: 4 }}>
            No Data
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title='General Cost & Deposit' />

      <CardContent>
        {salesOrders.map((field, index) => (
          <Box key={field.id} sx={{ mb: 4, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Detail :{' '}
              <Box
                component='span'
                onClick={() => handleNavigateToSalesOrder(field.code)}
                sx={{
                  cursor: 'pointer',
                  color: 'primary.main',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {field.code} | {field.customer?.name} | {field.customer?.address}
              </Box>
            </Typography>
            {/* Hidden field for salesOrderId */}
            <Controller
              name={`costGenerals.${index}.salesOrderId`}
              control={control}
              defaultValue={field.id}
              render={({ field }) => <input type='hidden' {...field} />}
            />
            {/* SECTION 1 */}
            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name={`costGenerals.${index}.deposit`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Deposit'
                      inputProps={{
                        inputMode: 'numeric'
                      }}
                      disabled={readOnly}
                      defaultValue={configDailyCost?.find(item => item.key === 'DC_DEPOSIT')?.value || 0}
                      value={formatNumber(value)}
                      onChange={e => {
                        const numericValue = parseNumber(e.target.value)
                        onChange(numericValue)
                        calculateRemainingDeposit(index)
                      }}
                      error={!!formState?.errors?.costGenerals?.[index]?.deposit}
                      helperText={formState?.errors?.costGenerals?.[index]?.deposit?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name={`costGenerals.${index}.employeeId`}
                  control={control}
                  render={({ field }) => (
                    <CustomAutocomplete
                      {...field}
                      options={employees}
                      getOptionLabel={option => option.nama}
                      value={findOptionById(employees, getValues(`costGenerals.${index}.employeeId`))}
                      onChange={(event, value) => {
                        field.onChange(value?.id || '')
                        setValue(`costGenerals.${index}.employeeName`, value?.nama || '')
                      }}
                      disabled={readOnly || loading}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          label='Driver'
                          error={!!formState?.errors?.costGenerals?.[index]?.employeeId}
                          helperText={formState?.errors?.costGenerals?.[index]?.employeeId?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name={`costGenerals.${index}.carsId`}
                  control={control}
                  render={({ field }) => (
                    <CustomAutocomplete
                      {...field}
                      options={cars}
                      getOptionLabel={option => `${option.name} (${option.plate_number})`}
                      isOptionEqualToValue={(option, value) => option.id === value}
                      value={findOptionById(cars, getValues(`costGenerals.${index}.carsId`))}
                      disabled={readOnly || loading}
                      onChange={(event, value) => {
                        field.onChange(value?.id || '')
                        handleCarChange({ target: { value: value?.id || '' } }, index)
                      }}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          error={!!formState?.errors?.costGenerals?.[index]?.carsId}
                          helperText={formState?.errors?.costGenerals?.[index]?.carsId?.message}
                          label={
                            <>
                              Mobil
                              {watch(`costGenerals.${index}.lastEmoneyBalance`) !== undefined && (
                                <Typography component='span' variant='caption' sx={{ ml: 1, fontWeight: 'normal' }}>
                                  | E-Money Terakhir: Rp{' '}
                                  {formatNumber(watch(`costGenerals.${index}.lastEmoneyBalance`))}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name={`costGenerals.${index}.emoney`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='E-money'
                      inputProps={{
                        inputMode: 'numeric'
                      }}
                      disabled={readOnly}
                      value={formatNumber(value)}
                      onChange={e => {
                        const numericValue = parseNumber(e.target.value)
                        onChange(numericValue)
                        calculateRemainingEmoney(index)
                      }}
                      error={!!formState?.errors?.costGenerals?.[index]?.emoney}
                      helperText={formState?.errors?.costGenerals?.[index]?.emoney?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Divider sx={{ mt: 3, mb: 2 }} />
            {/* SECTION 2 */}
            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name={`costGenerals.${index}.tollCost`}
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      {...field}
                      label='Biaya Tol'
                      disabled={readOnly}
                      value={formatNumber(field.value)}
                      inputProps={{
                        inputMode: 'numeric'
                      }}
                      onChange={e => {
                        const numericValue = parseNumber(e.target.value)
                        field.onChange(numericValue)
                        calculateRemainingEmoney(index)
                      }}
                      error={!!formState?.errors?.costGenerals?.[index]?.tollCost}
                      helperText={formState?.errors?.costGenerals?.[index]?.tollCost?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name={`costGenerals.${index}.fuelCost`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Biaya Bensin'
                      inputProps={{
                        inputMode: 'numeric'
                      }}
                      disabled={readOnly}
                      value={formatNumber(value)}
                      onChange={e => {
                        const numericValue = parseNumber(e.target.value)
                        onChange(numericValue)
                        calculateRemainingDeposit(index)
                      }}
                      error={!!formState?.errors?.costGenerals?.[index]?.fuelCost}
                      helperText={formState?.errors?.costGenerals?.[index]?.fuelCost?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name={`costGenerals.${index}.travelMoney`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Uang Jalan'
                      inputProps={{
                        inputMode: 'numeric'
                      }}
                      disabled={readOnly}
                      defaultValue={configDailyCost?.find(item => item.key === 'DC_TRANSPORT_ALLOWANCE')?.value || 0}
                      value={formatNumber(value)}
                      onChange={e => {
                        const numericValue = parseNumber(e.target.value)
                        onChange(numericValue)
                        calculateRemainingDeposit(index)
                      }}
                      error={!!formState?.errors?.costGenerals?.[index]?.travelMoney}
                      helperText={formState?.errors?.costGenerals?.[index]?.travelMoney?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
            {/* SECTION 3 */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 4,
                mb: 2,
                p: 2,
                bgcolor: 'action.hover',
                borderRadius: 1
              }}
            >
              <Box sx={{ textAlign: 'right', mr: 6 }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  Sisa Deposit:
                </Typography>
                <Typography variant='h6'>
                  {priceFormatWIthCurrency(watch(`costGenerals.${index}.remainingDeposit`) || 0)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  Sisa E-money:
                </Typography>
                <Typography variant='h6'>
                  {priceFormatWIthCurrency(watch(`costGenerals.${index}.remainingEmoney`) || 0)}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}

        <Divider sx={{ mt: 4, mb: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant='subtitle1'>Total: Rp {calculateTotal().toLocaleString('id-ID')}</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
