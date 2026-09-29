// ** MUI Imports
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

// 570000000 -> "570.000.000"
const formatRupiah = value => {
  const digits = String(value ?? '').replace(/\D/g, '')

  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Rupiah amount input: "Rp" prefix and "." thousand separator while typing.
 * `value` / `onChange` work with the raw digit string (e.g. "570000000"), so it
 * drops straight into a react-hook-form <Controller>.
 */
export default function CurrencyInput({ value, onChange, ...props }) {
  const handleChange = event => {
    const input = event.target
    const digitsBeforeCursor = input.value.slice(0, input.selectionStart).replace(/\D/g, '').length
    const rawValue = input.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
    const formatted = formatRupiah(rawValue)

    onChange?.(rawValue)

    // Put the caret after the same number of digits in the reformatted text
    let caret = 0
    for (let seen = 0; caret < formatted.length && seen < digitsBeforeCursor; caret++) {
      if (/\d/.test(formatted[caret])) seen++
    }
    requestAnimationFrame(() => input.setSelectionRange?.(caret, caret))
  }

  return (
    <CustomTextField
      type='text'
      inputMode='numeric'
      fullWidth
      {...props}
      value={formatRupiah(value)}
      onChange={handleChange}
      InputProps={{
        ...props.InputProps,
        startAdornment: (
          <InputAdornment position='start' sx={{ color: colors.mutedForeground }}>
            Rp
          </InputAdornment>
        )
      }}
    />
  )
}
