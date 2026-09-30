// ** MUI Imports
import Box from '@mui/material/Box'
import Radio from '@mui/material/Radio'
import Typography from '@mui/material/Typography'
import RadioGroup from '@mui/material/RadioGroup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Design Tokens
import { colors, radii, stone } from 'src/configs/designTokens'

// ** Display copy + icon for each payment method the stores expose.
const METHOD_META = {
  TRANSFER: { label: 'Transfer Bank', icon: 'tabler:building-bank' },
  CASH: { label: 'Cash', icon: 'tabler:cash' },
  GIRO: { label: 'Giro', icon: 'tabler:credit-card' }
}

const metaFor = option => METHOD_META[option.value] || { label: option.name, icon: 'tabler:wallet' }

const labelSx = { mb: 1, fontSize: '0.875rem', lineHeight: 1.154, color: colors.foreground }

const IconBadge = ({ icon }) => (
  <Box
    sx={{
      width: 28,
      height: 28,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: `${radii.full}px`,
      backgroundColor: stone[100],
      color: colors.foregroundAlt
    }}
  >
    <Icon icon={icon} fontSize='1rem' />
  </Box>
)

/**
 * PaymentMethodSelect
 * -------------------------------------------------------------------------------------
 * Payment method picker: one pill per method with its icon and a radio on the
 * right, instead of a dropdown. Drops into a react-hook-form <Controller> —
 * `value` / `onChange` carry the method's `value` (e.g. 'TRANSFER').
 *
 * `options` is the stores' `dataTypePayment` ({ id, value, name }); display copy
 * and icons are looked up by `value`. Disabled renders as label + plain text,
 * like every other disabled field.
 */
export default function PaymentMethodSelect({
  label = 'Metode Pembayaran',
  options = [],
  value,
  onChange,
  disabled,
  error,
  helperText
}) {
  if (disabled) {
    const selected = options.find(option => option.value === value)
    const meta = selected && metaFor(selected)

    return (
      <Box>
        <Typography sx={labelSx}>{label}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minHeight: 40 }}>
          {meta && <IconBadge icon={meta.icon} />}
          <Typography sx={{ fontSize: '0.875rem', lineHeight: '20px', color: colors.mutedForeground }}>
            {meta?.label || '-'}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <Typography sx={labelSx}>{label}</Typography>
      <RadioGroup
        row
        value={value || ''}
        onChange={event => onChange?.(event.target.value)}
        aria-label={label}
        sx={{ flexWrap: 'wrap', gap: 3, mt: 3 }}
      >
        {options.map(option => {
          const meta = metaFor(option)
          const checked = option.value === value

          return (
            <Box
              key={option.id ?? option.value}
              component='label'
              sx={{
                flex: '1 1 140px',
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                m: 0,
                pl: 2,
                pr: 1,
                py: 1,
                cursor: 'pointer',
                borderRadius: `${radii.full}px`,
                border: `1px solid ${error ? colors.destructive : checked ? colors.foregroundAlt : colors.border}`,
                backgroundColor: checked ? stone[50] : colors.background,
                transition: 'border-color 150ms, background-color 150ms',
                '&:hover': { borderColor: error ? colors.destructive : colors.foregroundAlt },
                '&:focus-within': { borderColor: colors.foreground }
              }}
            >
              <IconBadge icon={meta.icon} />
              <Typography
                sx={{
                  flexGrow: 1,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  lineHeight: '20px',
                  color: colors.foreground
                }}
              >
                {meta.label}
              </Typography>
              <Radio value={option.value} size='small' sx={{ p: 1 }} />
            </Box>
          )
        })}
      </RadioGroup>
      {error && helperText && (
        <Typography sx={{ mt: 1, fontSize: '0.75rem', lineHeight: 1.154, color: colors.destructive }}>
          {helperText}
        </Typography>
      )}
    </Box>
  )
}
