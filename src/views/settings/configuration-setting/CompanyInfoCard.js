import { useRouter } from 'next/router'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'

// ** Shared Components
import SectionHeading from 'src/views/common/SectionHeading'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

const fieldLabelSx = {
  fontSize: '0.75rem',
  color: colors.mutedForeground
}

const fieldValueSx = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: colors.foreground
}

const InfoField = ({ label, value }) => (
  <Box>
    <Typography sx={fieldLabelSx}>{label}</Typography>
    <Typography sx={fieldValueSx}>{value || '-'}</Typography>
  </Box>
)

export default function CompanyInfoCard({ companyInfo, loading }) {
  const router = useRouter()

  const companyData = companyInfo?.value_json ? companyInfo.value_json : companyInfo

  if (loading) {
    return <Skeleton variant='rectangular' sx={{ borderRadius: `${radii.lg}px`, height: 260 }} />
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <SectionHeading number={1} title='Company Information' />
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{
            p: 4,
            borderRadius: `${radii.lg}px`,
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.xs,
            backgroundColor: colors.background
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={companyData?.logoUrl}
                variant='rounded'
                sx={{ width: 48, height: 48, fontSize: '1.125rem', fontWeight: 600, backgroundColor: stone[200] }}
              >
                {companyData?.companyName?.slice(0, 2)?.toUpperCase() || (
                  <Icon icon='mdi:office-building' fontSize='1.25rem' />
                )}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground, mb: 1 }}>
                  {companyData?.companyName || '-'}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
                  {companyData?.phoneNumber || '-'}
                </Typography>
              </Box>
            </Box>

            <Button
              variant='contained'
              onClick={() => router.push('/settings/configuration-setting/edit')}
              startIcon={<Icon icon='mdi:pencil' fontSize='1rem' />}
              sx={{ flexShrink: 0 }}
            >
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ borderColor: colors.border, mb: 4 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <InfoField label='Company Name POS' value={companyData?.companyNamePos} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoField label='PT Name' value={companyData?.ptName} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoField label='Approval SO & PO' value={companyData?.ownerName} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoField label='Approval SO & PO Title' value={companyData?.ownerTitle} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoField label='City' value={companyData?.city} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoField label='PPN' value={companyData?.ppn} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoField label='Bank Information' value={companyData?.bank} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoField label='Address' value={companyData?.address} />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}
