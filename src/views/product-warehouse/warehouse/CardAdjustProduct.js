// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { Chip } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'


// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('md')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const CardAdjustProduct = ({ data }) => {
  return (
    <Card>
      <Grid container spacing={6} sx={{ height: '240px' }}>
        <StyledGrid item md={5} xs={12}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img width={137} height={137} alt='Product' src='https://img.freepik.com/premium-vector/cigarettes-pack-illustration-design-element-flat-icon_645658-280.jpg' />
          </CardContent>
        </StyledGrid>
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            pt: ['0 !important', '0 !important', '1.5rem !important'],
            pl: ['1.5rem !important', '1.5rem !important', '0 !important']
          }}
        >
          <CardContent>
            <Typography variant='h5'>
              {data?.productName}
            </Typography>
            <Grid container spacing={1} sx={{mt: 1}}>
              <Grid item xs={12}>
                <Chip sx={{ borderRadius: 1 }} label={data?.unitName} size='small' />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    sx={{ mr: 4, width: 34, height: 34 }}
                  >
                    <i class="fa-solid fa-cubes-stacked"></i>
                  </CustomAvatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant='h6'>{"Stok Tersedia"}</Typography>
                    <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                      {data?.quantity}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    // color={"gray"}
                    sx={{ mr: 4, width: 34, height: 34 }}
                  >
                    <i class="fa-solid fa-boxes-stacked"></i>
                  </CustomAvatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant='h6'>{"Stok Minimal"}</Typography>
                    <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                      {data?.minimumStock}
                    </Typography>
                  </Box>
                </Box>
              </Grid>


            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default CardAdjustProduct
