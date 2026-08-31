// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

/**
 * ConfirmDialog
 * -------------------------------------------------------------------------------------
 * Confirmation prompt for destructive actions. Shares the `AppModal` shell so
 * confirmations read as part of the same dialog family, with the confirm action
 * tinted using the destructive color.
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  description,
  itemName,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  confirmIcon = 'tabler:trash',
  destructive = true,
  loading = false,
  loadingLabel = 'Deleting...'
}) {
  const accent = destructive ? colors.destructive : undefined

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='xs'
      onClose={onClose}
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
          {title}
        </Typography>
        <IconButton onClick={onClose} size='small' aria-label='close' sx={{ color: colors.foreground, p: 1 }}>
          <Icon icon='tabler:x' fontSize='1rem' />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ px: 5, py: 4 }}>
        <Typography sx={{ fontSize: '0.875rem', lineHeight: '20px', color: colors.mutedForeground }}>
          {description || (
            <>
              Are you sure you want to delete
              {itemName ? (
                <Box component='span' sx={{ fontWeight: 600, color: colors.foreground }}>
                  {` ${itemName}`}
                </Box>
              ) : (
                ' this item'
              )}
              ? This action cannot be undone.
            </>
          )}
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
        <Button
          variant='outlined'
          color='secondary'
          onClick={onClose}
          disabled={loading}
          startIcon={<Icon icon='tabler:x' fontSize='1rem' />}
          sx={{
            color: colors.foreground,
            borderColor: colors.border3,
            boxShadow: shadows.xs,
            '&:hover': { borderColor: colors.border3 }
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          variant='contained'
          onClick={onConfirm}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={16} sx={{ color: 'inherit' }} /> : <Icon icon={confirmIcon} fontSize='1rem' />
          }
          sx={
            accent
              ? {
                  backgroundColor: accent,
                  '&:hover': { backgroundColor: accent, filter: 'brightness(0.92)' }
                }
              : undefined
          }
        >
          {loading ? loadingLabel : confirmLabel}
        </Button>
      </Box>
    </Dialog>
  )
}
