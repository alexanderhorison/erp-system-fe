import { Controller } from "react-hook-form";
import CustomTextField from "src/@core/components/mui/text-field";
import { InputAdornment } from "@mui/material";
import Icon from "src/@core/components/icon";

export default function FormInputNumberPos({
  label1 = "Quantity",
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
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label htmlFor={name} style={{ fontSize: "0.8125rem", lineHeight: "1.154", marginBottom: "0.25rem" }}>
              {label1}
            </label>
            <span style={{ fontSize: "0.8125rem", color: "gray" }}>{label}</span>
          </div>
          <CustomTextField
            type="number"
            fullWidth={fullWidth}
            value={value ?? ""} // Ensures an empty value doesn't cause issues
            // label={label}
            placeholder={placeholder}
            onChange={(e) => {
              const val = e.target.value;
              onChange(val ? Number(val) : ""); // Convert to number or empty string
            }}
            disabled={disabled}
            error={Boolean(errors[name])}
            aria-describedby={`validation-schema-${name}`}
            InputProps={{
              min,
              max,
              step,
              startAdornment: (
                <InputAdornment position="start">
                  <Icon
                    icon="tabler:minus"
                    onClick={() => {
                      const newValue = (value || 0) - step;
                      if (min === undefined || newValue >= min) onChange(newValue);
                    }}
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                      width: "50px",
                      borderRadius: "8px",
                      padding: "0px", // Add padding for better appearance
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
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                      width: "50px",
                      borderRadius: "8px",
                      cursor: disabled || (max !== undefined && value >= max) ? "not-allowed" : "pointer",
                      opacity: disabled || (max !== undefined && value >= max) ? 0.5 : 1,
                    }}
                  />
                </InputAdornment>
              ),
            }}
            {...(errors[name] && { helperText: errors[name].message })}
          />
        </>
      )}
    />
  );
}
