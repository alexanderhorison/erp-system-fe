import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

const cardSx = {
  p: 4,
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs,
  backgroundColor: colors.background
}

const iconBadgeSx = tone => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: tone.bg,
  color: tone.fg
})

const DashboardCardPo = ({ dataDashboardCountPo, loadingDashboardCountPo }) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6}>
        <Box sx={{ ...cardSx, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>PO Lunas</Typography>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.foreground, mt: 1 }}>
              {loadingDashboardCountPo ? '...' : dataDashboardCountPo.countPaid || 0}
            </Typography>
          </Box>
          <Box sx={iconBadgeSx(statusTokens.success)}>
            <Icon icon='tabler:square-check' fontSize='1.25rem' />
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box sx={{ ...cardSx, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>PO Belum Lunas</Typography>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.foreground, mt: 1 }}>
              {loadingDashboardCountPo ? '...' : dataDashboardCountPo.countDebt || 0}
            </Typography>
          </Box>
          <Box sx={iconBadgeSx(statusTokens.danger)}>
            <Icon icon='tabler:clock-exclamation' fontSize='1.25rem' />
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default DashboardCardPo
