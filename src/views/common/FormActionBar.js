// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Design Tokens
import { colors, shadows } from 'src/configs/designTokens'

/**
 * FormActionBar
 * -------------------------------------------------------------------------------------
 * The action footer for full-page forms (Figma: add/create pages) — Cancel on
 * the left of Submit, right-aligned on a bar that stays visible while a long
 * form is scrolled.
 *
 * `position: sticky` rather than `fixed`: the bar is a child of the page content
 * column, so it spans exactly that column and needs no offset for the sidebar,
 * its collapsed state, or the mobile drawer.
 *
 * Pair with `type='submit'` inside a `<form>` (the default), or pass `onSubmit`
 * for a form that submits through a handler instead.
 */
export default function FormActionBar({
  onCancel,
  onSubmit,
  loading = false,
  disabled = false,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  submitIcon = 'tabler:send',
  loadingLabel = 'Submitting...',
  sticky = true,
  children = null
}) {
  return (
    <Box
      sx={{
        // ** Negative margins pull the bar out to the content column's edges so
        // it reads as a footer rather than an inset card.
        mt: 5,
        mx: -4,
        mb: -4,
        px: 4,
        py: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
        flexWrap: 'wrap',
        borderTop: `1px solid ${colors.border}`,
        backgroundColor: colors.background,
        ...(sticky && {
          position: 'sticky',
          bottom: 0,
          zIndex: 5,
          boxShadow: shadows.sm
        })
      }}
    >
      {children}
      <Button
        variant='outlined'
        color='secondary'
        onClick={onCancel}
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
        disabled={loading || disabled}
        {...(onSubmit ? { onClick: onSubmit } : { type: 'submit' })}
        startIcon={
          loading ? (
            <CircularProgress size={16} sx={{ color: 'inherit' }} />
          ) : (
            <Icon icon={submitIcon} fontSize='1rem' />
          )
        }
      >
        {loading ? loadingLabel : submitLabel}
      </Button>
    </Box>
  )
}
