import { Controller } from "react-hook-form";
import CustomTextField from "src/@core/components/mui/text-field";
import { keyframes } from "@mui/system";

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
  type = 'text',
  required = false,
  loading = false
}) {
  // Define pulse animation using keyframes
  const pulse = keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  `;

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field: { value, onChange } }) => (
        <CustomTextField
          type={type}
          multiline={multiline}
          rows={rows}
          fullWidth={fullWidth}
          value={loading ? '' : value}
          label={`${label} ${required ? '*' : ''}`}
          placeholder={loading ? '' : placeholder}
          onChange={onChange}
          disabled={disabled || loading}
          error={Boolean(errors[name])}
          aria-describedby={`validation-schema-${name}`}
          {...(errors[name] && { helperText: errors[name].message })}
          InputProps={{
            sx: loading
              ? {
                animation: `${pulse} 1.5s ease-in-out infinite`,
                backgroundColor: '#f0f0f0',
                color: 'transparent', // Hide text while loading
              }
              : {},
          }}
        />
      )}
    />
  );
}