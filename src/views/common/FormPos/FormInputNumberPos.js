import { Controller } from "react-hook-form";
import CustomTextField from "src/@core/components/mui/text-field";
import { InputAdornment } from "@mui/material";
import Icon from "src/@core/components/icon";

export default function FormInputNumberPos({
  label,
  name,
  control,
  errors,
  disabled,
  placeholder = "",
  fullWidth = true,
  min = 0,
  max,
  step = 1,
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: true,
      }}
      render={({ field: { value, onChange } }) => (
        <CustomTextField
          type="number"
          fullWidth={fullWidth}
          value={value ?? ""} // Ensures an empty value doesn't cause issues
          label={label}
          placeholder={placeholder}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val ? Number(val) : ""); // Convert to number or empty string
          }}
          disabled={disabled}
          error={Boolean(errors[name])}
          aria-describedby={`validation-schema-${name}`}
          inputProps={{
            min,
            max,
            step,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon
                  icon="tabler:minus"
                  onClick={() => {
                    const newValue = (value || 0) - step;
                    if (min === undefined || newValue >= min) onChange(newValue);
                  }}
                  style={{
                    cursor: disabled || (min !== undefined && value <= min) ? "not-allowed" : "pointer",
                    opacity: disabled || (min !== undefined && value <= min) ? 0.5 : 1,
                  }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Icon
                  icon="tabler:plus"
                  onClick={() => {
                    const newValue = (value || 0) + step;
                    if (max === undefined || newValue <= max) onChange(newValue);
                  }}
                  style={{
                    cursor: disabled || (max !== undefined && value >= max) ? "not-allowed" : "pointer",
                    opacity: disabled || (max !== undefined && value >= max) ? 0.5 : 1,
                  }}
                />
              </InputAdornment>
            ),
          }}
          {...(errors[name] && { helperText: errors[name].message })}
        />
      )}
    />
  );
}
