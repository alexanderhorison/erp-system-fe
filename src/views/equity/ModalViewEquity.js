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
import { returnFormatMonthYear } from 'src/helpers/formatDate'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

// ** Shared Components
import HeaderedCard from 'src/views/common/HeaderedCard'

const fieldRows = [
  { name: 'shareCapital', label: 'Modal Saham' },
  { name: 'retainedEarningsPreviousYear', label: 'Saldo Laba Tahun Lalu' },
  { name: 'retainedEarningsCurrentYear', label: 'Saldo Laba Tahun Berjalan' },
  { name: 'retainedEarningsThisMonth', label: 'Saldo Laba Bulan Ini' }
]

/**
 * ModalViewEquity
 * -------------------------------------------------------------------------------------
 * Read-only detail dialog for a monthly equity entry (Figma: "Detail Ekuitas")
 * — same custom token shell and key/value card layout as
 * `ModalViewCurrentAsset`/`ModalViewLongTerm`/`ModalViewShortTerm`.
 */
export default function ModalViewEquity({ open, setOpen, selectedRow }) {
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
          Detail Ekuitas
        </Typography>
        <IconButton onClick={handleClose} size='small' aria-label='close' sx={{ color: colors.foreground, p: 1 }}>
          <Icon icon='tabler:x' fontSize='1rem' />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ px: 5, py: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <HeaderedCard title={returnFormatMonthYear(selectedRow.date)}>
          {fieldRows.map(fieldItem => (
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
              {priceFormatWIthCurrency(selectedRow.totalEquity, false)}
            </Typography>
          </Box>
        </HeaderedCard>

        {selectedRow.notes && (
          <HeaderedCard title='Catatan'>
            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
              {selectedRow.notes}
            </Typography>
          </HeaderedCard>
        )}
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
