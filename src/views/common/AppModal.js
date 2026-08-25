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
 * AppModal
 * -------------------------------------------------------------------------------------
 * The shared dialog shell for add/edit forms (Figma: "Dialog").
 *
 * Layout: a header with a left-aligned title and close button, a scrollable body,
 * and a right-aligned footer with Cancel/Save actions.
 *
 * Keeps the same props as the previous `BaseModal` so existing call sites do not
 * need their logic rewired.
 */
export default function AppModal({
  open,
  onClose,
  onSubmit,
  title,
  size = 'sm',
  children,
  showActions = true,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  submitIcon = 'tabler:device-floppy',
  loading = false,
  loadingPage = false
}) {
  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth={size}
      scroll='paper'
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
      <Box component='form' onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* Header */}
        <Box
          sx={{
            p: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: 600,
              lineHeight: '24px',
              color: colors.foreground
            }}
          >
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            size='small'
            aria-label='close'
            sx={{ color: colors.foreground, p: 1 }}
          >
            <Icon icon='tabler:x' fontSize='1rem' />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ px: 5, py: 4, overflowY: 'auto' }}>
          {loadingPage ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            children
          )}
        </Box>

        {/* Footer */}
        {showActions && (
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
              type='submit'
              variant='contained'
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={16} sx={{ color: 'inherit' }} />
                ) : (
                  <Icon icon={submitIcon} fontSize='1rem' />
                )
              }
            >
              {loading ? 'Saving...' : submitLabel}
            </Button>
          </Box>
        )}
      </Box>
    </Dialog>
  )
}
