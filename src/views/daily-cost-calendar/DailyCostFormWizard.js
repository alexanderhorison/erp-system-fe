import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// Import our cost components
import GeneralCostAndDeposit from './GeneralCostAndDeposit'
import EmployeeCostAndBonus from './EmployeeCostAndBonus'
import UnexpectedCost from './UnexpectedCost'
import SummaryCost from './SummaryCost'
import ButtonBack from '../common/ButtonBack'
import { useDispatch, useSelector } from 'react-redux'
import { addDailyCost, fetchDetailDailyCostByDate, updateDailyCost } from 'src/store/apps/daily-cost'

dayjs.locale('id')

// Define validation schema
const schema = yup.object({
  date: yup.date().required('Tanggal harus diisi'),
  notes: yup.string().optional(),
  status: yup.string().default('APPROVED').optional(),
  grandTotal: yup.number().default(0).optional(),
  totalCostGeneral: yup.number().default(0).optional(),
  totalCostEmployee: yup.number().default(0).optional(),
  totalCostUnexpected: yup.number().default(0).optional(),
  costGenerals: yup
    .array()
    .of(
      yup.object({
        deposit: yup.number().required('Jumlah harus diisi'),
        employeeId: yup.number().required('Driver harus diisi').typeError('Driver harus diisi'),
        carsId: yup.number().required('Mobil harus diisi').typeError('Mobil harus diisi'),
        salesOrderId: yup.number().required()
      })
    )
    .optional(),
  costEmployees: yup
    .array()
    .of(
      yup.object({
        employeeId: yup
          .number()
          .required('Karyawan harus dipilih')
          .test('unique-employee', 'Karyawan sudah dipilih', function (value) {
            if (!value) return true
            const costEmployees = this.from[1].value.costEmployees || []
            const count = costEmployees.filter(employee => employee && employee.employeeId === value).length
            return count <= 1
          }),
        salary: yup.number().required('Gaji harus diisi'),
        bonus: yup.number().default(0).optional(),
        amountDebt: yup.number().default(0).optional(),
        amountDebtPaid: yup
          .number()
          .default(0)
          .optional()
          .test('max-salary', 'Pembayaran hutang tidak boleh melebihi gaji', function (value) {
            const { salary } = this.parent
            return !value || !salary || value <= salary
          }),
        notes: yup.string().optional().nullable()
      })
    )
    .optional(),
  costUnexpecteds: yup
    .array()
    .of(
      yup.object({
        categoryId: yup
          .number()
          .required('Kategori biaya tidak terduga harus diisi')
          .test('unique-category', 'Kategori ini sudah digunakan', function (value) {
            return true
          }),
        description: yup.string().optional(),
        price: yup.number().required('Jumlah harus diisi')
      })
    )
    .optional()
})

export default function DailyCostFormWizard({ mode = 'ADD', selectedDate }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))

  const { detailDailyCost, loadingDetailDailyCost } = useSelector(state => state.dailyCost)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [isStepChanging, setIsStepChanging] = useState(false)

  // Define wizard steps
  const steps = [
    {
      title: 'General Cost & Deposit',
      description: 'Manage driver costs and deposits',
      component: GeneralCostAndDeposit
    },
    {
      title: 'Employee Cost & Bonus',
      description: 'Set employee salaries and bonuses',
      component: EmployeeCostAndBonus
    },
    {
      title: 'Unexpected Cost',
      description: 'Add unexpected expenses',
      component: UnexpectedCost
    },
    {
      title: 'Summary',
      description: 'Review all costs and finalize',
      component: SummaryCost
    }
  ]

  const defaultValue = {
    date: selectedDate,
    notes: '',
    status: 'APPROVED',
    grandTotal: 0,
    totalCostGeneral: 0,
    totalCostEmployee: 0,
    totalCostUnexpected: 0,
    costGenerals: [],
    costEmployees: [],
    costUnexpecteds: []
  }

  // Initialize the form with default values
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValue,
    reValidateMode: 'onChange',
    mode: 'onChange'
  })

  const formattedDate = dayjs(selectedDate).format('dddd, D MMMM YYYY')

  useEffect(() => {
    if (mode === 'EDIT' && detailDailyCost && !loadingDetailDailyCost) {
      const formattedData = {
        ...detailDailyCost,
        costGenerals: detailDailyCost.costGenerals?.map(item => ({
          salesOrderId: item.salesOrderId,
          deposit: item.depositBalance,
          employeeId: item.driverId,
          carsId: item.carsId,
          emoney: item.eMoneyBalance,
          lastEmoneyBalance: item.latestEMoneyBalance,
          remainingEmoney: item.remainingEMoneyBalance,
          tollCost: item.tollCost,
          fuelCost: item.fuelCost,
          transportAllowance: item.transportAllowance,
          remainingDeposit: item.remainingDepositBalance
        })),
        costEmployees: detailDailyCost.costEmployees,
        costUnexpecteds: detailDailyCost.costUnexpecteds
      }
      methods.reset(formattedData)
    }
  }, [detailDailyCost, loadingDetailDailyCost])

  // Form submission handler
  const handleSubmit = methods.handleSubmit(async data => {
    let costGenerals = []
    let costEmployees = []
    let costUnexpecteds = []

    let totalCostGeneral = 0
    let totalCostEmployee = 0
    let totalCostUnexpected = 0

    // Function to find the previous e-money balance for the same car ID
    const findPreviousEmoneyBalance = (carId, processedEntries, currentIndex) => {
      if (!carId) return null

      // Find previous entries with the same car ID
      const previousEntryWithSameCar = processedEntries.filter(entry => entry.carsId === carId).pop() // Get the last entry

      // If found, return its remaining e-money balance
      if (previousEntryWithSameCar) {
        return previousEntryWithSameCar.remainingEMoneyBalance
      }

      // If we're editing and have existing data, check if there's any previous record
      if (detailDailyCost && detailDailyCost.costGenerals) {
        const dailyCostEntriesForCar = detailDailyCost.costGenerals
          .filter(item => item.carsId === carId)
          .sort((a, b) => a.id - b.id)

        if (dailyCostEntriesForCar.length > 0) {
          // Get index in the original array
          const originalIndex = detailDailyCost.costGenerals.findIndex(
            item => item.carsId === carId && item.id === dailyCostEntriesForCar[0].id
          )

          if (originalIndex < currentIndex) {
            return dailyCostEntriesForCar[dailyCostEntriesForCar.length - 1].remainingEMoneyBalance
          }
        }
      }

      // For the first item (or if no previous records found), get the car's actual emoneyBalance
      const selectedCar = (window.cars || []).find(car => car.id === Number(carId))
      if (selectedCar) {
        return selectedCar.emoneyBalance || 0
      }

      return null
    }

    // COST GENERAL
    if (data.costGenerals) {
      data.costGenerals.forEach((item, index) => {
        const tollCost = +item?.tollCost || 0
        const fuelCost = +item?.fuelCost || 0
        const transportAllowance = +item?.transportAllowance || 0
        totalCostGeneral += tollCost + fuelCost + transportAllowance
        costGenerals.push({
          salesOrderId: +item.salesOrderId,
          depositBalance: +item?.deposit || 0,
          driverId: +item?.employeeId,
          carsId: +item?.carsId,
          eMoneyBalance: +item?.emoney || 0,
          // Find previous e-money balance for this car across all entries
          latestEMoneyBalance: findPreviousEmoneyBalance(item?.carsId, costGenerals, index) || +item?.emoney || 0,
          remainingEMoneyBalance: +item?.remainingEmoney || 0 - item?.tollCost || 0,
          tollCost: +item?.tollCost || 0,
          fuelCost: +item?.fuelCost || 0,
          transportAllowance: +item?.transportAllowance || 0,
          remainingDepositBalance: +item?.remainingDeposit || 0
        })
      })
    }

    // COST EMPLOYEE
    if (data.costEmployees) {
      data.costEmployees.forEach(item => {
        const salary = +item?.salary || 0
        const bonus = +item?.bonus || 0
        const amountDebt = +item?.amountDebt || 0
        const amountDebtPaid = +item?.amountDebtPaid || 0

        totalCostEmployee += salary + bonus - amountDebtPaid + amountDebt
        costEmployees.push({
          employeeId: +item.employeeId,
          employeeName: item.employeeName,
          salary: +item?.salary || 0,
          bonus: +item?.bonus || 0,
          amountDebt: +item?.amountDebt || 0,
          amountDebtPaid: +item?.amountDebtPaid || 0,
          notes: item.notes
        })
      })
    }

    // COST UNEXPECTED
    if (data.costUnexpecteds) {
      data.costUnexpecteds.forEach(item => {
        const price = +item?.price || 0
        totalCostUnexpected += price
        costUnexpecteds.push({
          categoryId: +item.categoryId,
          description: item.description,
          price: +item?.price || 0
        })
      })
    }

    const sendData = {
      date: selectedDate,
      notes: data.notes,
      status: data.status,
      grandTotal: totalCostGeneral + totalCostEmployee + totalCostUnexpected,
      totalCostGeneral,
      totalCostEmployee,
      totalCostUnexpected,
      costGenerals,
      costEmployees,
      costUnexpecteds
    }

    setIsSubmitting(true)
    if (mode === 'ADD') {
      dispatch(addDailyCost({ data: sendData, setIsSubmitting, router }))
    } else if (mode === 'EDIT') {
      dispatch(updateDailyCost({ date: selectedDate, data: sendData, setIsSubmitting, router }))
    }
  })

  // Handle cancel and return to calendar
  const handleCancel = () => {
    router.push('/daily-cost-calendar')
  }

  const handleNext = async () => {
    setIsStepChanging(true)
    try {
      await methods.trigger()
      if (isStepValid()) {
        setActiveStep(prevActiveStep => prevActiveStep + 1)
        // Save progress to localStorage (optional)
        localStorage.setItem(
          `dailyCostWizard_${selectedDate}`,
          JSON.stringify({
            step: activeStep + 1,
            formData: methods.getValues()
          })
        )
      }
    } finally {
      setIsStepChanging(false)
    }
  }

  const handleBack = () => {
    setIsStepChanging(true)
    setActiveStep(prevActiveStep => prevActiveStep - 1)
    setTimeout(() => setIsStepChanging(false), 200)
  }

  const handleStepClick = stepIndex => {
    if (stepIndex < activeStep || (stepIndex === activeStep + 1 && isStepValid()) || stepIndex === activeStep) {
      setActiveStep(stepIndex)
    }
  }
  const isStepValid = () => {
    const values = methods.getValues()
    const errors = methods.formState.errors

    switch (activeStep) {
      case 0: // General Cost & Deposit
        return !errors.costGenerals || (Array.isArray(errors.costGenerals) && errors.costGenerals.every(err => !err))
      case 1: // Employee Cost & Bonus
        // Check for both array-level and individual field errors
        const hasEmployeeErrors =
          errors.costEmployees &&
          (!Array.isArray(errors.costEmployees) ||
            errors.costEmployees.some(
              err => err && (err.employeeId || err.salary || err.amountDebtPaid || err.bonus || err.amountDebt)
            ))
        return !hasEmployeeErrors
      case 2: // Unexpected Cost
        return (
          !errors.costUnexpecteds ||
          (Array.isArray(errors.costUnexpecteds) && errors.costUnexpecteds.every(err => !err))
        )
      case 3: // Summary
        return true
      default:
        return true
    }
  }

  // Get step completion status
  const getStepStatus = stepIndex => {
    const values = methods.getValues()

    switch (stepIndex) {
      case 0:
        return values.costGenerals && values.costGenerals.length > 0
      case 1:
        return values.costEmployees && values.costEmployees.length > 0
      case 2:
        return values.costUnexpecteds && values.costUnexpecteds.length > 0
      case 3:
        return true
      default:
        return false
    }
  }

  // Render current step component
  const renderStepContent = step => {
    const StepComponent = steps[step].component
    return <StepComponent />
  }

  useEffect(() => {
    if (mode === 'EDIT' && selectedDate) {
      dispatch(fetchDetailDailyCostByDate({ date: selectedDate }))
    } else {
      // Reset form to default values when mode or date changes
      methods.reset(defaultValue)
    }
    setActiveStep(0) // Reset to first step when mode or date changes
  }, [mode, selectedDate]) // Add validation triggers for better UX
  const triggerStepValidation = async (fieldName = null) => {
    try {
      if (fieldName) {
        // Trigger validation for specific field
        await methods.trigger(fieldName)
      } else {
        // Trigger validation for current step
        await methods.trigger()
      }
    } catch (error) {
      console.log('Step validation error:', error)
    }
  }
  // Watch for changes and trigger validation
  useEffect(() => {
    const subscription = methods.watch((value, { name, type }) => {
      if (type === 'change' && name) {
        // Debounce validation
        const timeoutId = setTimeout(() => {
          // Trigger validation for specific field groups based on the changed field
          if (name.includes('costEmployees')) {
            methods.trigger('costEmployees')
          } else if (name.includes('costGenerals')) {
            methods.trigger('costGenerals')
          } else if (name.includes('costUnexpecteds')) {
            methods.trigger('costUnexpecteds')
          } else {
            // Fallback to trigger all validation
            methods.trigger()
          }
        }, 200) // Reduced debounce time for better responsiveness

        return () => clearTimeout(timeoutId)
      }
    })
    return () => subscription.unsubscribe()
  }, [methods.watch, methods.trigger])

  return (
    <FormProvider {...methods}>
      <Box sx={{ mb: 0 }}>
        <ButtonBack
          name={(mode === 'ADD' ? 'Add' : mode === 'EDIT' ? 'Edit' : 'View') + ' Daily Cost | ' + formattedDate}
        />
      </Box>

      <Grid container spacing={4} sx={{ height: '100%' }}>
        {/* Left Sidebar - Stepper */}
        <Grid item xs={12} lg={3} md={4}>
          <Paper
            sx={{
              p: 3,
              height: 'fit-content',
              position: { lg: 'sticky', xs: 'static' },
              top: 20,
              mb: { xs: 3, lg: 0 }
            }}
          >
            <Typography variant='h6' gutterBottom sx={{ color: 'primary.main' }}>
              Progress
            </Typography>
            <Stepper
              activeStep={activeStep}
              orientation={isLargeScreen ? 'vertical' : 'horizontal'}
              connector={null}
              sx={{
                '& .MuiStep-root': {
                  px: { xs: 0, lg: 1 },
                  py: { xs: 1, lg: 2 }
                }
              }}
            >
              {steps.map((step, index) => (
                <Step
                  key={index}
                  completed={index < activeStep || getStepStatus(index)}
                  // onClick={() => handleStepClick(index)}
                  sx={{
                    // cursor:
                    //   index < activeStep || (index === activeStep + 1 && isStepValid()) || index === activeStep
                    //     ? 'pointer'
                    //     : 'default',
                    marginBottom: '16px',
                    // '&:hover': {
                    //   backgroundColor:
                    //     index < activeStep || (index === activeStep + 1 && isStepValid()) || index === activeStep
                    //       ? 'rgba(0,0,0,0.04)'
                    //       : 'transparent'
                    // },
                    borderRadius: '8px',
                    padding: '8px',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <StepLabel
                    StepIconComponent={({ active, completed }) => {
                      const shouldUsePrimaryColor = index < activeStep || index === activeStep
                      return (
                        <Box
                          sx={{
                            width: { xs: 32, lg: 36 },
                            height: { xs: 32, lg: 36 },
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: { xs: '0.9rem', lg: '1rem' },
                            backgroundColor: shouldUsePrimaryColor ? 'primary.main' : 'transparent',
                            color: shouldUsePrimaryColor ? 'white' : 'grey.500',
                            border: shouldUsePrimaryColor ? 'none' : '2px solid',
                            borderColor: 'grey.400',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {index + 1}
                        </Box>
                      )
                    }}
                  >
                    <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                      <Typography
                        variant='body1'
                        fontWeight={index === activeStep ? 700 : 600}
                        color={index === activeStep ? 'primary.main' : 'text.primary'}
                      >
                        {step.title}
                      </Typography>
                      <Typography variant='caption' color='text.secondary' sx={{ lineHeight: 1.2 }}>
                        {step.description}
                      </Typography>
                      {/* {getStepStatus(index) && index !== activeStep && (
                        <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                          ✓ Completed
                        </Typography>
                      )} */}
                    </Box>
                    {/* Mobile version - just title */}
                    <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
                      <Typography
                        variant='caption'
                        fontWeight={index === activeStep ? 700 : 600}
                        color={index === activeStep ? 'primary.main' : 'text.primary'}
                      >
                        {step.title.split(' ')[0]} {/* First word only */}
                      </Typography>
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
        {/* Right Content - Form */}
        <Grid item xs={12} lg={9} md={8}>
          <Grid container spacing={4}>
            {/* Current Step Content */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, minHeight: { xs: '400px', md: '500px' } }}>
                {/* Step Header */}
                <Box sx={{ mb: { xs: 3, md: 4 }, pb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                      flexDirection: { xs: 'column', sm: 'row' }
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 32, md: 40 },
                        height: { xs: 32, md: 40 },
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }}
                    >
                      {activeStep + 1}
                    </Box>
                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                      <Typography variant='h5' color='primary.main' fontWeight={700}>
                        {steps[activeStep].title}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {steps[activeStep].description}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flex: 1, height: 8, backgroundColor: 'grey.200', borderRadius: 4, overflow: 'hidden' }}>
                      <Box
                        sx={{
                          height: '100%',
                          backgroundColor: 'primary.main',
                          borderRadius: 4,
                          width: `${((activeStep + 1) / steps.length) * 100}%`,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </Box>
                    <Typography variant='caption' color='text.secondary' fontWeight={600}>
                      {Math.round(((activeStep + 1) / steps.length) * 100)}%
                    </Typography>
                  </Box>
                </Box>
                {/* Step Content */}
                <Box sx={{ minHeight: '400px' }}>{renderStepContent(activeStep)}</Box>
              </Paper>
            </Grid>
            {/* Navigation Buttons */}
            <Grid item xs={12}>
              <Card elevation={1}>
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 3,
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 0 }
                  }}
                >
                  <Box sx={{ order: { xs: 2, sm: 1 } }}>
                    {activeStep > 0 && (
                      <Button
                        variant='outlined'
                        onClick={handleBack}
                        disabled={isSubmitting || isStepChanging}
                        startIcon={
                          isStepChanging ? (
                            <Icon icon='tabler:loader' className='animate-spin' />
                          ) : (
                            <Icon icon='tabler:chevron-left' />
                          )
                        }
                        size='medium'
                        sx={{ minWidth: { xs: '100px', md: '120px' } }}
                      >
                        Previous
                      </Button>
                    )}
                  </Box>
                  <Box
                    sx={{ display: 'flex', gap: 2, order: { xs: 1, sm: 2 }, flexDirection: { xs: 'row', sm: 'row' } }}
                  >
                    {activeStep === 0 && (
                      <Button
                        variant='outlined'
                        onClick={handleCancel}
                        disabled={isSubmitting || isStepChanging}
                        size='medium'
                        sx={{ minWidth: { xs: '80px', md: '100px' } }}
                      >
                        Cancel
                      </Button>
                    )}

                    {activeStep < steps.length - 1 ? (
                      <Button
                        variant='contained'
                        onClick={handleNext}
                        disabled={!isStepValid() || isSubmitting || isStepChanging}
                        endIcon={
                          isStepChanging ? (
                            <Icon icon='tabler:loader' className='animate-spin' />
                          ) : (
                            <Icon icon='tabler:chevron-right' />
                          )
                        }
                        size='medium'
                        sx={{ minWidth: { xs: '100px', md: '120px' } }}
                      >
                        {isStepChanging ? 'Loading...' : 'Next'}
                      </Button>
                    ) : (
                      mode !== 'view' && (
                        <Button
                          variant='contained'
                          onClick={handleSubmit}
                          disabled={isSubmitting || isStepChanging}
                          startIcon={
                            isSubmitting ? (
                              <Icon icon='tabler:loader' className='animate-spin' />
                            ) : (
                              <Icon icon='tabler:device-floppy' />
                            )
                          }
                          size='medium'
                          sx={{ minWidth: { xs: '100px', md: '120px' } }}
                        >
                          {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                      )
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
