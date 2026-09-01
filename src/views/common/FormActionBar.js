// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks & Config
import { useSettings } from 'src/@core/hooks/useSettings'
import themeConfig from 'src/configs/themeConfig'

// ** Design Tokens
import { colors, shadows } from 'src/configs/designTokens'

// ** Height of the bar (py: 3 => 24px + a 38px button), used to reserve space
// beneath the form for the pinned copy.
const BAR_HEIGHT = 62

/**
 * FormActionBar
 * -------------------------------------------------------------------------------------
 * The action footer for full-page forms (Figma: add/create pages) — Cancel on
 * the left of Submit, right-aligned on a bar pinned to the bottom of the
 * viewport so Submit is reachable without scrolling a long form.
 *
 * The window is the scroll container, so the bar is `position: fixed` and its
 * left edge is offset by the sidebar's current width — which the settings
 * context tracks through the collapse toggle, and which collapses to 0 once the
 * navigation becomes a temporary drawer below `lg`.
 *
 * The bar is taken out of flow, so a spacer of equal height renders in its place
 * to keep the form's last row clear of it.
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
  showCancel = true,
  children = null
}) {
  const { settings } = useSettings()
  const { navCollapsed } = settings

  // ** Below `lg` the navigation is a temporary drawer over the content, so the
  // bar spans the full width instead of clearing a permanent sidebar.
  const navPermanent = useMediaQuery(theme => theme.breakpoints.up('lg'))
  const navWidth = navCollapsed ? themeConfig.collapsedNavigationSize : themeConfig.navigationSize

  return (
    <>
      {/* Reserves the space the pinned bar occupies, so the form's last row is
          never hidden behind it. */}
      {sticky && <Box aria-hidden sx={{ height: BAR_HEIGHT, mt: 5 }} />}
      <Box
        sx={{
          px: 4,
          py: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 4,
          flexWrap: 'wrap',
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.background,
          ...(sticky
            ? {
                // ** Anchored to `MainContentWrapper`, pinned to the window's
                // foot so the actions need no scrolling to reach.
                position: 'fixed',
                bottom: 0,
                left: navPermanent ? `${navWidth}px` : 0,
                right: 0,
                zIndex: 11,
                boxShadow: shadows.sm,
                transition: 'left .25s ease-in-out'
              }
            : {
                // ** Negative margins pull the bar out to the content column's
                // edges so it reads as a footer rather than an inset card.
                mt: 5,
                mx: -4,
                mb: -4
              })
        }}
      >
        {children}
        {/* Detail pages already carry a back arrow in `PageHeader`, so they opt
            out of a second way back. */}
        {showCancel && (
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
        )}
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
    </>
  )
}
