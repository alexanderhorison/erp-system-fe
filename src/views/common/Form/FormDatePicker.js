
import CustomTextField from "src/@core/components/mui/text-field";
import { forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller } from "react-hook-form";

const CustomInput = forwardRef((props, ref) => {
  return <CustomTextField fullWidth {...props} inputRef={ref} label={props.label} autoComplete='off' />
})

export default function FormDatePicker({
  name,
  fullWidth = true,
  disabled = false,
  label = '',
  errors,
  control,
  placeholder = 'DD/MM/YYYY',
  minDate = new Date(),
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field: { value, onChange } }) => (
        <>
          <DatePicker
            selected={value ? new Date(value) : null}
            name={name}
            onChange={onChange}
            fullWidth={fullWidth}
            customInput={<CustomInput label={label} />}
            disabled={disabled}
            placeholderText={placeholder}
            minDate={minDate}
          />
          {errors && (
            <div style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
              {errors[name]?.message}
            </div>
          )}
        </>
      )}
    >

    </Controller>

  )
}