import { Controller } from "react-hook-form";
import CustomTextField from "src/@core/components/mui/text-field";
import InputAdornment from "@mui/material/InputAdornment";

// Function to format the number to Rupiah format
const formatToRupiah = (value) => {
  if (!value) return "";
  return value
    .toString()
    .replace(/[^,\d]/g, "") // Remove all non-numeric except commas
    .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add thousand separator
};

// Function to parse the formatted Rupiah back to a number
const parseRupiah = (value) => {
  return value ? parseInt(value.replace(/\./g, ""), 10) : 0; // Remove dots and convert to number
};

export default function FormInputPricePos({
  label,
  name,
  control,
  errors,
  disabled,
  placeholder = "",
  fullWidth,
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
          value={formatToRupiah(value)} // Format the value for display
          label={label}
          placeholder={placeholder}
          onChange={(e) => {
            const inputElement = e.target;
            const start = inputElement.selectionStart;

            // Parse and format the value
            const rawValue = parseRupiah(inputElement.value);
            const formattedValue = formatToRupiah(rawValue);

            // Update value in form
            onChange(rawValue);

            // Restore cursor position
            const end = start + (formattedValue.length - inputElement.value.length);
            setTimeout(() => {
              inputElement.setSelectionRange(end, end);
            }, 0);
          }}
          disabled={disabled}
          error={Boolean(errors[name])}
          aria-describedby={`validation-schema-${name}`}
          {...(errors[name] && { helperText: errors[name].message })}
          InputProps={{
            startAdornment: <InputAdornment position="start">Rp</InputAdornment>, // Add "Rp" prefix
          }}
        />
      )}
    />
  );
}
