import { Button, Card, CardContent, Divider, Skeleton, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/system'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import ModalAddMasterVendor from './ModalAddMasterVendor'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: theme.shape.borderRadius,
  border: `4px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

export default function DetailVendor({ data, loading }) {
  const [openModal, setOpenModal] = useState(false)

  const handleEdit = () => {
    setOpenModal(true)
  }

  if (loading) {
    return <Skeleton variant='rectangular' sx={{ borderRadius: 1, height: { xs: 150, md: 200 } }} />
  }

  return (
    <Card sx={{ padding: 4, textAlign: 'center' }}>
      <CardContent>
        <ProfilePicture
          src={data?.imgUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
          alt='profile-picture'
          sx={{ width: 150, height: 150, margin: '0 auto', p: 2 }}
        />
        <Typography variant='h5' sx={{ mb: 2.5 }}>
          {data.name}
        </Typography>
        <Typography variant='body2' sx={{ mb: 2.5 }}>
          {data.alias || '-'}
        </Typography>
        <Typography variant='h5' textAlign={'left'} sx={{ mt: '1.5rem' }}>
          Details
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left' }}>
          <Typography>
            <strong>Phone:</strong> {data.phoneNumber || '-'}
          </Typography>
          <Typography>
            <strong>Email:</strong> {data.email || '-'}
          </Typography>
          <Typography>
            <strong>Gender:</strong> {data.gender || '-'}
          </Typography>
          <Typography>
            <strong>Address:</strong> {data.address || '-'}
          </Typography>
          <Typography>
            <strong>Rank:</strong> {data.rankName || '-'}
          </Typography>
          <Typography>
            <strong>Notes:</strong> {data.notes || '-'}
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button onClick={handleEdit} variant='contained' sx={{ '& svg': { mr: 2 } }} fullWidth>
            <Icon icon='tabler:edit' fontSize='1.125rem' />
            Edit
          </Button>
        </Box>
      </CardContent>
      <ModalAddMasterVendor open={openModal} setOpen={setOpenModal} typeModal={'EDIT'} id={data.id} />
    </Card>
  )
}
