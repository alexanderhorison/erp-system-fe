// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MuiBreadcrumbs from '@mui/material/Breadcrumbs'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

/**
 * PageHeader
 * -------------------------------------------------------------------------------------
 * Breadcrumb trail above a page title (Figma: Content frame).
 *
 * `breadcrumbs` takes `[{ label, href }]`; the entry without an `href` (or the
 * last one) renders as the current page.
 *
 * `onBack` renders a back arrow beside the title, and `subtitle` a muted line
 * beneath it (used by detail pages such as a warehouse's product list).
 */
export default function PageHeader({ title, subtitle, breadcrumbs = [], action = null, onBack = null }) {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs.length > 0 && (
        <MuiBreadcrumbs
          separator={<Icon icon='tabler:chevron-right' fontSize='0.875rem' />}
          sx={{
            mb: 2,
            '& .MuiBreadcrumbs-separator': { color: colors.mutedForeground, mx: 1 }
          }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1

            if (crumb.href && !isLast) {
              return (
                <Typography
                  key={crumb.label}
                  component={Link}
                  href={crumb.href}
                  sx={{
                    fontSize: '0.875rem',
                    lineHeight: '20px',
                    textDecoration: 'none',
                    color: colors.mutedForeground,
                    '&:hover': { color: colors.foreground }
                  }}
                >
                  {crumb.label}
                </Typography>
              )
            }

            return (
              <Typography
                key={crumb.label}
                sx={{ fontSize: '0.875rem', lineHeight: '20px', color: colors.foreground }}
              >
                {crumb.label}
              </Typography>
            )
          })}
        </MuiBreadcrumbs>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {onBack && (
            <IconButton onClick={onBack} size='small' sx={{ ml: -1 }} aria-label='back'>
              <Icon icon='tabler:arrow-left' fontSize='1.25rem' />
            </IconButton>
          )}
          <Box>
            <Typography variant='h3' sx={{ color: colors.foreground }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography sx={{ fontSize: '0.875rem', lineHeight: '20px', color: colors.mutedForeground }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        {action}
      </Box>
    </Box>
  )
}
