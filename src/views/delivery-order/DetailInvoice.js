// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  '&:not(:last-child)': {
    paddingRight: `${theme.spacing(2)} !important`
  }
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const DetailInvoice = ({ data }) => {
  // ** Hook
  const theme = useTheme()

  if (data) {
    const dateTime = new Date(data?.createdAt)
    const options = { day: '2-digit', month: 'short', year: 'numeric' }
    let formattedDate = dateTime.toLocaleDateString('en-US', options).split(' ')
    formattedDate = `${formattedDate[1]} ${formattedDate[0]} ${formattedDate[2]}`
    return (
      <Card>
        <Typography
          variant='h3'
          sx={{ fontWeight: 600, lineHeight: '20px', justifyContent: 'center', display: 'flex', mt: 5 }}
        >
          SURAT JALAN
        </Typography>
        <CardContent sx={{ p: [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`] }}>
          <Divider />
          <Grid container sx={{ mt: 7 }}>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <svg width={30} viewBox='0 0 195 195' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <g id='#bd1522ff'>
                      <path
                        fill='#bd1522'
                        opacity='1.00'
                        d=' M 57.96 0.00 L 91.03 0.00 C 101.78 11.86 113.80 22.52 124.90 34.05 C 127.54 36.66 127.35 40.57 127.36 43.99 C 127.30 52.24 127.59 60.50 127.33 68.75 C 122.51 64.91 118.38 60.31 114.00 56.00 C 104.23 46.10 94.14 36.51 84.58 26.41 C 82.77 24.68 80.87 22.34 78.09 22.57 C 63.88 22.38 49.67 22.77 35.46 22.50 C 42.96 15.00 50.50 7.54 57.96 0.00 Z'
                      />
                      <path
                        fill='#bd1522'
                        opacity='1.00'
                        d=' M 172.69 41.96 C 172.68 39.36 173.06 36.78 173.47 34.21 C 180.61 41.44 187.72 48.71 195.00 55.80 L 195.00 89.48 C 184.71 100.03 174.11 110.28 163.84 120.85 C 161.67 122.97 159.41 125.69 156.05 125.46 C 146.31 125.83 136.54 125.93 126.80 125.42 C 130.14 121.24 134.06 117.61 137.85 113.86 C 148.20 103.87 158.11 93.44 168.49 83.48 C 170.25 81.61 172.72 79.79 172.63 76.94 C 172.87 65.28 172.65 53.62 172.69 41.96 Z'
                      />
                      <path
                        fill='#bd1522'
                        opacity='1.00'
                        d=' M 33.52 72.54 C 35.63 70.63 37.77 67.95 40.95 68.32 C 50.78 68.38 60.62 68.17 70.46 68.46 C 57.00 82.33 43.20 95.87 29.48 109.49 C 27.64 111.54 24.43 113.02 24.43 116.16 C 24.10 125.43 24.27 134.72 24.24 144.00 C 24.15 149.20 24.81 154.47 23.54 159.58 C 17.29 153.45 11.24 147.13 4.95 141.04 C 3.34 139.32 1.05 137.65 1.31 134.99 C 1.14 125.67 1.25 116.34 1.30 107.01 C 1.18 104.95 2.84 103.50 4.07 102.08 C 13.84 92.19 23.74 82.42 33.52 72.54 Z'
                      />
                      <path
                        fill='#bd1522'
                        opacity='1.00'
                        d=' M 69.81 126.34 C 72.15 127.02 74.00 128.68 75.66 130.38 C 87.17 142.20 98.93 153.76 110.55 165.46 C 112.95 167.82 115.23 171.11 118.92 171.28 C 133.00 171.59 147.11 170.97 161.18 171.60 C 155.95 177.86 149.60 183.08 144.18 189.18 C 141.97 191.54 139.44 194.19 135.95 194.16 C 127.28 194.36 118.59 194.21 109.91 194.42 C 106.93 194.64 104.69 192.22 102.61 190.42 C 92.44 179.91 82.26 169.41 71.66 159.34 C 69.84 157.82 70.16 155.17 69.85 153.05 C 69.78 144.15 69.75 135.24 69.81 126.34 Z'
                      />
                    </g>
                    <g id='#693b11ff'>
                      <path
                        fill='#693b11'
                        opacity='1.00'
                        d=' M 106.61 0.00 L 139.34 0.00 C 145.03 5.53 150.50 11.28 156.21 16.78 C 158.67 19.37 162.04 21.99 161.74 25.97 C 161.90 39.31 161.66 52.67 161.79 66.01 C 161.77 68.54 161.91 71.10 161.45 73.60 C 160.83 75.67 159.08 77.11 157.67 78.65 C 151.28 84.90 145.03 91.31 138.51 97.42 C 137.84 76.28 138.94 55.10 138.42 33.95 C 138.29 30.75 135.43 28.73 133.45 26.56 C 124.37 17.84 115.70 8.71 106.61 0.00 Z'
                      />
                      <path
                        fill='#693b11'
                        opacity='1.00'
                        d=' M 19.42 38.43 C 21.56 36.39 23.57 33.43 26.91 33.69 C 41.62 33.54 56.34 33.41 71.03 34.14 C 73.46 34.27 76.42 33.69 78.12 35.89 C 85.03 42.90 91.97 49.88 99.07 56.70 C 78.36 56.78 57.64 56.69 36.93 56.70 C 32.81 56.43 30.21 60.02 27.62 62.62 C 18.90 71.47 10.18 80.31 1.31 89.01 C 1.37 78.19 0.76 67.31 1.60 56.54 C 7.17 50.17 13.58 44.56 19.42 38.43 Z'
                      />
                      <path
                        fill='#693b11'
                        opacity='1.00'
                        d=' M 40.88 113.88 C 46.84 108.21 52.38 102.10 58.49 96.59 C 59.03 111.39 58.59 126.20 58.71 141.00 C 58.88 147.62 58.19 154.28 58.92 160.87 C 60.36 164.79 63.96 167.32 66.73 170.27 C 74.84 178.49 83.39 186.29 90.99 195.00 L 87.20 195.00 C 78.31 192.75 69.08 194.31 60.04 193.76 C 57.46 193.79 55.68 191.69 53.96 190.07 C 49.69 185.66 45.63 181.06 41.04 176.97 C 38.96 174.84 36.07 172.91 35.72 169.71 C 35.15 163.82 35.42 157.90 35.39 152.00 C 35.52 142.03 35.04 132.04 35.58 122.08 C 35.51 118.48 38.65 116.23 40.88 113.88 Z'
                      />
                      <path
                        fill='#693b11'
                        opacity='1.00'
                        d=' M 166.84 133.86 C 176.30 124.37 185.53 114.65 195.00 105.18 L 195.00 138.13 C 189.65 143.74 183.88 148.92 178.56 154.55 C 176.91 156.19 175.41 158.04 173.44 159.31 C 171.69 159.77 169.86 159.69 168.07 159.74 C 154.36 159.67 140.66 159.68 126.95 159.77 C 124.84 159.70 122.66 159.86 120.62 159.25 C 117.88 157.42 115.81 154.80 113.47 152.52 C 108.42 147.24 102.86 142.44 98.21 136.78 C 114.80 136.35 131.42 136.61 148.01 136.86 C 154.25 136.86 162.04 139.07 166.84 133.86 Z'
                      />
                    </g>
                  </svg>
                  <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 500, lineHeight: '18px' }}>
                    {themeConfig.templateName}
                  </Typography>
                </Box>
                {/* <div>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>Office 149, 450 South Brand Brooklyn</Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>San Diego County, CA 91905, USA</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
                </div> */}
              </Box>
            </Grid>
            <Grid item sm={6} xs={4}>
              <Box sx={{ display: 'flex', alignContent: 'flex-start' }}>
                {/* <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}> */}
                <Table sx={{}}>
                  <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h5'>Nomor Surat Jalan</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='h5'>{`#${data.delivery_order_id}`}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                          Surat Jalan Dibuat
                        </Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                          {formattedDate}
                        </Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>Surat Jalan Diterima</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{formattedDate}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>Status</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{data?.status}</Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xs={6} sm={5} sx={{ mb: { lg: 0, xs: 4 } }}>
              <Typography variant='h6' sx={{ mb: 4 }}>
                Gudang Asal
              </Typography>
              <Box sx={{ display: 'flex', alignContent: 'flex-start' }}>
                <Typography sx={{ color: 'text.secondary' }}>Nama Gudang:</Typography>
                <Typography sx={{ color: 'text.secondary', ml: 2 }}>{data?.WarehouseOrigin?.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignContent: 'flex-start' }}>
                <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>Alamat Gudang:</Typography>
                <Typography sx={{ color: 'text.secondary', ml: 2 }}>{data?.WarehouseOrigin?.location}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
              <div>
                <Typography variant='h6' sx={{ mb: 4 }}>
                  Gudang Tujuan
                </Typography>
                <Box sx={{ display: 'flex', alignContent: 'flex-start' }}>
                  <Typography sx={{ color: 'text.secondary' }}>Nama Gudang:</Typography>
                  <Typography sx={{ color: 'text.secondary', ml: 2 }}>{data?.WarehouseDestination?.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignContent: 'flex-start' }}>
                  <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>Alamat Gudang:</Typography>
                  <Typography sx={{ color: 'text.secondary', ml: 2 }}>
                    {data?.WarehouseDestination?.location}
                  </Typography>
                </Box>
                {/* <Typography variant='h6' sx={{ mb: 6 }}>
                  Surat Jalan Ke
                </Typography>
                <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{data?.WarehouseDestination?.name}</Typography>
                <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                  {data?.WarehouseDestination?.location}
                </Typography> */}
                {/* <Typography variant='h6' sx={{ mb: 6 }}>
                  Bill To:
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(0.75)} !important` } }}>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>Total Due:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            {data.paymentDetails.totalDue}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>Bank name:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data.paymentDetails.bankName}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>Country:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data.paymentDetails.country}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>IBAN:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data.paymentDetails.iban}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>SWIFT code:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data.paymentDetails.swiftCode}</Typography>
                        </MUITableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer> */}
              </div>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='left'>Produk</TableCell>
                <TableCell align='left'>Unit</TableCell>
                <TableCell align='left'>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& .MuiTableCell-root': {
                  py: `${theme.spacing(2.5)} !important`,
                  fontSize: theme.typography.body1.fontSize
                }
              }}
            >
              {data?.Product_Delivery_Orders?.map((data, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{data?.Product_Warehouse?.Master_Product?.name}</TableCell>
                    <TableCell>{data?.Product_Warehouse?.Unit?.name || ''}</TableCell>
                    <TableCell>{data?.quantity || ''}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xs={12} sm={7} lg={9} sx={{ order: { sm: 1, xs: 2 } }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Pembuat surat jalan:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.User?.name}</Typography>
              </Box>
              {/* <Typography sx={{ color: 'text.secondary' }}>Thanks for your business</Typography> */}
            </Grid>
            {/* <Grid item xs={12} sm={5} lg={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
              <CalcWrapper>
                <Typography sx={{ color: 'text.secondary' }}>Subtotal:</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>$1800</Typography>
              </CalcWrapper>
              <CalcWrapper>
                <Typography sx={{ color: 'text.secondary' }}>Discount:</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>$28</Typography>
              </CalcWrapper>
              <CalcWrapper sx={{ mb: '0 !important' }}>
                <Typography sx={{ color: 'text.secondary' }}>Tax:</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>21%</Typography>
              </CalcWrapper>
              <Divider sx={{ my: `${theme.spacing(2)} !important` }} />
              <CalcWrapper>
                <Typography sx={{ color: 'text.secondary' }}>Total:</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>$1690</Typography>
              </CalcWrapper>
            </Grid> */}
          </Grid>
        </CardContent>

        <Divider />

        <CardContent sx={{ px: [6, 10] }}>
          <Typography sx={{ color: 'text.secondary' }}>
            <Typography component='span' sx={{ mr: 1.5, fontWeight: 500, color: 'inherit' }}>
              Catatan:
            </Typography>
            {data?.notes}
          </Typography>
        </CardContent>
      </Card>
    )
  } else {
    return null
  }
}

export default DetailInvoice
