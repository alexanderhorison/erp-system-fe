// ** React Import
import { forwardRef, useState } from 'react'

// ** MUI Import
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Autocomplete from '@mui/material/Autocomplete'
import Typography from '@mui/material/Typography'

// ** Icon Import
import Icon from 'src/@core/components/icon'

// ** Design Tokens
import { colors, radii } from 'src/configs/designTokens'

/**
 * `footerAction` ({ label, onClick }) pins an action row under the option list,
 * e.g. "Tambah Customer Baru". The list scrolls above it; the footer stays put.
 */
const CustomAutocomplete = forwardRef(({ footerAction, ...props }, ref) => {
  const [open, setOpen] = useState(false)

  const footerProps = footerAction
    ? {
        open,
        onOpen: () => setOpen(true),
        onClose: () => setOpen(false),
        PaperComponent: ({ children, ...paperProps }) => (
          <Paper {...paperProps} className='custom-autocomplete-paper'>
            {children}
            <Divider sx={{ borderColor: colors.border }} />
            <Box
              role='button'
              tabIndex={0}
              // Keep focus in the input so the popup isn't closed by blur before the click lands.
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                setOpen(false)
                footerAction.onClick()
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setOpen(false)
                  footerAction.onClick()
                }
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mx: 2,
                my: 1,
                px: 3,
                py: 2,
                cursor: 'pointer',
                borderRadius: `${radii['3xl']}px`,
                color: colors.foreground,
                '&:hover, &:focus-visible': { backgroundColor: 'action.hover', outline: 'none' }
              }}
            >
              <Icon icon='tabler:plus' fontSize='1rem' />
              <Typography sx={{ fontSize: '0.875rem', color: 'inherit' }}>{footerAction.label}</Typography>
            </Box>
          </Paper>
        )
      }
    : {
        PaperComponent: props => <Paper {...props} className='custom-autocomplete-paper' />
      }

  return (
    // eslint-disable-next-line lines-around-comment
    // @ts-expect-error - AutocompleteProps is not compatible with PaperProps
    <Autocomplete {...props} {...footerProps} ref={ref} />
  )
})

export default CustomAutocomplete
