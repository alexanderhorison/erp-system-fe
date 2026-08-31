// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Local Components
import TimelineItemHistory from './TimelineItemHistory'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

/**
 * TableHistoryProduct
 * -------------------------------------------------------------------------------------
 * The stock-history timeline for one product, wrapped in the shared card
 * treatment. Replaces MUI Lab's `Timeline`, whose fixed left gutter wasted a
 * third of the row on wide screens.
 */
export default function TableHistoryProduct({ history, product }) {
  const entries = history || []

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: `${radii.lg}px`,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.xs
      }}
    >
      {entries.length === 0 ? (
        <Box sx={{ px: 4, py: 10, textAlign: 'center' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              mx: 'auto',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: `${radii.full}px`,
              backgroundColor: stone[100],
              color: stone[500]
            }}
          >
            <Icon icon='tabler:history' fontSize='1.25rem' />
          </Box>
          <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>
            No history data
          </Typography>
        </Box>
      ) : (
        <Box sx={{ p: 4, maxHeight: '70vh', overflowY: 'auto' }}>
          {entries.map((item, index) => (
            <TimelineItemHistory
              key={index}
              index={index}
              length={entries.length}
              product={product}
              {...item}
            />
          ))}
        </Box>
      )}
    </Card>
  )
}
