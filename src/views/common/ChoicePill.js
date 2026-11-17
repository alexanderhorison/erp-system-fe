// ** MUI Imports
import Box from '@mui/material/Box'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

/**
 * ChoicePill
 * -------------------------------------------------------------------------------------
 * Toggle pill for quick choices ("Bulan ini" / "Bulan lalu", "Semua" / "Ada selisih").
 * `selected` uses the same stone treatment as the selected radio cards. Pass `count`
 * to show a small count bubble after the label.
 */
export default function ChoicePill({ label, count, selected = false, disabled = false, onClick }) {
  return (
    <Box
      component='button'
      type='button'
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        px: 4,
        height: 40,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit',
        fontSize: '0.875rem',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        color: selected ? colors.foreground : colors.foregroundAlt,
        borderRadius: `${radii.full}px`,
        border: `1px solid ${selected ? colors.foregroundAlt : colors.border}`,
        backgroundColor: selected ? stone[100] : colors.background,
        boxShadow: shadows.xs,
        transition: 'border-color 150ms, background-color 150ms',
        '&:hover:not(:disabled)': { borderColor: colors.foregroundAlt },
        '&:focus-visible': { outline: `2px solid ${colors.foreground}`, outlineOffset: 2 }
      }}
    >
      {label}
      {count !== undefined && (
        <Box
          component='span'
          sx={{
            minWidth: 24,
            height: 24,
            px: 1.5,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8125rem',
            borderRadius: `${radii.full}px`,
            backgroundColor: selected ? colors.background : stone[100]
          }}
        >
          {count}
        </Box>
      )}
    </Box>
  )
}
