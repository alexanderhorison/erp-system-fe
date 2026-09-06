import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'

// ** Configs & Helpers
import Logo from 'src/icons/logo'
import themeConfig from 'src/configs/themeConfig'
import { LinkStyled } from 'src/pages/components/swiper'
import { returnFormatDate, returnFormatTime } from 'src/helpers/formatDate'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

const sectionLabelSx = {
  fontSize: '0.875rem',
  fontWeight: 600,
  lineHeight: '20px',
  color: colors.foreground
}

const mutedSx = {
  fontSize: '0.8125rem',
  lineHeight: '20px',
  color: colors.mutedForeground
}

/**
 * Name over a date and time. The label sits above a deliberate gap that stands
 * in for the handwritten signature on the printed sheet.
 */
const SignatureBlock = ({ label, name, timestamp }) => (
  <Box sx={{ textAlign: 'center', flex: 1, maxWidth: 240 }}>
    <Typography sx={{ ...sectionLabelSx, fontSize: '1rem', mb: 12 }}>{label}</Typography>
    <Typography sx={mutedSx}>{name || '-'}</Typography>
    <Typography sx={mutedSx}>{timestamp ? returnFormatDate(timestamp) : '-'}</Typography>
    <Typography sx={mutedSx}>{timestamp ? returnFormatTime(timestamp) : ''}</Typography>
  </Box>
)

/**
 * DetailReceiveOrder
 * -------------------------------------------------------------------------------------
 * The delivery-order-receive document: company letterhead, origin and
 * destination warehouses, the received products, notes, and both the
 * creator's and receiver's signature blocks.
 *
 * The layout mirrors the printed sheet, so the section order is deliberate —
 * only the surface treatment (borders, spacing, type scale) follows the
 * redesign (see DetailInvoice.js for the sibling pattern).
 */
const DetailReceiveOrder = ({ data }) => {
  const dispatch = useDispatch()

  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  useEffect(() => {
    dispatch(fetchCompanyInfo())
  }, [dispatch])

  if (!data) return null

  return (
    <Card
      elevation={0}
      sx={{ borderRadius: `${radii['3xl']}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}
    >
      {/* Letterhead */}
      <CardContent sx={{ p: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Logo width={28} />
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground }}>
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Typography sx={mutedSx}>{companyInfo?.companyName}</Typography>
            <Typography sx={mutedSx}>{companyInfo?.address}</Typography>
            <Typography sx={mutedSx}>{companyInfo?.city}</Typography>
            <Typography sx={{ ...mutedSx, fontWeight: 500, color: colors.foreground, mt: 1 }}>
              {companyInfo?.phoneNumber}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'flex-start', sm: 'flex-end' },
                gap: 1
              }}
            >
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground }}>
                Penerimaan Surat Jalan
              </Typography>
              <Typography sx={mutedSx}>{`#${data.codeReceipt}`}</Typography>
              <Box sx={{ mt: 1, textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography sx={mutedSx}>Surat Jalan</Typography>
                <LinkStyled href={`/delivery-order/${data.codeDeliveryOrder}`} target='_blank'>
                  {`#${data.codeDeliveryOrder}`}
                </LinkStyled>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Box sx={{ px: 5 }}>
        <Divider sx={{ borderColor: colors.border }} />
      </Box>

      {/* Warehouses */}
      <CardContent sx={{ px: 5, py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ ...sectionLabelSx, mb: 2 }}>Gudang Asal</Typography>
            <Typography sx={mutedSx}>{data?.warehouseOrigin?.name}</Typography>
            <Typography sx={mutedSx}>{data?.warehouseOrigin?.location}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography sx={{ ...sectionLabelSx, mb: 2 }}>Gudang Tujuan</Typography>
            <Typography sx={mutedSx}>{data?.warehouseDestination?.name}</Typography>
            <Typography sx={mutedSx}>{data?.warehouseDestination?.location}</Typography>
          </Grid>
        </Grid>
      </CardContent>

      <Box sx={{ px: 5 }}>
        <Divider sx={{ borderColor: colors.border }} />
      </Box>

      {/* Products */}
      <Box sx={{ px: 5, py: 4 }}>
        {/* The `MuiCard` theme override forces `.MuiTableContainer-root` inside a
            Card to `border-radius: 0` with a two-class selector, which outranks
            a plain `sx` rule on this element — hence the `&&` to match it. */}
        <TableContainer
          sx={{
            '&&': { borderRadius: `${radii.lg}px` },
            border: `1px solid ${colors.border}`,
            overflowX: 'auto'
          }}
        >
          <Table size='small'>
            <TableHead sx={{ backgroundColor: stone[100] }}>
              <TableRow>
                <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Produk</TableCell>
                <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Unit</TableCell>
                <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Rak</TableCell>
                <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Kuantiti Asal</TableCell>
                <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Kuantiti Diterima</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.listProducts?.map((item, index) => (
                <TableRow key={index} sx={{ '&:last-of-type td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border }}>
                    {item?.productName}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border }}>
                    {item?.unitName || '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border }}>
                    {item?.rackName || '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border }}>
                    {item?.quantity ?? '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border }}>
                    {item?.receiveQuantity ?? '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Notes */}
      <CardContent sx={{ px: 5, pt: 0, pb: 4 }}>
        <Typography sx={{ ...sectionLabelSx, fontSize: '1rem', mb: 2 }}>Catatan:</Typography>
        <Typography sx={mutedSx}>{data?.notes || '-'}</Typography>
      </CardContent>

      <Box sx={{ px: 5 }}>
        <Divider sx={{ borderColor: colors.border }} />
      </Box>

      {/* Signature */}
      <CardContent sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap' }}>
          <SignatureBlock label='Dibuat Oleh' name={data?.creatorBy?.name} timestamp={data?.createdAt} />
          <SignatureBlock label='Diterima Oleh' name={data?.receiverBy?.name} timestamp={data?.receivedAt} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default DetailReceiveOrder
