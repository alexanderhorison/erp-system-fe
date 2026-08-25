// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

/**
 * Builds the page list, collapsing long ranges with an ellipsis so at most
 * seven slots are rendered: 1 … c-1 c c+1 … last
 */
const buildPages = (page, pageCount) => {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const pages = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)

  if (start > 2) pages.push('ellipsis-start')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < pageCount - 1) pages.push('ellipsis-end')
  pages.push(pageCount)

  return pages
}

const ghostSx = {
  minWidth: 34,
  minHeight: 36,
  px: 4,
  fontSize: '0.875rem',
  fontWeight: 500,
  color: colors.foregroundAlt,
  borderRadius: `${radii.lg}px`,
  '&:hover': { backgroundColor: colors.accent2 }
}

/**
 * TablePagination
 * -------------------------------------------------------------------------------------
 * Row-count summary plus numbered pagination (Figma: table Card footer).
 *
 * The current page is an outlined pill; the rest are ghost buttons. Page indices
 * are zero-based to match the DataGrid `paginationModel`.
 */
export default function TablePagination({ page = 0, pageSize = 10, rowCount = 0, onPageChange, itemLabel = 'items' }) {
  const pageCount = Math.max(1, Math.ceil(rowCount / pageSize))
  const from = rowCount === 0 ? 0 : page * pageSize + 1
  const to = Math.min(rowCount, (page + 1) * pageSize)
  const pages = buildPages(page + 1, pageCount)

  const goTo = nextPage => {
    const clamped = Math.min(Math.max(nextPage, 0), pageCount - 1)
    if (clamped !== page) onPageChange?.(clamped)
  }

  return (
    <Box
      sx={{
        px: 4,
        py: 3,
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: `1px solid ${colors.border}`
      }}
    >
      <Typography sx={{ fontSize: '0.875rem', lineHeight: '20px', color: colors.mutedForeground }}>
        {`Showing ${from}-${to} of ${rowCount} ${itemLabel}`}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button disabled={page === 0} onClick={() => goTo(page - 1)} sx={ghostSx}>
          Previous
        </Button>

        {pages.map(entry =>
          typeof entry === 'number' ? (
            <Button
              key={entry}
              onClick={() => goTo(entry - 1)}
              sx={
                entry === page + 1
                  ? {
                      ...ghostSx,
                      color: colors.foreground,
                      border: `1px solid ${colors.border3}`,
                      borderRadius: `${radii.full}px`,
                      boxShadow: shadows.xs,
                      backgroundColor: colors.background
                    }
                  : ghostSx
              }
            >
              {entry}
            </Button>
          ) : (
            <Box
              key={entry}
              sx={{
                minWidth: 36,
                minHeight: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.mutedForeground
              }}
            >
              <Icon icon='tabler:dots' fontSize='1rem' />
            </Box>
          )
        )}

        <Button disabled={page >= pageCount - 1} onClick={() => goTo(page + 1)} sx={ghostSx}>
          Next
        </Button>
      </Box>
    </Box>
  )
}
