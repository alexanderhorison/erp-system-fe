// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Shared Components
import StatusChip from 'src/views/common/StatusChip'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

const printerTypeLabels = {
  PRINTER_POS: 'Printer POS',
  PRINTER_DOT_MATRIX: 'Printer Dot Matrix',
  PRINTER_INJECT: 'Printer Inject'
}

/**
 * ModalViewPrinter
 * -------------------------------------------------------------------------------------
 * Read-only detail dialog for a printer (Figma: "Detail Printer") — same custom
 * token shell and key/value card layout as the other view modals this session
 * (`ModalViewCurrentAsset`, `ModalViewEquity`, ...).
 */
export default function ModalViewPrinter({ open, setOpen, selectedRow, isOnline }) {
  const handleClose = () => setOpen(false)

  if (!selectedRow) return null

  const fieldRows = [
    { label: 'Nama Printer', value: selectedRow.value },
    { label: 'Alamat IP', value: selectedRow.value_json?.ip || selectedRow.value_json?.printerHost },
    { label: 'Tipe Printer', value: printerTypeLabels[selectedRow.value_json?.printerType] || selectedRow.key }
  ]

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
          Detail Printer
        </Typography>
        <IconButton onClick={handleClose} size='small' aria-label='close' sx={{ color: colors.foreground, p: 1 }}>
          <Icon icon='tabler:x' fontSize='1rem' />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ px: 5, py: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
          <Box
            sx={{
              px: 4,
              py: 3,
              backgroundColor: stone[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
              {selectedRow.value}
            </Typography>
            <StatusChip isActive={isOnline} activeLabel='Online' inactiveLabel='Offline' />
          </Box>

          <Box sx={{ px: 4, py: 2 }}>
            {fieldRows.map(fieldItem => (
              <Box
                key={fieldItem.label}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}
              >
                <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>
                  {fieldItem.label}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                  {fieldItem.value || '-'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {selectedRow.description && (
          <Box sx={{ borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
            <Box sx={{ px: 4, py: 3, backgroundColor: stone[100] }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.foreground }}>
                Deskripsi
              </Typography>
            </Box>
            <Box sx={{ px: 4, py: 3 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
                {selectedRow.description}
              </Typography>
            </Box>
          </Box>
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
