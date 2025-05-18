import React, { useEffect, useState } from 'react'
import { useFieldArray, useFormContext, Controller } from 'react-hook-form'
import { Button, Card, CardContent, CardHeader, Divider, Grid, IconButton, Typography, Box } from '@mui/material'
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import { formatNumber, parseNumber } from 'src/utils/formatNumber'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { fetchMasterDataEmployee } from 'src/store/apps/master/employee'
import safeNumberHandler from 'src/helpers/formFormatter'

export default function EmployeeCostAndBonus({ readOnly = false }) {
  const dispatch = useDispatch()

  const { control, watch, setValue, formState } = useFormContext()
  const { data: employees } = useSelector(state => state.masterEmployee)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'costEmployees'
  })

  const [bonusCheckboxes, setBonusCheckboxes] = useState({})

  useEffect(() => {
    dispatch(fetchMasterDataEmployee({ active: true }))
  }, [])

  const calculateTotal = () => {
    const costEmployeesValues = watch('costEmployees') || []
    const total = costEmployeesValues.reduce(
      (sum, item) => sum + (Number(item.salary) || 0) + (Number(item.bonus) || 0),
      0
    )
    setValue('totalCostEmployee', total)
    return total
  }

  const handleAddEmployee = () => {
    append({
      employeeId: null,
      employeeName: '',
      salary: 0,
      bonus: 0
    })
  }

  const handleEmployeeChange = (index, selectedEmployee) => {
    // Uncheck bonus checkbox when employee changes
    setBonusCheckboxes(prev => ({ ...prev, [index]: false }))
    if (selectedEmployee) {
      setValue(`costEmployees.${index}.employeeId`, selectedEmployee.id)
      setValue(`costEmployees.${index}.employeeName`, selectedEmployee.nama)
      // Auto-fill salary from employee data
      setValue(`costEmployees.${index}.salary`, parseNumber(selectedEmployee.salary) || 0)
      // Reset bonus to 0 when employee changes
      setValue(`costEmployees.${index}.bonus`, 0)

      // Recalculate total after setting new values
      calculateTotal()
    } else {
      setValue(`costEmployees.${index}.employeeId`, null)
      setValue(`costEmployees.${index}.employeeName`, '')
      setValue(`costEmployees.${index}.salary`, 0)
      setValue(`costEmployees.${index}.bonus`, 0)
      calculateTotal()
    }
  }

  const handleBonusCheckboxChange = (index, checked) => {
    setBonusCheckboxes(prev => ({ ...prev, [index]: checked }))
    if (!checked) {
      setValue(`costEmployees.${index}.bonus`, 0)
      calculateTotal()
    } else {
      // If checked, update bonus from the selected employee if available
      const costEmployees = watch('costEmployees')
      const employeeId = costEmployees[index]?.employeeId
      if (employeeId) {
        const selectedEmployee = employees.find(emp => emp.id === employeeId)
        if (selectedEmployee) {
          setValue(`costEmployees.${index}.bonus`, parseNumber(selectedEmployee.bonus) || 0)
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

  return (
    <Card>
      <CardHeader
        title='Employee Cost & Bonus'
        action={
          !readOnly && (
            <Button
              size='small'
              variant='contained'
              startIcon={<Icon icon='tabler:plus' />}
              onClick={handleAddEmployee}
            >
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
                <Grid item xs={12} sm={5}>
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
                          <CustomTextField {...params} label='Karyawan' error={!!error} helperText={error?.message} />
                        )}
                        disabled={readOnly}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
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
                <Grid item xs={12} sm={3}>
                  <Controller
                    name={`costEmployees.${index}.bonus`}
                    control={control}
                    render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                      <CustomTextField
                        {...field}
                        value={value === null || isNaN(value) ? '0' : formatNumber(value)}
                        label={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              height: '15px'
                            }}
                          >
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
