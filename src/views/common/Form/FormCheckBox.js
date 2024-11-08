import Checkbox from '@mui/material/Checkbox'
import FormHelperText from '@mui/material/FormHelperText'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Controller } from 'react-hook-form'

export default function FormCheckBox({
  label,
  name,
  control,
  errors,
  disabled = false,
}) {
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => {
          return (
            <FormControlLabel
              disabled={disabled}
              label={label}
              sx={errors[name] ? { color: 'error.main' } : null}
              control={
                <Checkbox
                  onChange={onChange}
                  checked={value}
                  name='validation-basic-checkbox'
                  sx={errors[name] ? { color: 'error.main' } : null}
                />
              }
            />
          )
        }}
      />
      {
        errors[name] && (
          <FormHelperText
            id='validation-basic-checkbox'
            sx={{ mx: 0, color: 'error.main', fontSize: theme => theme.typography.body2.fontSize }}
          >
            {errors[name].message}
          </FormHelperText>
        )
      }
    </>
  )
}