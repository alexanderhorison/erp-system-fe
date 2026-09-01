// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Shared Components
import { Status } from 'src/@core/components/common'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

/** One label/value pair in the summary card. */
const BoxData = ({ title, value, children }) => (
  <Grid item xs={6} sm={4} md={3}>
    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground }}>
      {title}
    </Typography>
    {children || (
      <Typography sx={{ fontSize: '0.875rem', lineHeight: '20px', color: colors.mutedForeground, mt: 0.5 }}>
        {value || '-'}
      </Typography>
    )}
  </Grid>
)

/**
 * HeaderDetailStockOpname
 * -------------------------------------------------------------------------------------
 * The summary card above the detail table (Figma: "Detail Stock Opname").
 *
 * The avatar-and-icon layout is dropped in favour of a plain label/value grid,
 * which is what the rest of the revamped detail pages use.
 */
export default function HeaderDetailStockOpname(props) {
  const title = {
    APPROVED: 'Diterima Oleh',
    REJECTED: 'Ditolak Oleh',
    PENDING: 'Stock Opname Pending',
    CLOSED: 'Stock Opname Closed',
    DRAFT: 'Stock Opname Draft'
  }

  return (
    <Grid item xs={12}>
      <Card
        elevation={0}
        sx={{
          borderRadius: `${radii.lg}px`,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.xs
        }}
      >
        <CardContent>
          <Grid container rowSpacing={4} columnSpacing={4}>
            <BoxData title='Nama Gudang' value={props?.warehouseName} />
            <BoxData title='Tanggal Stock Opname' value={props?.createdAt} />
            <BoxData title='Kode' value={props?.code} />
            <BoxData title='Dibuat Oleh' value={props?.creatorName} />
            {props?.status !== 'DRAFT' && <BoxData title={title[props?.status]} value={props?.updaterName} />}
            <BoxData title='Status'>
              <Box sx={{ mt: 1 }}>
                <Status status={props?.status} />
              </Box>
            </BoxData>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}
