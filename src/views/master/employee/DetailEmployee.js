import { useRouter } from 'next/router'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import EmployeeInformation from './EmployeeInformation'
import EmployeeEmploymentInfo from './EmployeeEmploymentInfo'
import EmployeeDebtInformation from './EmployeeDebtInformation'
import EmployeeStatusChip from './EmployeeStatusChip'
import SectionHeading from 'src/views/common/SectionHeading'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

export default function DetailEmployee({ data, loading }) {
  const router = useRouter()

  if (loading) {
    return <Skeleton variant='rectangular' sx={{ borderRadius: `${radii.lg}px`, height: 400 }} />
  }

  if (!data) return null

  const cardSx = {
    p: 4,
    borderRadius: `${radii.lg}px`,
    border: `1px solid ${colors.border}`,
    boxShadow: shadows.xs,
    backgroundColor: colors.background
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <SectionHeading number={1} title='Informasi Pribadi' />
        <Box sx={cardSx}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar sx={{ width: 48, height: 48, fontSize: '1.125rem', fontWeight: 600 }}>
                {data?.nama?.charAt(0)?.toUpperCase() || '?'}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground, mb: 1 }}>
                  {data?.nama}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {data?.role && (
                    <Chip
                      size='small'
                      label={data.role}
                      sx={{
                        height: 22,
                        borderRadius: `${radii.full}px`,
                        backgroundColor: 'transparent',
                        border: `1px solid ${colors.border3}`,
                        '& .MuiChip-label': { px: 1.5, fontSize: '0.6875rem', color: colors.foreground }
                      }}
                    />
                  )}
                  <EmployeeStatusChip status={data?.status} isActive={data?.is_active} />
                </Box>
              </Box>
            </Box>

            <Button
              variant='contained'
              onClick={() => router.push(`/master/employee/${data.id}/edit`)}
              startIcon={<Icon icon='tabler:edit' fontSize='1rem' />}
              sx={{ flexShrink: 0 }}
            >
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ borderColor: colors.border, mb: 4 }} />

          <EmployeeInformation data={data} />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <SectionHeading number={2} title='Informasi Kepegawaian' />
        <Box sx={cardSx}>
          <EmployeeEmploymentInfo data={data} />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <SectionHeading number={3} title='Informasi Hutang' />
        <EmployeeDebtInformation />
      </Grid>
    </Grid>
  )
}
