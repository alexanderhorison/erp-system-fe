import { useState } from 'react'

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
import ModalAddMasterCustomer from './ModalAddMasterCustomer'

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

/** Icon in a circular tint, with a label over a value beside it. */
const InfoField = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
    <Box
      sx={{
        width: 32,
        height: 32,
        flexShrink: 0,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: stone[100],
        color: colors.mutedForeground
      }}
    >
      <Icon icon={icon} fontSize='1.125rem' />
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={fieldLabelSx}>{label}</Typography>
      <Typography sx={fieldValueSx}>{value || '-'}</Typography>
    </Box>
  </Box>
)

export default function DetailCustomer({ data, loading }) {
  const [openModal, setOpenModal] = useState(false)

  if (loading) {
    return <Skeleton variant='rectangular' sx={{ borderRadius: `${radii.lg}px`, height: 220 }} />
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
        <SectionHeading number={1} title='Informasi Customer' />
      </Grid>

      <Grid item xs={12} md={9}>
        <Box sx={cardSx}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar sx={{ width: 48, height: 48, fontSize: '1.125rem', fontWeight: 600 }}>
                {data?.name?.slice(0, 2)?.toUpperCase() || '?'}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground, mb: 1 }}>
                  {data?.name}
                </Typography>
                {data?.rankName && (
                  <Chip
                    size='small'
                    label={data.rankName}
                    sx={{
                      height: 22,
                      borderRadius: `${radii.full}px`,
                      backgroundColor: 'transparent',
                      border: `1px solid ${colors.border3}`,
                      '& .MuiChip-label': { px: 1.5, fontSize: '0.6875rem', color: colors.foreground }
                    }}
                  />
                )}
              </Box>
            </Box>

            <Button
              variant='contained'
              onClick={() => setOpenModal(true)}
              startIcon={<Icon icon='tabler:edit' fontSize='1rem' />}
              sx={{ flexShrink: 0 }}
            >
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ borderColor: colors.border, mb: 4 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <InfoField icon='tabler:phone' label='Telepon' value={data?.phoneNumber} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InfoField icon='tabler:mail' label='Email' value={data?.email} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InfoField icon='tabler:map-pin' label='Alamat' value={data?.address} />
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid item xs={12} md={3}>
        <Box sx={cardSx}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground, mb: 3 }}>
            Catatan
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>{data?.notes || '-'}</Typography>
        </Box>
      </Grid>

      {openModal && (
        <ModalAddMasterCustomer open={openModal} setOpen={setOpenModal} typeModal={'EDIT'} id={data.id} />
      )}
    </Grid>
  )
}
