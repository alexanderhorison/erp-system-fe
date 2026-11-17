import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'

// ** Custom Component Imports
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'

// ** Shared Components
import ChoicePill from 'src/views/common/ChoicePill'
import HeaderedCard from 'src/views/common/HeaderedCard'
import PageHeader from 'src/views/common/PageHeader'

// ** Store
import { ENUM, exportReport } from 'src/store/apps/export'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

const surfaceCardSx = {
  borderRadius: `${radii['3xl']}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

// Report that need month and year
const REPORTS_WITH_MONTH_YEAR = [ENUM.SALES_ORDER, ENUM.PURCHASE_ORDER] // add other report types as needed

const typeReport = [
  {
    id: 1,
    label: 'Sales Order',
    description: 'Pesanan penjualan per periode',
    icon: 'tabler:shopping-cart',
    value: ENUM.SALES_ORDER
  },
  {
    id: 2,
    label: 'Purchase Order',
    description: 'Pesanan pembelian ke supplier per periode',
    icon: 'tabler:basket',
    value: ENUM.PURCHASE_ORDER
  },
  { id: 3, label: 'Customer', description: 'Laporan daftar customer', icon: 'tabler:user', value: ENUM.CUSTOMER },
  { id: 4, label: 'POS', description: 'Laporan POS', icon: 'tabler:shopping-bag', value: ENUM.POS }
]

const month = [
  { id: 1, label: 'January', value: 1 },
  { id: 2, label: 'February', value: 2 },
  { id: 3, label: 'March', value: 3 },
  { id: 4, label: 'April', value: 4 },
  { id: 5, label: 'May', value: 5 },
  { id: 6, label: 'June', value: 6 },
  { id: 7, label: 'July', value: 7 },
  { id: 8, label: 'August', value: 8 },
  { id: 9, label: 'September', value: 9 },
  { id: 10, label: 'October', value: 10 },
  { id: 11, label: 'November', value: 11 },
  { id: 12, label: 'December', value: 12 }
]

const schema = yup.object({
  reportType: yup.string().required('Tipe Report harus ada'),
  month: yup
    .number()
    .typeError('Bulan harus berupa angka')
    .when('reportType', {
      is: val => REPORTS_WITH_MONTH_YEAR.includes(val), // only required certain reports
      then: schema => schema.required('Bulan harus ada'),
      otherwise: schema => schema.notRequired()
    }),
  year: yup
    .number()
    .typeError('Tahun harus berupa angka')
    .when('reportType', {
      is: val => REPORTS_WITH_MONTH_YEAR.includes(val),
      then: schema => schema.required('Tahun harus ada'),
      otherwise: schema => schema.notRequired()
    })
})

const startYear = 2025

// ** Month/year of the period `offset` months before today.
const getPeriod = (offset = 0) => {
  const date = new Date()
  date.setDate(1)
  date.setMonth(date.getMonth() - offset)

  return { month: date.getMonth() + 1, year: date.getFullYear() }
}

const IconBadge = ({ icon }) => (
  <Box
    sx={{
      width: 48,
      height: 48,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: `${radii.full}px`,
      backgroundColor: stone[100],
      color: colors.foregroundAlt
    }}
  >
    <Icon icon={icon} fontSize='1.5rem' />
  </Box>
)

const FieldLabel = ({ children }) => (
  <Typography sx={{ mb: 2, fontSize: '0.9375rem', fontWeight: 500, color: colors.foreground }}>{children}</Typography>
)

export default function ReportPage() {
  const { isLoading } = useSelector(state => state.exportReport)
  const dispatch = useDispatch()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: { reportType: ENUM.SALES_ORDER, ...getPeriod(0) },
    resolver: yupResolver(schema)
  })

  const reportType = watch('reportType')
  const monthValue = watch('month')
  const yearValue = watch('year')
  const showMonthYear = reportType && REPORTS_WITH_MONTH_YEAR.includes(reportType)

  const onSubmit = data => {
    // A report that doesn't use the period must not send a stale month/year along.
    dispatch(exportReport(showMonthYear ? data : { ...data, month: '', year: '' }))
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)
  const yearOptions = years.map(y => ({ id: y, label: y.toString(), value: y }))

  const quickPeriods = [
    { label: 'Bulan ini', ...getPeriod(0) },
    { label: 'Bulan lalu', ...getPeriod(1) }
  ]

  const applyPeriod = ({ month, year }) => {
    setValue('month', month, { shouldValidate: true })
    setValue('year', year, { shouldValidate: true })
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader title='Export Report' breadcrumbs={[{ label: 'Home' }, { label: 'Report' }]} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4} alignItems='stretch'>
            <Grid item xs={12} lg={8}>
              <Box
                sx={{
                  ...surfaceCardSx,
                  p: 5,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: colors.background
                }}
              >
                <Typography sx={{ mb: 4, fontSize: '1rem', fontWeight: 500, color: colors.foreground }}>
                  Pilih Report
                </Typography>

                <Controller
                  name='reportType'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup
                      value={value || ''}
                      onChange={event => onChange(event.target.value)}
                      aria-label='Pilih Report'
                      sx={{
                        flexGrow: 1,
                        display: 'grid',
                        gap: 3,
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                        gridAutoRows: '1fr'
                      }}
                    >
                      {typeReport.map(option => {
                        const checked = option.value === value

                        return (
                          <Box
                            key={option.id}
                            component='label'
                            sx={{
                              m: 0,
                              p: 3,
                              minWidth: 0,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              cursor: 'pointer',
                              borderRadius: `${radii['3xl']}px`,
                              border: `1px solid ${
                                errors?.reportType ? colors.destructive : checked ? colors.foregroundAlt : colors.border
                              }`,
                              backgroundColor: checked ? stone[50] : colors.background,
                              boxShadow: shadows.xs,
                              transition: 'border-color 150ms, background-color 150ms',
                              '&:hover': { borderColor: colors.foregroundAlt },
                              '&:focus-within': { borderColor: colors.foreground }
                            }}
                          >
                            <IconBadge icon={option.icon} />
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground }}>
                                {option.label}
                              </Typography>
                              <Typography sx={{ mt: 1, fontSize: '0.875rem', color: colors.mutedForeground }}>
                                {option.description}
                              </Typography>
                            </Box>
                            <Radio value={option.value} size='small' sx={{ p: 1, mr: -1 }} />
                          </Box>
                        )
                      })}
                    </RadioGroup>
                  )}
                />

                {errors?.reportType && (
                  <Typography sx={{ mt: 2, fontSize: '0.75rem', color: colors.destructive }}>
                    {errors.reportType.message}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} lg={4}>
              <HeaderedCard
                title='Filters'
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                contentSx={{ p: 4, flexGrow: 1 }}
              >
                <FieldLabel>Pilih Periode</FieldLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                  {quickPeriods.map(period => (
                    <ChoicePill
                      key={period.label}
                      label={period.label}
                      disabled={!showMonthYear || period.year < startYear}
                      selected={Boolean(showMonthYear) && monthValue === period.month && yearValue === period.year}
                      onClick={() => applyPeriod(period)}
                    />
                  ))}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} lg={12} xl={6}>
                    <FieldLabel>Bulan</FieldLabel>
                    <Controller
                      name='month'
                      control={control}
                      render={() => (
                        <CustomAutocomplete
                          options={month}
                          id='autocomplete-month'
                          disabled={!showMonthYear}
                          disableClearable
                          value={month.find(item => item.value === monthValue) || null}
                          isOptionEqualToValue={(option, value) => option.value === value?.value}
                          getOptionLabel={option => option.label || ''}
                          onChange={(event, newValue) => {
                            setValue('month', newValue?.value || '', { shouldValidate: true })
                          }}
                          renderInput={params => (
                            <CustomTextField
                              {...params}
                              fullWidth
                              error={Boolean(errors?.month)}
                              {...(errors?.month && {
                                helperText: errors?.month.message
                              })}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} lg={12} xl={6}>
                    <FieldLabel>Tahun</FieldLabel>
                    <Controller
                      name='year'
                      control={control}
                      render={() => (
                        <CustomAutocomplete
                          options={yearOptions}
                          id='autocomplete-year'
                          disabled={!showMonthYear}
                          disableClearable
                          value={yearOptions.find(item => item.value === yearValue) || null}
                          isOptionEqualToValue={(option, value) => option.value === value?.value}
                          getOptionLabel={option => option.label || ''}
                          onChange={(event, newValue) => {
                            setValue('year', newValue?.value || '', { shouldValidate: true })
                          }}
                          renderInput={params => (
                            <CustomTextField
                              {...params}
                              fullWidth
                              error={Boolean(errors?.year)}
                              {...(errors?.year && {
                                helperText: errors?.year.message
                              })}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  type='submit'
                  variant='contained'
                  disabled={isLoading}
                  sx={{ mt: 4, height: 48 }}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={16} sx={{ color: 'inherit' }} />
                    ) : (
                      <Icon icon='tabler:download' fontSize='1.125rem' />
                    )
                  }
                >
                  {isLoading ? 'Exporting...' : 'Export Report'}
                </Button>
              </HeaderedCard>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  )
}
