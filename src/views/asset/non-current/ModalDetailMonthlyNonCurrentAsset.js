// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Helpers
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { returnFormatDateDay, returnFormatMonthYear } from 'src/helpers/formatDate'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

const assetRows = [
  { name: 'vehicleValue', label: 'Total Aset Kendaraan' },
  { name: 'buildingValue', label: 'Total Aset Bangunan' },
  { name: 'landValue', label: 'Tanah' },
  { name: 'longTermInvestment', label: 'Investasi Jangka Panjang' },
  { name: 'othersValue', label: 'Lainnya' }
]

const depreciationRows = [
  { name: 'previousYearDepreciation', label: 'Depresiasi Tahun Lalu' },
  { name: 'currentYearDepreciation', label: 'Depresiasi Tahun Ini' }
]

/**
 * ModalDetailMonthlyNonCurrentAsset
 * -------------------------------------------------------------------------------------
 * Read-only detail dialog for a monthly non-current-asset entry (Figma: "Detail
 * Aset Tidak Lancar Bulanan") — same custom token shell and key/value card layout
 * as `ModalViewCurrentAsset`/`ModalViewMasterNonCurrentAsset`: an "Aset" card
 * ending in a bold Grand Total, a "Depresiasi" card, then "Dibuat pada".
 */
export default function ModalDetailMonthlyNonCurrentAsset({ open, setOpen, selectedRow }) {
  const handleClose = () => setOpen(false)

  if (!selectedRow) return null

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='sm'
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: `${radii['3xl']}px`,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.lg,
          backgroundColor: colors.background
        }
      }}
    >
      {/* Header */}
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: '24px', color: colors.foreground }}>
          Detail Aset Tidak Lancar Bulanan
        </Typography>
        <IconButton onClick={handleClose} size='small' aria-label='close' sx={{ color: colors.foreground, p: 1 }}>
          <Icon icon='tabler:x' fontSize='1rem' />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ px: 5, py: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
          <Box sx={{ px: 4, py: 3, backgroundColor: stone[100] }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
              Aset — {returnFormatMonthYear(selectedRow.date)}
            </Typography>
          </Box>

          <Box sx={{ px: 4, py: 2 }}>
            {assetRows.map(fieldItem => (
              <Box
                key={fieldItem.name}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}
              >
                <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>
                  {fieldItem.label}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                  {priceFormatWIthCurrency(selectedRow[fieldItem.name], false)}
                </Typography>
              </Box>
            ))}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: 3,
                borderTop: `1px solid ${colors.border}`
              }}
            >
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground }}>
                Grand Total
              </Typography>
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.foreground }}>
                {priceFormatWIthCurrency(selectedRow.totalValue, false)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
          <Box sx={{ px: 4, py: 3, backgroundColor: stone[100] }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
              Depresiasi
            </Typography>
          </Box>

          <Box sx={{ px: 4, py: 2 }}>
            {depreciationRows.map(fieldItem => (
              <Box
                key={fieldItem.name}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}
              >
                <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>
                  {fieldItem.label}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                  {priceFormatWIthCurrency(selectedRow[fieldItem.name], false)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
          <Box sx={{ px: 4, py: 3, backgroundColor: stone[100] }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.foreground }}>
              Dibuat pada
            </Typography>
          </Box>
          <Box sx={{ px: 4, py: 3 }}>
            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
              {returnFormatDateDay(selectedRow.createdAt)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button
          variant='outlined'
          color='secondary'
          onClick={handleClose}
          startIcon={<Icon icon='tabler:x' fontSize='1rem' />}
          sx={{
            color: colors.foreground,
            borderColor: colors.border3,
            boxShadow: shadows.xs,
            '&:hover': { borderColor: colors.border3 }
          }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  )
}
