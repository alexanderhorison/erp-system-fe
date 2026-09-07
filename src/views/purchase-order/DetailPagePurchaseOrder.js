import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
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
import { priceFormat } from 'src/helpers/priceFormatter'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens, stone } from 'src/configs/designTokens'

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

// ** Purchase Order only ever carries these statuses (see Status.js's original
// switch) — mapped onto the design tokens' status tones for the badge here.
const statusTone = status => {
  switch (status) {
    case 'APPROVED':
    case 'PAID':
      return statusTokens.success
    case 'REJECTED':
    case 'VOID':
      return statusTokens.danger
    case 'DRAFT':
      return statusTokens.warning
    case 'PENDING':
    default:
      return statusTokens.info
  }
}

const SignatureBlock = ({ label, name, title }) => (
  <Box sx={{ textAlign: 'center', flex: 1, maxWidth: 240 }}>
    <Typography sx={{ ...sectionLabelSx, fontSize: '1rem', mb: 12 }}>{label}</Typography>
    <Typography sx={mutedSx}>{name || '( ................... )'}</Typography>
    {title && <Typography sx={mutedSx}>{title}</Typography>}
  </Box>
)

/**
 * DetailPagePurchaseOrder
 * -------------------------------------------------------------------------------------
 * The purchase-order document: company letterhead, vendor info, the ordered
 * (and bartered) products, notes, totals, the payment instruction, and both
 * signature blocks. Mirrors DetailPageSalesOrder.js's pattern.
 */
const DetailPagePurchaseOrder = ({ data }) => {
  const dispatch = useDispatch()
  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  useEffect(() => {
    dispatch(fetchCompanyInfo())
  }, [dispatch])

  if (!data) return null

  const tone = statusTone(data?.status)

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
                Purchase Order
              </Typography>
              <Chip
                size='small'
                label={data?.status || '-'}
                sx={{
                  height: 24,
                  borderRadius: `${radii.full}px`,
                  border: `1px solid ${tone.border}`,
                  backgroundColor: tone.bg,
                  '& .MuiChip-label': {
                    px: 2,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    lineHeight: '16px',
                    color: tone.fg
                  }
                }}
              />
              <Typography sx={mutedSx}>{`#${data.code}`}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Box sx={{ px: 5 }}>
        <Divider sx={{ borderColor: colors.border }} />
      </Box>

      {/* Vendor + due date */}
      <CardContent sx={{ px: 5, py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ ...sectionLabelSx, mb: 2 }}>Vendor</Typography>
            <Typography sx={mutedSx}>{data?.vendor?.name?.toUpperCase() || ''}</Typography>
            <Typography sx={mutedSx}>{data?.vendor?.address?.toUpperCase() || ''}</Typography>
            {data?.vendor?.phoneNumber && <Typography sx={mutedSx}>{data.vendor.phoneNumber}</Typography>}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography sx={mutedSx}>Tgl. Jatuh Tempo</Typography>
            <Typography sx={{ ...sectionLabelSx, fontWeight: 500 }}>{data.dueDate}</Typography>
          </Grid>
        </Grid>
      </CardContent>

      <Box sx={{ px: 5 }}>
        <Divider sx={{ borderColor: colors.border }} />
      </Box>

      {/* Barang Purchase Order */}
      <Box sx={{ px: 5, py: 4 }}>
        <Typography sx={{ ...sectionLabelSx, fontSize: '1rem', mb: 3 }}>Barang Purchase Order</Typography>
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
                <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Gudang</TableCell>
                <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Produk</TableCell>
                <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Kuantiti</TableCell>
                <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Harga</TableCell>
                <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Modal Baru</TableCell>
                <TableCell align='right' sx={{ ...sectionLabelSx, borderColor: colors.border }}>
                  Jumlah
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.listProducts?.map((item, index) => (
                <TableRow key={index} sx={{ '&:last-of-type td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border }}>
                    {item?.warehouseName}
                  </TableCell>
                  <TableCell sx={{ borderColor: colors.border }}>
                    <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                      {item?.productName}
                    </Typography>
                    <Typography sx={{ ...mutedSx, fontSize: '0.75rem', mt: 0.5, display: 'block' }}>
                      Rak: {item?.rackName || '-'}
                    </Typography>
                    <Typography sx={{ ...mutedSx, fontSize: '0.75rem', display: 'block' }}>
                      Unit: {item?.unitName || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border }}>
                    {item?.quantity ?? ''}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border, whiteSpace: 'nowrap' }}
                  >
                    Rp {priceFormat(item?.price)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border }}>
                    {item?.isNewModal ? 'Ya' : 'Tidak'}
                  </TableCell>
                  <TableCell
                    align='right'
                    sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground, borderColor: colors.border, whiteSpace: 'nowrap' }}
                  >
                    Rp {priceFormat(item?.subTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {data?.listBarterProducts?.length > 0 && (
          <>
            <Typography sx={{ ...sectionLabelSx, fontSize: '1rem', mt: 6, mb: 3 }}>Barang Barter</Typography>
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
                    <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Gudang</TableCell>
                    <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Produk</TableCell>
                    <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Kuantiti</TableCell>
                    <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Harga</TableCell>
                    <TableCell sx={{ ...sectionLabelSx, borderColor: colors.border }}>Modal</TableCell>
                    <TableCell align='right' sx={{ ...sectionLabelSx, borderColor: colors.border }}>
                      Jumlah
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.listBarterProducts?.map((item, index) => (
                    <TableRow key={index} sx={{ '&:last-of-type td': { borderBottom: 0 } }}>
                      <TableCell sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border }}>
                        {item?.warehouseName}
                      </TableCell>
                      <TableCell sx={{ borderColor: colors.border }}>
                        <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                          {item?.productName}
                        </Typography>
                        <Typography sx={{ ...mutedSx, fontSize: '0.75rem', mt: 0.5, display: 'block' }}>
                          Rak: {item?.rackName || '-'}
                        </Typography>
                        <Typography sx={{ ...mutedSx, fontSize: '0.75rem', display: 'block' }}>
                          Unit: {item?.unitName || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border }}>
                        {item?.quantity ?? ''}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border, whiteSpace: 'nowrap' }}
                      >
                        Rp {priceFormat(item?.price)}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: '0.875rem', color: colors.foreground, borderColor: colors.border, whiteSpace: 'nowrap' }}
                      >
                        Rp {priceFormat(item?.modal)}
                      </TableCell>
                      <TableCell
                        align='right'
                        sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground, borderColor: colors.border, whiteSpace: 'nowrap' }}
                      >
                        Rp {priceFormat(item?.subTotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>

      <Box sx={{ px: 5 }}>
        <Divider sx={{ borderColor: colors.border }} />
      </Box>

      {/* Notes + Totals */}
      <CardContent sx={{ p: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ ...sectionLabelSx, fontSize: '1rem', mb: 2 }}>Catatan:</Typography>
            <Typography sx={mutedSx}>{data?.notes || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Typography sx={mutedSx}>Total Purchase Order</Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground }}>
                Rp {priceFormat(data?.grandTotalVendor)}
              </Typography>
            </Box>
            {data?.listBarterProducts?.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography sx={mutedSx}>Total Barter</Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground }}>
                  - Rp {priceFormat(data?.grandTotalBarter)}
                </Typography>
              </Box>
            )}
            <Divider sx={{ borderColor: colors.border, borderBottomWidth: 2, my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Typography sx={{ ...sectionLabelSx, fontSize: '1rem' }}>Grand Total</Typography>
              <Typography
                sx={{
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  color: data?.grandTotal < 0 ? colors.destructive : colors.foreground
                }}
              >
                Rp {priceFormat(data?.grandTotal)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Box sx={{ px: 5 }}>
        <Divider sx={{ borderColor: colors.border }} />
      </Box>

      {/* Payment instruction */}
      <CardContent sx={{ px: 5, py: 4 }}>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground, mb: 2 }}>
          {data?.grandTotal > 0
            ? `${companyInfo?.ptName} harus melakukan pembayaran sebesar Rp ${priceFormat(data?.grandTotal)}`
            : `Vendor ${data?.vendor?.name?.toUpperCase() || ''} harus melakukan pembayaran sebesar Rp ${priceFormat(Math.abs(data?.grandTotal))}`}
        </Typography>
      </CardContent>

      <Box sx={{ px: 5 }}>
        <Divider sx={{ borderColor: colors.border }} />
      </Box>

      {/* Signature */}
      <CardContent sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap' }}>
          <SignatureBlock label='Pengirim' />
          <SignatureBlock label='Dengan Hormat' name={companyInfo?.ownerName} title={companyInfo?.ownerTitle} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default DetailPagePurchaseOrder
