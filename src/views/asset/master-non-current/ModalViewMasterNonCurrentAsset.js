import { addMonths } from 'date-fns'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Data
import { nonCurrentAssetsType } from 'src/data/nonCurrentAssetsType'

// ** Helpers
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { returnFormatMonthYear } from 'src/helpers/formatDate'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

/**
 * ModalViewMasterNonCurrentAsset
 * -------------------------------------------------------------------------------------
 * Read-only detail dialog for a master non-current (fixed) asset (Figma: "Detail
 * Aset Tidak Lancar Bulanan") — same custom token shell and key/value layout as
 * `ModalViewCurrentAsset`: a gray asset-name header, Jenis/Nilai/Waktu Depresiasi/
 * Waktu Akuisisi rows, then a Catatan box below.
 *
 * "Waktu Depresiasi" combines the stored month count with a derived end date
 * (acquisition + months) purely for display — no new field, no logic change.
 */
export default function ModalViewMasterNonCurrentAsset({ open, setOpen, selectedRow }) {
  const handleClose = () => setOpen(false)

  if (!selectedRow) return null

  const acquisitionDate = selectedRow.acquisitionDate ? new Date(selectedRow.acquisitionDate) : null
  const depreciationEndDate =
    acquisitionDate && selectedRow.depreciationMonths
      ? addMonths(acquisitionDate, Number(selectedRow.depreciationMonths))
      : null

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
              {selectedRow.name}
            </Typography>
          </Box>

          <Box sx={{ px: 4, py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
              <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>Jenis Aset</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                {nonCurrentAssetsType.find(type => type.value === selectedRow.assetType)?.key || 'Unknown'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
              <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>Nilai Aset</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                {priceFormatWIthCurrency(selectedRow.assetValue, false)}
              </Typography>
            </Box>

            {selectedRow.depreciationMonths ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>Waktu Depresiasi</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                  {selectedRow.depreciationMonths} Bulan
                  {depreciationEndDate && ` (${returnFormatMonthYear(depreciationEndDate)})`}
                </Typography>
              </Box>
            ) : null}

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
              <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>Waktu Akuisisi</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                {returnFormatMonthYear(selectedRow.acquisitionDate)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ borderRadius: `${radii.lg}px`, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
          <Box sx={{ px: 4, py: 3, backgroundColor: stone[100] }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.foreground }}>
              Catatan
            </Typography>
          </Box>
          <Box sx={{ px: 4, py: 3 }}>
            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
              {selectedRow.notes || '-'}
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
