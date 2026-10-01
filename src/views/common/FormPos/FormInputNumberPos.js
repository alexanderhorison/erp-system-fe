import { Controller } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

const StepButton = ({ icon, disabled, onClick }) => (
  <IconButton
    onClick={onClick}
    disabled={disabled}
    aria-label={icon === 'tabler:plus' ? 'Tambah' : 'Kurangi'}
    sx={{
      width: 36,
      height: 36,
      flexShrink: 0,
      color: 'primary.contrastText',
      backgroundColor: 'primary.main',
      '&:hover': { backgroundColor: 'primary.dark' },
      '&.Mui-disabled': { color: 'primary.contrastText', backgroundColor: 'primary.main', opacity: 0.4 }
    }}
  >
    <Icon icon={icon} fontSize='1.125rem' />
  </IconButton>
)

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

          {/* - | input | + : round stepper buttons either side of a pill field */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StepButton
              icon='tabler:minus'
              disabled={disabled || (min !== undefined && (Number(value) || 0) <= min)}
              onClick={() => {
                const newValue = (Number(value) || 0) - step
                if (min === undefined || newValue >= min) onChange(newValue)
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
              keepDisabledField
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

            <StepButton
              icon='tabler:plus'
              disabled={disabled || (max !== undefined && (Number(value) || 0) >= max)}
              onClick={() => {
                const newValue = (Number(value) || 0) + step
                if (max === undefined || newValue <= max) onChange(newValue)
              }}
            />
          </div>
        </>
      )}
    />
  )
}
