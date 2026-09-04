import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
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
import { useDispatch, useSelector } from 'react-redux'
import { addDailyCost, fetchDetailDailyCostByDate, updateDailyCost } from 'src/store/apps/daily-cost'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

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

  const { detailDailyCost, loadingDetailDailyCost } = useSelector(state => state.dailyCost)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [isStepChanging, setIsStepChanging] = useState(false)

  // Define wizard steps
  const steps = [
    {
      title: 'Biaya Umum & Deposit',
      description: 'Kelola biaya sopir dan deposit',
      component: GeneralCostAndDeposit
    },
    {
      title: 'Biaya Karyawan & Bonus',
      description: 'Atur gaji dan bonus karyawan',
      component: EmployeeCostAndBonus
    },
    {
      title: 'Biaya Tak Terduga',
      description: 'Tambahkan pengeluaran tak terduga',
      component: UnexpectedCost
    },
    {
      title: 'Ringkasan',
      description: 'Tinjau semua biaya dan selesaikan',
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

  // ** In EDIT mode the record already exists, so the sidebar steps are freely
  // clickable (per product decision). ADD mode keeps Next-gated progression so
  // a user can't reach Summary with earlier steps left empty.
  const handleStepClick = index => {
    if (mode !== 'EDIT' || isStepChanging || isSubmitting || index === activeStep) return
    setActiveStep(index)
  }

  const isStepValid = () => {
    const values = methods.getValues()
    const errors = methods.formState.errors

    switch (activeStep) {
      case 0: // Biaya Umum & Deposit
        return !errors.costGenerals || (Array.isArray(errors.costGenerals) && errors.costGenerals.every(err => !err))
      case 1: // Biaya Karyawan & Bonus
        // Check for both array-level and individual field errors
        const hasEmployeeErrors =
          errors.costEmployees &&
          (!Array.isArray(errors.costEmployees) ||
            errors.costEmployees.some(
              err => err && (err.employeeId || err.salary || err.amountDebtPaid || err.bonus || err.amountDebt)
            ))
        return !hasEmployeeErrors
      case 2: // Biaya Tak Terduga
        return (
          !errors.costUnexpecteds ||
          (Array.isArray(errors.costUnexpecteds) && errors.costUnexpecteds.every(err => !err))
        )
      case 3: // Ringkasan
        return true
      default:
        return true
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

  // Computed directly from the three subtotals rather than read from the
  // `grandTotal` field — that field is only kept in sync by whichever step's
  // effect last ran (GeneralCostAndDeposit only rewrites it when costGenerals
  // changes, not when Employee/Unexpected totals change later), so it can go
  // stale while moving through the wizard. Summing the subtotals live avoids
  // that staleness, matching how SummaryCost.js's Ringkasan step computes it.
  const totalCostGeneral = Number(methods.watch('totalCostGeneral')) || 0
  const totalCostEmployee = Number(methods.watch('totalCostEmployee')) || 0
  const totalCostUnexpected = Number(methods.watch('totalCostUnexpected')) || 0
  const grandTotal = totalCostGeneral + totalCostEmployee + totalCostUnexpected

  return (
    <FormProvider {...methods}>
      <PageHeader
        title={(mode === 'ADD' ? 'Tambah' : 'Ubah') + ' Daily Cost'}
        subtitle={formattedDate}
        onBack={() => router.back()}
        breadcrumbs={[
          { label: 'Daily Cost' },
          { label: 'Daily Cost Calendar', href: '/daily-cost-calendar' },
          { label: mode === 'ADD' ? 'Tambah' : 'Ubah' }
        ]}
      />

      <Grid container spacing={4}>
        {/* Left Sidebar - Progress */}
        <Grid item xs={12} lg={3}>
          <Box sx={{ position: { lg: 'sticky', xs: 'static' }, top: 20 }}>
            <Box
              sx={{
                borderRadius: `${radii.lg}px`,
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.xs,
                backgroundColor: colors.background,
                p: 4,
                mb: 4
              }}
            >
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground, mb: 3 }}>
                Progress Pengisian
              </Typography>

              {steps.map((step, index) => {
                const isActive = index === activeStep
                const isDone = index < activeStep
                const isLast = index === steps.length - 1
                const clickable = mode === 'EDIT' && index !== activeStep

                return (
                  <Box
                    key={index}
                    onClick={() => handleStepClick(index)}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 3,
                      px: 2,
                      pt: 2,
                      borderRadius: `${radii.md}px`,
                      cursor: clickable ? 'pointer' : 'default',
                      backgroundColor: isActive ? colors.background : 'transparent',
                      '&:hover': clickable ? { backgroundColor: colors.background } : undefined
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          flexShrink: 0,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: isDone
                            ? statusTokens.success.bg
                            : isActive
                              ? colors.foreground
                              : 'transparent',
                          color: isDone
                            ? statusTokens.success.fg
                            : isActive
                              ? colors.primaryForeground
                              : colors.mutedForeground,
                          border: isDone
                            ? `1px solid ${statusTokens.success.border}`
                            : isActive
                              ? 'none'
                              : `2px solid ${colors.border3}`
                        }}
                      >
                        {isDone ? <Icon icon='tabler:check' fontSize='0.875rem' /> : index + 1}
                      </Box>
                      {!isLast && (
                        <Box
                          sx={{
                            width: '2px',
                            flexGrow: 1,
                            minHeight: 28,
                            my: 1,
                            backgroundColor: isDone ? statusTokens.success.fg : colors.border
                          }}
                        />
                      )}
                    </Box>
                    <Box sx={{ minWidth: 0, pb: isLast ? 2 : 4 }}>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: colors.foreground
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                        {step.description}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </Box>

            <Box
              sx={{
                borderRadius: `${radii.lg}px`,
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.xs,
                backgroundColor: colors.background,
                p: 4
              }}
            >
              <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground, mb: 1 }}>
                Total Berjalan
              </Typography>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'success.main', mb: 1 }}>
                Rp {grandTotal.toLocaleString('id-ID')}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                Terhitung otomatis dari semua bagian yang sudah diisi.
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Right Content - Form */}
        <Grid item xs={12} lg={9}>
          <Grid container spacing={4}>
            {/* Current Step Content */}
            <Grid item xs={12}>
              {renderStepContent(activeStep)}
            </Grid>

            {/* Navigation Buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 4,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 3,
                  borderRadius: `${radii.lg}px`,
                  border: `1px solid ${colors.border}`,
                  boxShadow: shadows.xs,
                  backgroundColor: colors.background
                }}
              >
                <Box>
                  {activeStep > 0 && (
                    <Button
                      variant='outlined'
                      color='secondary'
                      onClick={handleBack}
                      disabled={isSubmitting || isStepChanging}
                      startIcon={
                        isStepChanging ? (
                          <Icon icon='tabler:loader' className='animate-spin' />
                        ) : (
                          <Icon icon='tabler:chevron-left' fontSize='1rem' />
                        )
                      }
                      sx={{
                        color: colors.foreground,
                        borderColor: colors.border3,
                        boxShadow: shadows.xs,
                        '&:hover': { borderColor: colors.border3 }
                      }}
                    >
                      Previous
                    </Button>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {activeStep === 0 && (
                    <Button
                      variant='outlined'
                      color='secondary'
                      onClick={handleCancel}
                      disabled={isSubmitting || isStepChanging}
                      startIcon={<Icon icon='tabler:x' fontSize='1rem' />}
                      sx={{
                        color: colors.foreground,
                        borderColor: colors.border3,
                        boxShadow: shadows.xs,
                        '&:hover': { borderColor: colors.border3 }
                      }}
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
                          <Icon icon='tabler:chevron-right' fontSize='1rem' />
                        )
                      }
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
                            <Icon icon='tabler:device-floppy' fontSize='1rem' />
                          )
                        }
                      >
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </Button>
                    )
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
