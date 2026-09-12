import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'

// ** Custom Component Imports
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'

// ** Store
import { ENUM, exportReport } from 'src/store/apps/export'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

const surfaceCardSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

// Report that need month and year
const REPORTS_WITH_MONTH_YEAR = [ENUM.SALES_ORDER, ENUM.PURCHASE_ORDER] // add other report types as needed

const typeReport = [
  { id: 1, label: 'Sales Order', value: ENUM.SALES_ORDER },
  { id: 2, label: 'Purchase Order', value: ENUM.PURCHASE_ORDER },
  { id: 3, label: 'Customer', value: ENUM.CUSTOMER },
  { id: 4, label: 'Pos', value: ENUM.POS }
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
    resolver: yupResolver(schema)
  })

  const reportType = watch('reportType')
  const showMonthYear = reportType && REPORTS_WITH_MONTH_YEAR.includes(reportType)

  // Clear month/year when the selected report type doesn't use them, so a
  // stale prior selection isn't sent along with the export request.
  useEffect(() => {
    if (!showMonthYear) {
      setValue('month', '')
      setValue('year', '')
    }
  }, [showMonthYear, setValue])

  const onSubmit = data => {
    dispatch(exportReport(data))
  }

  const startYear = 2025
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader title='Export Report' breadcrumbs={[{ label: 'Home' }, { label: 'Report' }]} />

        <Card elevation={0} sx={surfaceCardSx}>
          <CardContent sx={{ p: 5 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name='reportType'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange } }) => (
                      <CustomAutocomplete
                        options={typeReport}
                        id='autocomplete-report-type'
                        getOptionLabel={option => option.label || ''}
                        onChange={(event, newValue) => {
                          onChange(newValue?.value || '')
                          setValue('reportType', newValue?.value || '')
                        }}
                        renderInput={params => (
                          <CustomTextField
                            {...params}
                            fullWidth
                            error={Boolean(errors?.reportType)}
                            {...(errors?.reportType && {
                              helperText: errors?.reportType.message
                            })}
                            label='Tipe Report'
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name='month'
                    control={control}
                    rules={{ required: true }}
                    render={() => (
                      <CustomAutocomplete
                        options={month}
                        id='autocomplete-month'
                        disabled={!showMonthYear}
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
                            label='Bulan'
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name='year'
                    control={control}
                    rules={{ required: true }}
                    render={() => (
                      <CustomAutocomplete
                        options={years.map(y => ({ id: y, label: y.toString(), value: y }))}
                        id='autocomplete-year'
                        disabled={!showMonthYear}
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
                            label='Tahun'
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={16} sx={{ color: 'inherit' }} />
                    ) : (
                      <Icon icon='tabler:download' fontSize='1rem' />
                    )
                  }
                >
                  {isLoading ? 'Exporting...' : 'Export Report'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
