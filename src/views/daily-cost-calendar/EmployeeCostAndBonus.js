import React, { useEffect, useState } from 'react'
import { useFieldArray, useFormContext, useWatch, Controller } from 'react-hook-form'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import { formatNumber, parseNumber } from 'src/utils/formatNumber'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { fetchMasterDataEmployee } from 'src/store/apps/master/employee'
import safeNumberHandler from 'src/helpers/formFormatter'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

export default function EmployeeCostAndBonus({ readOnly = false }) {
  const dispatch = useDispatch()

  const { control, watch, setValue, formState, trigger } = useFormContext()
  const { data: employees } = useSelector(state => state.masterEmployee)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'costEmployees'
  })

  const [bonusCheckboxes, setBonusCheckboxes] = useState({})

  useEffect(() => {
    dispatch(fetchMasterDataEmployee({ active: true }))
  }, [])

  // Pure computation, safe to call during render — does not call setValue.
  const computeTotal = () => {
    const costEmployeesValues = watch('costEmployees') || []
    return costEmployeesValues.reduce(
      (sum, item) =>
        sum +
        (Number(item.salary) || 0) +
        (Number(item.bonus) || 0) +
        (Number(item.amountDebt) || 0) -
        (Number(item.amountDebtPaid) || 0),
      0
    )
  }

  // Writes the computed total back into the form. Only call this from event
  // handlers/effects — never during render (calling setValue synchronously in
  // render re-triggers a re-render on every render, causing "Maximum update
  // depth exceeded" — see GeneralCostAndDeposit.js for the same fix).
  const calculateTotal = () => {
    const total = computeTotal()
    setValue('totalCostEmployee', total)
    return total
  }

  // Keeps totalCostEmployee in sync whenever costEmployees actually changes.
  const watchedCostEmployees = useWatch({ control, name: 'costEmployees' })
  useEffect(() => {
    calculateTotal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedCostEmployees])
  const handleAddEmployee = () => {
    append({
      employeeId: null,
      employeeName: '',
      salary: 0,
      bonus: 0,
      amountDebt: 0,
      amountDebtPaid: 0,
      notes: ''
    })
  }

  const handleEmployeeChange = (index, selectedEmployee) => {
    // Uncheck bonus checkbox when employee changes
    setBonusCheckboxes(prev => ({ ...prev, [index]: false }))
    if (selectedEmployee) {
      setValue(`costEmployees.${index}.employeeId`, selectedEmployee.id, { shouldValidate: true })
      setValue(`costEmployees.${index}.employeeName`, selectedEmployee.nama, { shouldValidate: true })
      // Auto-fill salary from employee data
      setValue(`costEmployees.${index}.salary`, parseNumber(selectedEmployee.salary) || 0, { shouldValidate: true })
      // Reset bonus to 0 when employee changes
      setValue(`costEmployees.${index}.bonus`, 0, { shouldValidate: true })
      // Reset debt fields to 0
      setValue(`costEmployees.${index}.amountDebt`, 0, { shouldValidate: true })
      setValue(`costEmployees.${index}.amountDebtPaid`, 0, { shouldValidate: true })

      // Recalculate total after setting new values
      calculateTotal()
    } else {
      setValue(`costEmployees.${index}.employeeId`, null, { shouldValidate: true })
      setValue(`costEmployees.${index}.employeeName`, '', { shouldValidate: true })
      setValue(`costEmployees.${index}.salary`, 0, { shouldValidate: true })
      setValue(`costEmployees.${index}.bonus`, 0, { shouldValidate: true })
      setValue(`costEmployees.${index}.amountDebt`, 0, { shouldValidate: true })
      setValue(`costEmployees.${index}.amountDebtPaid`, 0, { shouldValidate: true })
      calculateTotal()
    }
  }
  const handleBonusCheckboxChange = (index, checked) => {
    setBonusCheckboxes(prev => ({ ...prev, [index]: checked }))
    if (!checked) {
      setValue(`costEmployees.${index}.bonus`, 0, { shouldValidate: true })
      calculateTotal()
    } else {
      // If checked, update bonus from the selected employee if available
      const costEmployees = watch('costEmployees')
      const employeeId = costEmployees[index]?.employeeId
      if (employeeId) {
        const selectedEmployee = employees.find(emp => emp.id === employeeId)
        if (selectedEmployee) {
          setValue(`costEmployees.${index}.bonus`, parseNumber(selectedEmployee.bonus) || 0, { shouldValidate: true })
          calculateTotal()
        }
      }
    }
  }

  useEffect(() => {
    const initialCheckboxState = {}
    fields.forEach((field, index) => {
      if (bonusCheckboxes[index] === undefined) {
        const bonusValue = watch(`costEmployees.${index}.bonus`) || 0
        initialCheckboxState[index] = bonusValue > 0
      }
    })

    if (Object.keys(initialCheckboxState).length > 0) {
      setBonusCheckboxes(prev => ({ ...prev, ...initialCheckboxState }))
    }
  }, [fields.length])

  // Function to check if amountDebt or amountDebtPaid has value
  const handleDebtFieldChange = async (index, field, value) => {
    setValue(`costEmployees.${index}.${field}`, value, { shouldValidate: true })
    calculateTotal()
    try {
      // Trigger validation for the specific field and the entire costEmployees array
      await trigger([
        `costEmployees.${index}.${field}`,
        `costEmployees.${index}.amountDebtPaid`, // Always validate amountDebtPaid when debt fields change
        `costEmployees.${index}.salary`, // Validate salary as it's related to the validation rule
        'costEmployees'
      ])
    } catch (error) {
      console.warn('Validation trigger error:', error)
    }
  }
  // Handle salary deduction switch change
  const handleSalaryDeductionChange = (index, checked) => {
    setValue(`costEmployees.${index}.salaryDeduction`, checked, { shouldValidate: true })
    calculateTotal()
  }

  // Watch for changes in the debt fields
  const costEmployees = watch('costEmployees') || []

  return (
    <Card elevation={0} sx={{ borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}>
      <CardContent sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, mb: 4 }}>
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground }}>
              Biaya Karyawan & Bonus
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
              Atur gaji dan bonus karyawan
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
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name={`costEmployees.${index}.employeeId`}
                      control={control}
                      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                        <CustomAutocomplete
                          {...field}
                          options={employees}
                          getOptionLabel={option => option.nama || ''}
                          value={employees.find(emp => emp.id === value) || null}
                          onChange={(_, newValue) => {
                            onChange(newValue?.id || null)
                            handleEmployeeChange(index, newValue)
                          }}
                          renderInput={params => (
                            <CustomTextField
                              {...params}
                              label='Karyawan'
                              required
                              error={!!error}
                              helperText={error?.message}
                            />
                          )}
                          disabled={readOnly}
                        />
                      )}
                    />
                    {watch(`costEmployees.${index}.debt`) !== null && (
                      <Chip
                        size='small'
                        label={`Hutang: Rp ${formatNumber(costEmployees[index]?.Tm_Employee?.debt || 0)}`}
                        sx={{
                          mt: 2,
                          height: 22,
                          borderRadius: `${radii.full}px`,
                          backgroundColor: statusTokens.warning.bg,
                          border: `1px solid ${statusTokens.warning.border}`,
                          '& .MuiChip-label': { px: 1.5, fontSize: '0.6875rem', color: statusTokens.warning.fg }
                        }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name={`costEmployees.${index}.salary`}
                      control={control}
                      render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                        <CustomTextField
                          {...field}
                          value={value === null || isNaN(value) ? '0' : formatNumber(value)}
                          label='Gaji'
                          fullWidth
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
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name={`costEmployees.${index}.bonus`}
                      control={control}
                      render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                        <CustomTextField
                          {...field}
                          value={value === null || isNaN(value) ? '0' : formatNumber(value)}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', height: '15px' }}>
                              <input
                                type='checkbox'
                                checked={bonusCheckboxes[index] || false}
                                onChange={e => handleBonusCheckboxChange(index, e.target.checked)}
                                style={{
                                  width: '1em',
                                  height: '1em',
                                  marginRight: '8px'
                                }}
                                disabled={readOnly}
                              />
                              Bonus
                            </Box>
                          }
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                          disabled={readOnly || !bonusCheckboxes[index]}
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

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`costEmployees.${index}.amountDebt`}
                      control={control}
                      render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                        <CustomTextField
                          {...field}
                          value={value === null || isNaN(value) ? '0' : formatNumber(value)}
                          label='Kasbon'
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                          disabled={readOnly || costEmployees[index]?.amountDebtPaid > 0}
                          inputProps={{
                            inputMode: 'numeric'
                          }}
                          onChange={async e => {
                            const newValue = parseNumber(e.target.value) || 0
                            await handleDebtFieldChange(index, 'amountDebt', newValue)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`costEmployees.${index}.amountDebtPaid`}
                      control={control}
                      render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                        <CustomTextField
                          {...field}
                          value={value === null || isNaN(value) ? '0' : formatNumber(value)}
                          label='Bayar Kasbon'
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                          disabled={readOnly || costEmployees[index]?.amountDebt > 0}
                          inputProps={{
                            inputMode: 'numeric'
                          }}
                          onChange={async e => {
                            const newValue = parseNumber(e.target.value) || 0
                            await handleDebtFieldChange(index, 'amountDebtPaid', newValue)
                            // Explicitly trigger validation for this field and related fields
                            setTimeout(() => {
                              onChange(newValue)
                            }, 0)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name={`costEmployees.${index}.notes`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <CustomTextField
                          {...field}
                          label='Notes'
                          fullWidth
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
              onClick={handleAddEmployee}
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
