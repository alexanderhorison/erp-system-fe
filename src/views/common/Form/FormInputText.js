import { Controller } from "react-hook-form";
import CustomTextField from "src/@core/components/mui/text-field";


export default function FormInputText({
  label,
  name,
  control,
  errors,
  disabled,
  placeholder = '',
  fullWidth = true,
  multiline = false,
  rows = 1,
}) {

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field: { value, onChange } }) => (
        <CustomTextField
          multiline={multiline}
          rows={rows}
          fullWidth={fullWidth}
          value={value}
          label={label}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          error={Boolean(errors[name])}
          aria-describedby={`validation-schema-${name}`}
          {...(errors[name] && { helperText: errors[name].message })}
        />
      )}
    />
  )
}