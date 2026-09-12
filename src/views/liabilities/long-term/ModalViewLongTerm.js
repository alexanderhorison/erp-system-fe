// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Helpers
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { returnFormatDateDay, returnFormatMonthYear } from 'src/helpers/formatDate'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'
import { infoCardSx } from 'src/@core/components/common/InfoCardSx'

const fieldRows = [
  { name: 'shareHolderLoans', label: 'Pinjaman Kepada Pemegang Saham' },
  { name: 'longTermBankLoans', label: 'Hutang Bank Jangka Panjang' },
  { name: 'otherLongtermLiabilities', label: 'Kewajiban Jangka Panjang Lainnya' }
]

/**
 * ModalViewLongTerm
 * -------------------------------------------------------------------------------------
 * Read-only detail dialog for a monthly long-term-liability entry (Figma:
 * "Detail Liabilitas Jangka Panjang") — same custom token shell and key/value
 * card layout as `ModalViewCurrentAsset`/`ModalViewShortTerm`.
 */
export default function ModalViewLongTerm({ open, setOpen, selectedRow }) {
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
          Detail Liabilitas Jangka Panjang
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
              {returnFormatMonthYear(selectedRow.date)}
            </Typography>
          </Box>

          <Box sx={{ px: 4, py: 2 }}>
            {fieldRows.map(fieldItem => (
              <Box
                key={fieldItem.name}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}
              >
                <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>{fieldItem.label}</Typography>
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
                {priceFormatWIthCurrency(selectedRow.totalLongtermLiabilities, false)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <Box sx={infoCardSx}>
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
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <Box sx={infoCardSx}>
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
          </Grid>
        </Grid>
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
