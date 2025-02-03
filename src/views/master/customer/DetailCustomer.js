import { Button, Card, CardContent, Divider, Grid, Skeleton, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/system'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import ModalAddMasterCustomer from './ModalAddMasterCustomer'
import { useSelector } from 'react-redux'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: theme.shape.borderRadius,
  border: `4px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

export default function DetailCustomer({ data, loading }) {
  const [openModal, setOpenModal] = useState(false)
  const { dataDashboardSummaryCustomer: dataDashboard } = useSelector(state => state.dashboard)

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
        <Grid container spacing={2} mt={2} justifyContent='center'>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CustomAvatar skin='light' color={'primary'}>
                <Icon icon={'tabler:shopping-cart'} fontSize='1.5rem' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                <Typography variant='h5' textAlign={'left'}>
                  {dataDashboard[0]?.value}
                </Typography>
                <Typography variant='body2'>{dataDashboard[0]?.title}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CustomAvatar skin='light' color={'info'}>
                <Icon icon={'tabler:moneybag'} fontSize='1.5rem' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                <Typography variant='h5'>{priceFormatWIthCurrency(dataDashboard[1]?.value)}</Typography>
                <Typography variant='body2'>{dataDashboard[1]?.title}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Typography variant='h5' textAlign={'left'} sx={{ mt: '1.5rem' }}>
          Details
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left' }}>
          <Typography>
            <strong>Phone:</strong> {data.phoneNumber || '-'}
          </Typography>
          <Typography>
            <strong>Email:</strong> {data.email}
          </Typography>
          <Typography>
            <strong>Address:</strong> {data.address}
          </Typography>
          <Typography>
            <strong>Rank:</strong> {data.rankName}
          </Typography>
          <Typography>
            <strong>Notes:</strong> {data.notes}
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button onClick={handleEdit} variant='contained' sx={{ '& svg': { mr: 2 } }} fullWidth>
            <Icon icon='tabler:edit' fontSize='1.125rem' />
            Edit
          </Button>
        </Box>
      </CardContent>
      <ModalAddMasterCustomer open={openModal} setOpen={setOpenModal} typeModal={'EDIT'} id={data.id} />
    </Card>
  )
}
