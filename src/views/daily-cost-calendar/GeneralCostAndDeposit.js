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
import safeNumberHandler from 'src/helpers/formFormatter'

export default function GeneralCostAndDeposit() {
  const dispatch = useDispatch()
  const params = useRouter().query

  const { control, watch, setValue, formState, getValues } = useFormContext()

  const { data: cars } = useSelector(state => state.masterCar)
  const { data: employees } = useSelector(state => state.masterEmployee)
  const { dataSalesOrder: salesOrders, loadingDataSalesOrder } = useSelector(state => state.salesOrder)
  const { configDailyCost } = useSelector(state => state.configDailyCost)

  const [loading, setLoading] = useState(false)

  // Helper function to find selected option by id
  const findOptionById = (options, id) => {
    return options?.find(option => option.id === Number(id)) || null
  }

  useEffect(() => {
    dispatch(fetchMasterDataCar({ active: true }))
    dispatch(fetchMasterDataEmployee({ active: true }))
    dispatch(fetchAllSalesOrder({ date: params.date, sort: 'ASC' }))
    dispatch(fetchConfigDailyCost())
  }, [dispatch, params.date])

  // Expose cars data to window object for use in other components
  useEffect(() => {
    if (cars && cars.length > 0) {
      window.cars = cars
    }
  }, [cars])

  const calculateTotal = () => {
    const costGeneralsValues = watch('costGenerals') || []
    let totals = 0
    let grandTotal = 0
    costGeneralsValues.forEach(item => {
      totals += Number(item.tollCost) || 0
      totals += Number(item.fuelCost) || 0
      totals += Number(item.transportAllowance) || 0
    })
    grandTotal = totals + getValues('totalCostEmployee') + getValues('totalCostUnexpected')
    if (salesOrders.length === 0) {
      totals = 0
      grandTotal = 0
    }
    setValue('totalCostGeneral', totals)
    setValue('grandTotal', grandTotal)
    return totals
  }

  // Helper to calculate remaining deposit
  const calculateRemainingDeposit = index => {
    const item = watch(`costGenerals.${index}`)

    const deposit = Number(item?.deposit) || 0
    const fuelCost = Number(item?.fuelCost) || 0
    const transportAllowance = Number(item?.transportAllowance) || 0

    const remainingDeposit = deposit - fuelCost - transportAllowance
    setValue(`costGenerals.${index}.remainingDeposit`, remainingDeposit)

    return remainingDeposit
  }

  // Helper to calculate remaining emoney
  const calculateRemainingEmoney = index => {
    const item = watch(`costGenerals.${index}`)
    const lastEmoney = Number(item?.lastEmoneyBalance) || 0
    const addedEmoney = Number(item?.emoney) || 0
    const tollCost = Number(item?.tollCost) || 0

    // Get all cost generals to check for previous entries with the same car
    const allCostGenerals = watch('costGenerals') || []
    const currentCarId = item?.carsId

    // If we don't have a car selected, just do the regular calculation
    if (!currentCarId) {
      const remainingEmoney = lastEmoney + addedEmoney - tollCost
      setValue(`costGenerals.${index}.remainingEmoney`, remainingEmoney)
      calculateTotal()
      return remainingEmoney
    }

    // Find previous SO entries that use the same car (must have smaller index than current)
    const previousSOWithSameCar = allCostGenerals
      .filter((costGeneral, i) => i < index && costGeneral.carsId === currentCarId)
      .sort((a, b) => a - b) // Sort by index to ensure proper order

    let startingEmoney = lastEmoney // Default to car's master balance

    // If we found a previous SO with the same car, use its remaining balance
    if (previousSOWithSameCar.length > 0) {
      // Get the last entry with the same car
      const lastSOWithSameCar = previousSOWithSameCar[previousSOWithSameCar.length - 1]
      startingEmoney = Number(lastSOWithSameCar.remainingEmoney) || lastEmoney

      // Update lastEmoneyBalance with the previous entry's remaining balance
      setValue(`costGenerals.${index}.lastEmoneyBalance`, startingEmoney)
    }

    const remainingEmoney = startingEmoney + addedEmoney - tollCost
    setValue(`costGenerals.${index}.remainingEmoney`, remainingEmoney)

    // Also update any subsequent entries with the same car
    updateSubsequentEmoneyBalances(index, currentCarId)
    calculateTotal()

    return remainingEmoney
  }

  // Helper to update emoney balances for all subsequent entries with the same car
  const updateSubsequentEmoneyBalances = (currentIndex, carId) => {
    if (!carId) return

    const allCostGenerals = watch('costGenerals') || []

    // Process each subsequent entry with the same car
    allCostGenerals.forEach((costGeneral, index) => {
      if (index > currentIndex && costGeneral.carsId === carId) {
        calculateRemainingEmoney(index)
      }
    })
  }

  // Update the last emoney balance when car is selected
  const handleCarChange = (event, index) => {
    const carsId = event.target.value

    const selectedCar = cars.find(car => car.id === Number(carsId))
    if (selectedCar) {
      setValue(`costGenerals.${index}.lastEmoneyBalance`, selectedCar.emoneyBalance || 0)
      calculateRemainingEmoney(index)

      // Recalculate remaining e-money for all subsequent SOs with the same car
      const allCostGenerals = watch('costGenerals') || []
      allCostGenerals.forEach((costGeneral, i) => {
        if (i > index && costGeneral.carsId === Number(carsId)) {
          calculateRemainingEmoney(i)
        }
      })
    }
  }

  const handleNavigateToSalesOrder = code => {
    window.open(`/sales-order/${code}/`, '_blank')
  }

  useEffect(() => {
    if (salesOrders.length > 0 && configDailyCost) {
      salesOrders.forEach((order, index) => {
        setValue(`costGenerals.${index}.salesOrderId`, order.id)

        // Set default deposit and travel money from config if they don't have values
        const depositConfig = configDailyCost.find(item => item.key === 'DC_DEPOSIT')?.value || 0
        const travelMoneyConfig = configDailyCost.find(item => item.key === 'DC_TRANSPORT_ALLOWANCE')?.value || 0

        if (!watch(`costGenerals.${index}.deposit`)) {
          setValue(`costGenerals.${index}.deposit`, depositConfig)
        }

        if (!watch(`costGenerals.${index}.transportAllowance`)) {
          setValue(`costGenerals.${index}.transportAllowance`, travelMoneyConfig)
        }

        // Initialize emoney field with 0 to prevent undefined values
        if (watch(`costGenerals.${index}.emoney`) === undefined) {
          setValue(`costGenerals.${index}.emoney`, 0)
        }

        calculateRemainingDeposit(index)
      })

    } else {
      // If no sales orders, initialize costGenerals with an empty array
      setValue('costGenerals', [])
      calculateTotal()
    }
  }, [salesOrders, configDailyCost, setValue, watch, params.date, loadingDataSalesOrder])

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
                      defaultValue={configDailyCost?.find(item => item.key === 'DC_DEPOSIT')?.value || 0}
                      value={value === null || isNaN(value) ? '0' : formatNumber(value)}
                      onChange={e => {
                        safeNumberHandler(e.target.value, onChange, () => calculateRemainingDeposit(index))
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
                      disabled={loading}
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
                      disabled={loading}
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
                      value={value === null || isNaN(value) ? '0' : formatNumber(value)}
                      onChange={e => {
                        safeNumberHandler(e.target.value, onChange, () => calculateRemainingEmoney(index))
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
                      value={field.value === null || isNaN(field.value) ? '0' : formatNumber(field.value)}
                      inputProps={{
                        inputMode: 'numeric'
                      }}
                      onChange={e => {
                        safeNumberHandler(e.target.value, field.onChange, () => calculateRemainingEmoney(index))
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
                      value={value === null || isNaN(value) ? '0' : formatNumber(value)}
                      onChange={e => {
                        safeNumberHandler(e.target.value, onChange, () => calculateRemainingDeposit(index))
                      }}
                      error={!!formState?.errors?.costGenerals?.[index]?.fuelCost}
                      helperText={formState?.errors?.costGenerals?.[index]?.fuelCost?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name={`costGenerals.${index}.transportAllowance`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Uang Jalan'
                      inputProps={{
                        inputMode: 'numeric'
                      }}
                      defaultValue={configDailyCost?.find(item => item.key === 'DC_TRANSPORT_ALLOWANCE')?.value || 0}
                      value={value === null || isNaN(value) ? '0' : formatNumber(value)}
                      onChange={e => {
                        safeNumberHandler(e.target.value, onChange, () => calculateRemainingDeposit(index))
                      }}
                      error={!!formState?.errors?.costGenerals?.[index]?.transportAllowance}
                      helperText={formState?.errors?.costGenerals?.[index]?.transportAllowance?.message}
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
