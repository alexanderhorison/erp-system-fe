import { MenuItem } from '@mui/material'
import { Controller } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'

export default function FormSelectSimple({
  control,
  errors,
  disabled,
  name,
  data,
  label,
  optionsValue,
  optionsLabel,
  customOptionRenderer,
  onChange: customOnChange,
  placeholder = 'Select an option'
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field: { value, onChange } }) => (
        <CustomTextField
          select
          fullWidth
          label={label}
          value={value || ''}
          onChange={e => {
            onChange(e)
            if (customOnChange) {
              customOnChange(e)
            }
          }}
          disabled={disabled}
          error={Boolean(errors[name])}
          aria-describedby={`validation-schema-${name}-helper-text`}
          {...(errors[name] && { helperText: errors[name].message })}
        >
          {data?.map((item, index) => {
            return (
              <MenuItem key={index} value={item[optionsValue]}>
                {customOptionRenderer ? customOptionRenderer(item) : item[optionsLabel]}
              </MenuItem>
            )
          })}
        </CustomTextField>
      )}
    />
  )
}
