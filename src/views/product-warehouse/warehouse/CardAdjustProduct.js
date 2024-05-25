// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'


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

const CardAdjustProduct = ({data}) => {
  return (
    <Card>
      <Grid container spacing={6} sx={{ height: '220px' }}>
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
            <Typography variant='h5' sx={{ mb: 2 }}>
              {data?.productName}
            </Typography>
            <br></br>
            <Typography sx={{ fontWeight: 500, mb: 3 }}>
              Satuan:{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                {data?.unitName}
              </Box>
            </Typography>
            <Typography sx={{ fontWeight: 500, mb: 3 }}>
              Stok tersedia:{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                {data?.quantity}
              </Box>
            </Typography>
            <Typography sx={{ fontWeight: 500, mb: 3 }}>
              Stok Minimal:{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                {data?.minimum_stock}
              </Box>
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default CardAdjustProduct
