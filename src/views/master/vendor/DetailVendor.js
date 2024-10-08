import { Button, Card, CardContent, CardMedia, Skeleton, Typography } from "@mui/material";
import { styled } from '@mui/material/styles'
import { Box } from "@mui/system";
import { useState } from "react";
import Icon from 'src/@core/components/icon'
import ModalAddMasterVendor from "./ModalAddMasterVendor";

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: theme.shape.borderRadius,
  border: `4px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

export default function DetailVendor({
  data,
  loading,
}) {
  const [openModal, setOpenModal] = useState(false)

  const handleEdit = () => {
    setOpenModal(true)
  }

  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{ borderRadius: 1, height: { xs: 150, md: 200 } }}
      />
    )
  }

  return (
    <Card sx={{ padding: 3 }}>
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}
      >
        <ProfilePicture
          src={data?.imgUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
          alt='profile-picture'
          sx={{ width: { xs: 100, md: 150 }, height: { xs: 100, md: 150 }, mr: { xs: 4, md: 0 } }}
        />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            ml: { xs: 0, md: 6 },
            alignItems: 'flex-end',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['center', 'space-between']
          }}
        >
          <Box gap={4} sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
            <Typography variant='h5' sx={{ mb: 2.5 }}>
              {data.name}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: ['center', 'flex-start']
              }}
            >
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon={"tabler:phone"} />
                <Typography sx={{ color: 'text.secondary' }}>{data.phoneNumber || '-'}</Typography>
              </Box>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon='tabler:mail' />
                <Typography sx={{ color: 'text.secondary' }}>{data.email}</Typography>
              </Box>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon='tabler:map-pin' />
                <Typography sx={{ color: 'text.secondary' }}>{data.address}</Typography>
              </Box>
            </Box>
            <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
              <Icon fontSize='1.25rem' icon='tabler:arrow-badge-down' />
              <Typography sx={{ color: 'text.secondary' }}>Rank: {data.rankName}</Typography>
            </Box>
            <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
              <Icon fontSize='1.25rem' icon='tabler:note' />
              <Typography sx={{ color: 'text.secondary' }}>Notes: {data.notes}</Typography>
            </Box>
          </Box>
          <Box >
            <Button onClick={handleEdit} variant='contained' sx={{ '& svg': { mr: 2 } }}>
              <Icon icon='tabler:edit' fontSize='1.125rem' />
              Edit
            </Button>
          </Box>
        </Box>
      </CardContent>
      <ModalAddMasterVendor open={openModal} setOpen={setOpenModal} typeModal={"EDIT"} id={data.id} />
    </Card>
  )
}