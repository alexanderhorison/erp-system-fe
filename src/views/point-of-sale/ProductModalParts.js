// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// ** Design Tokens
import { colors, status as statusTokens } from 'src/configs/designTokens'

/**
 * Small pieces shared by the POS "add product" and "edit cart item" dialogs, so both
 * read as the same form: a label-over-field rhythm, round unit pills and a tinted Sub Total.
 */

export const FieldLabel = ({ children, action = null }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 1 }}>
    <Typography sx={{ fontSize: '0.8125rem', lineHeight: 1.154, color: colors.foreground }}>{children}</Typography>
    {action}
  </Box>
)

// ** Underlined text action that sits at the right of a field label
export const LabelLink = ({ children, onClick }) => (
  <Typography
    component='button'
    type='button'
    onClick={onClick}
    sx={{
      p: 0,
      border: 0,
      cursor: 'pointer',
      background: 'none',
      fontSize: '0.75rem',
      color: colors.mutedForeground,
      textDecoration: 'underline',
      '&:hover': { color: colors.foreground }
    }}
  >
    {children}
  </Typography>
)

// ** Two-column grid of unit pills; the picked unit is filled.
export const UnitPicker = ({ units = [], selectedUnitName, onSelect }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 3 }}>
    {units.map((item, index) => (
      <Button
        key={index}
        fullWidth
        variant={selectedUnitName === item.unitName ? 'contained' : 'outlined'}
        color={selectedUnitName === item.unitName ? 'primary' : 'secondary'}
        onClick={() => onSelect(item)}
        sx={{
          height: 40,
          ...(selectedUnitName !== item.unitName && { color: colors.foreground, borderColor: colors.border3 })
        }}
      >
        {item.unitName}
      </Button>
    ))}
  </Box>
)

// ** Computed total, tinted so it reads as the figure that matters.
export const SubTotalField = ({ value }) => (
  <Box>
    <FieldLabel>
      <Box component='span' sx={{ color: statusTokens.info.fg }}>
        Sub Total
      </Box>
    </FieldLabel>
    <Box
      sx={{
        height: 40,
        px: 4,
        display: 'flex',
        alignItems: 'center',
        borderRadius: 9999,
        border: `1px solid ${statusTokens.info.fg}`,
        backgroundColor: statusTokens.info.bg
      }}
    >
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: statusTokens.info.fg }}>{value}</Typography>
    </Box>
  </Box>
)
