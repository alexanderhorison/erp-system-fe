import {
  Card, CardContent,
  Divider, Grid, Typography, Table, TableBody, TableRow, TableCell,
  TableContainer, TableHead
} from "@mui/material"
import { Box } from "@mui/system"
import { useTheme, styled } from '@mui/material/styles'
import { Status } from "src/@core/components/common"
import themeConfig from 'src/configs/themeConfig'
import { returnFormatDate, returnFormatTime } from 'src/helpers/formatDate'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'
import Logo from 'src/icons/logo'


const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  '&:not(:last-child)': {
    paddingRight: `${theme.spacing(2)} !important`
  }
}))


const ViewDetailProductRequest = ({ data }) => {
  const theme = useTheme()
  const dispatch = useDispatch()

  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  useEffect(() => {
    dispatch(fetchCompanyInfo())
  }, [dispatch])

  return (
    <Card>
      <CardContent sx={{ p: [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`] }}>
        <Grid container sx={{ mt: 7 }}>
          <Grid item sm={6} xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Logo width={30} />
                <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 500, lineHeight: '18px' }}>
                  {themeConfig.templateName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex-column', alignItems: 'center', mt: 5 }}>
                <Typography sx={{ mb: 2, color: 'text.secondary' }}>{companyInfo.companyName}</Typography>
                <Typography sx={{ mb: 2, color: 'text.secondary' }}>{companyInfo.address}</Typography>
                <Typography sx={{ mb: 2, color: 'text.secondary' }}>{companyInfo.city}</Typography>
                <Typography sx={{ color: `'text.secondary'` }}>{companyInfo.phoneNumber}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Table sx={{ maxWidth: '15rem' }}>
                <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant='h6'>Surat Product Request</Typography>
                      <Typography variant='h6'>{`#${data.code}`}</Typography>
                    </MUITableCell>
                  </TableRow>
                  <TableRow>
                    <MUITableCell>
                      <Status status={data?.status} />
                    </MUITableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
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
              <TableCell align='left'>Request</TableCell>
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
            {data?.listProducts?.map((data, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{data?.productName}</TableCell>
                  <TableCell>{data?.unitName || ''}</TableCell>
                  <TableCell>{data?.quantityRequested || ''}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <CardContent sx={{ p: [`${theme.spacing(8)} !important`, `${theme.spacing(6)} !important`] }}>
        <Grid container>
          <Grid item xs={12} sm={9} lg={9} sx={{ order: { sm: 1, xs: 2 }, mb: 4 }}>
            <Box sx={{ mb: 2, display: 'flex-col', alignItems: 'center' }}>
              <Typography sx={{ color: 'text.secondary' }}>
                <Typography component='span' sx={{ mr: 1.5, fontWeight: 500, color: 'inherit' }}>
                  CATATAN :
                </Typography>
              </Typography>
              <Typography sx={{ color: 'text.secondary', mt: 3 }}>{data?.notes}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <CardContent sx={{ px: [6, 10] }}>
        <Grid container>
          <Grid item xs={12} sm={12} lg={12} sx={{ mb: 20, mx: 7 }}>
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'center'
              }}
            >
              <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>Dibuat Oleh</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} lg={12} sx={{}}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ mb: 2, ml: 5, display: 'flex-column', alignItems: 'center', textAlign: 'center' }}>
                <Typography sx={{ color: 'text.secondary' }}>{data?.createdBy?.name}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{returnFormatDate(data?.createdAt)}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{returnFormatTime(data?.createdAt)}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ViewDetailProductRequest
