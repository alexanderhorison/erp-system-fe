// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

/**
 * DashboardStatCard
 * -------------------------------------------------------------------------------------
 * A single KPI tile for the inventory dashboard (Figma: "Barang Habis" / "Barang
 * Slow Stock" / "Total Surat Dibuat" / "Surat Pending"). `tone` picks the badge's
 * icon/background from the shared status tokens.
 */
export default function DashboardStatCard({ label, value, icon, tone = 'warning', loading = false }) {
  const toneTokens = statusTokens[tone] || statusTokens.warning

  return (
    <Card
      elevation={0}
      sx={{
        p: 4,
        borderRadius: `${radii.lg}px`,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.xs,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 2
      }}
    >
      <Box>
        <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground, mb: 2 }}>{label}</Typography>
        {loading ? (
          <Skeleton variant='text' width={48} height={36} />
        ) : (
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: colors.foreground }}>{value}</Typography>
        )}
      </Box>
      <Box
        sx={{
          width: 36,
          height: 36,
          flexShrink: 0,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: toneTokens.bg,
          color: toneTokens.fg
        }}
      >
        <Icon icon={icon} fontSize='1.125rem' />
      </Box>
    </Card>
  )
}
