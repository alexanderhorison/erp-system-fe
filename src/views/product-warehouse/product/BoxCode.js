// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

/**
 * BoxCode
 * -------------------------------------------------------------------------------------
 * One reference line inside a history entry — "Surat Jalan: TBA-67264659".
 *
 * The API sends these pre-formatted as "<label>: <code>", so the string is split
 * here to style the label and the code differently. Codes that point at another
 * record are rendered as links.
 */
export default function BoxCode({ value, isClickable = false, url }) {
  if (!value) return null

  const separatorIndex = value.indexOf(':')
  const label = separatorIndex >= 0 ? value.slice(0, separatorIndex) : value
  const code = separatorIndex >= 0 ? value.slice(separatorIndex + 1).trim() : '-'

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline', flexWrap: 'wrap' }}>
      <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground }}>
        {label}:
      </Typography>
      {isClickable && url ? (
        <Link
          href={url}
          target='_blank'
          rel='noopener'
          sx={{
            fontSize: '0.8125rem',
            lineHeight: '20px',
            fontWeight: 500,
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {code}
        </Link>
      ) : (
        <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', fontWeight: 500, color: colors.foreground }}>
          {code}
        </Typography>
      )}
    </Box>
  )
}
