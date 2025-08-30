import { Controller } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import { InputAdornment, useTheme } from '@mui/material'
import Icon from 'src/@core/components/icon'

export default function FormInputNumberPos({
  label1 = 'Quantity',
  label,
  name,
  control,
  errors,
  disabled,
  placeholder = '',
  fullWidth = true,
  min = 0,
  max,
  step = 1
}) {
  const theme = useTheme()
  const buttonWidth = '70px'
  const buttonHeight = '36px'

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: true
      }}
      render={({ field: { value, onChange } }) => (
        <>
          {(label1 && label1 !== '') || (label && label !== '') ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor={name} style={{ fontSize: '0.8125rem', lineHeight: '1.154', marginBottom: '0.25rem' }}>
                {label1}
              </label>
              <span style={{ fontSize: '0.8125rem', color: 'gray' }}>{label}</span>
            </div>
          ) : null}

          {/* New Layout: - | input | + */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Minus Button */}
            <Icon
              icon='tabler:minus'
              onClick={() => {
                if (disabled) return
                const currentValue = Number(value) || 0
                const newValue = currentValue - step
                if (min === undefined || newValue >= min) {
                  onChange(newValue)
                }
              }}
              style={{
                backgroundColor: (() => {
                  const currentValue = Number(value) || 0
                  const isDisabled = disabled || (min !== undefined && currentValue <= min)
                  return isDisabled ? theme.palette.secondary.main : theme.palette.primary.main
                })(),
                width: buttonWidth,
                height: buttonHeight,
                borderRadius: '5px',
                padding: '8px',
                cursor: (() => {
                  const currentValue = Number(value) || 0
                  const isDisabled = disabled || (min !== undefined && currentValue <= min)
                  return isDisabled ? 'not-allowed' : 'pointer'
                })(),
                opacity: (() => {
                  const currentValue = Number(value) || 0
                  const isDisabled = disabled || (min !== undefined && currentValue <= min)
                  return isDisabled ? 0.6 : 1
                })(),
                border: (() => {
                  const currentValue = Number(value) || 0
                  const isDisabled = disabled || (min !== undefined && currentValue <= min)
                  return `1px solid ${isDisabled ? theme.palette.secondary.main : theme.palette.primary.main}`
                })(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: (() => {
                  const currentValue = Number(value) || 0
                  const isDisabled = disabled || (min !== undefined && currentValue <= min)
                  return isDisabled ? theme.palette.secondary.contrastText : theme.palette.primary.contrastText
                })(),
                transition: 'all 0.2s ease',
                '&:hover':
                  !disabled && (min === undefined || Number(value) > min)
                    ? {
                        backgroundColor: theme.palette.primary.dark
                      }
                    : {}
              }}
            />

            {/* Input Field */}
            <CustomTextField
              type='number'
              fullWidth={fullWidth}
              value={value ?? ''}
              placeholder={placeholder}
              onChange={e => {
                const val = e.target.value
                const numVal = val ? Number(val) : ''

                // Validate against min/max
                if (numVal !== '') {
                  if (min !== undefined && numVal < min) return
                  if (max !== undefined && numVal > max) return
                }

                onChange(numVal)
              }}
              disabled={disabled}
              error={Boolean(errors[name])}
              aria-describedby={`validation-schema-${name}`}
              InputProps={{
                min,
                max,
                step,
                sx: {
                  textAlign: 'center',
                  '& input': {
                    textAlign: 'center'
                  }
                }
              }}
              {...(errors[name] && { helperText: errors[name].message })}
            />

            {/* Plus Button */}
            <Icon
              icon='tabler:plus'
              onClick={() => {
                if (disabled) return
                const currentValue = Number(value) || 0
                const newValue = currentValue + step
                if (max === undefined || newValue <= max) {
                  onChange(newValue)
                }
              }}
              style={{
                backgroundColor: (() => {
                  const currentValue = Number(value) || 0
                  const isDisabled = disabled || (max !== undefined && currentValue >= max)
                  return isDisabled ? theme.palette.secondary.main : theme.palette.primary.main
                })(),
                width: buttonWidth,
                height: buttonHeight,
                borderRadius: '5px',
                padding: '8px',
                cursor: (() => {
                  const currentValue = Number(value) || 0
                  const isDisabled = disabled || (max !== undefined && currentValue >= max)
                  return isDisabled ? 'not-allowed' : 'pointer'
                })(),
                opacity: (() => {
                  const currentValue = Number(value) || 0
                  const isDisabled = disabled || (max !== undefined && currentValue >= max)
                  return isDisabled ? 0.6 : 1
                })(),
                border: (() => {
                  const currentValue = Number(value) || 0
                  const isDisabled = disabled || (max !== undefined && currentValue >= max)
                  return `1px solid ${isDisabled ? theme.palette.secondary.main : theme.palette.primary.main}`
                })(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: (() => {
                  const currentValue = Number(value) || 0
                  const isDisabled = disabled || (max !== undefined && currentValue >= max)
                  return isDisabled ? theme.palette.secondary.contrastText : theme.palette.primary.contrastText
                })(),
                transition: 'all 0.2s ease',
                '&:hover':
                  !disabled && (max === undefined || Number(value) < max)
                    ? {
                        backgroundColor: theme.palette.primary.dark
                      }
                    : {}
              }}
            />
          </div>
        </>
      )}
    />
  )
}
