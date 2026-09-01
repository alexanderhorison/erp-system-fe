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

// ** Third Party
import { useSelector } from 'react-redux'

// ** Configs & Helpers
import Logo from 'src/icons/logo'
import themeConfig from 'src/configs/themeConfig'
import { Status } from 'src/@core/components/common'
import { returnFormatDate, returnFormatTime } from 'src/helpers/formatDate'

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

/** Name over a date and time, used for the two signature blocks. */
const SignatureBlock = ({ label, name, timestamp }) => (
  <Box sx={{ textAlign: 'center', flex: 1 }}>
    <Typography sx={{ ...sectionLabelSx, mb: 8 }}>{label}</Typography>
    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground }}>
      {name || '-'}
    </Typography>
    <Typography sx={mutedSx}>{timestamp ? returnFormatDate(timestamp) : '-'}</Typography>
    <Typography sx={mutedSx}>{timestamp ? returnFormatTime(timestamp) : ''}</Typography>
  </Box>
)

/**
 * DetailGoodsIn
 * -------------------------------------------------------------------------------------
 * The goods-in document: company letterhead, destination, the product table,
 * notes, and the two signature blocks.
 *
 * The layout mirrors the printed sheet, so the section order is deliberate —
 * only the surface treatment (borders, spacing, type scale) follows the redesign.
 */
const DetailGoodsIn = ({ data }) => {
  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  if (!data) return null

  return (
    <Card
      elevation={0}
      sx={{ borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}
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
                Barang Masuk
              </Typography>
              <Typography sx={mutedSx}>{`#${data.code}`}</Typography>
              <Box sx={{ mt: 1 }}>
                <Status status={data?.status} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ borderColor: colors.border }} />

      {/* Destination */}
      <CardContent sx={{ p: 5 }}>
        <Typography sx={{ ...sectionLabelSx, mb: 1 }}>Gudang Tujuan</Typography>
        <Typography sx={mutedSx}>
          {data?.warehouseDestinationName}
          {data?.warehouseLocation ? ` - ${data.warehouseLocation}` : ''}
        </Typography>
      </CardContent>

      {/* Products */}
      <Box sx={{ px: 5, pb: 5 }}>
        {/* The `MuiCard` theme override forces `.MuiTableContainer-root` inside a
            Card to `border-radius: 0` with a two-class selector, which outranks
            a plain `sx` rule on this element — hence the `&&` to match it. */}
        <TableContainer
          sx={{
            '&&': { borderRadius: `${radii.md}px` },
            border: `1px solid ${colors.border}`,
            overflowX: 'auto'
          }}
        >
          <Table size='small'>
            <TableHead sx={{ backgroundColor: stone[100] }}>
              <TableRow>
                <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Produk</TableCell>
                <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Unit</TableCell>
                <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.listProduct?.map((item, index) => (
                <TableRow key={index} sx={{ '&:last-of-type td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border }}>
                    {item?.productName}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border }}>
                    {item?.unitName || '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border }}>
                    {item?.quantity ?? '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Divider sx={{ borderColor: colors.border }} />

      {/* Notes */}
      <CardContent sx={{ p: 5 }}>
        <Typography sx={{ ...sectionLabelSx, mb: 1 }}>Catatan</Typography>
        <Typography sx={mutedSx}>{data?.notes || '-'}</Typography>
      </CardContent>

      <Divider sx={{ borderColor: colors.border }} />

      {/* Signatures */}
      <CardContent sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <SignatureBlock label='Dibuat Oleh' name={data?.createdBy} timestamp={data?.createdAt} />
          <SignatureBlock label='Diterima Oleh' name={data?.approvedBy} timestamp={data?.approvedAt} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default DetailGoodsIn
