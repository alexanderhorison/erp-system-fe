// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Design Tokens
import { radii } from 'src/configs/designTokens'

const Autocomplete = skin => {
  const boxShadow = theme => {
    if (skin === 'bordered') {
      return theme.shadows[0]
    } else if (theme.palette.mode === 'light') {
      return theme.shadows[4]
    } else return '0px 3px 14px 0px rgba(15, 20, 34, 0.38)'
  }

  return {
    MuiAutocomplete: {
      styleOverrides: {
        popper: ({ theme }) => ({
          '.MuiPaper-root': {
            borderRadius: `${radii['3xl']}px`,
            boxShadow: boxShadow(theme),
            ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` }),
            '& .MuiAutocomplete-option .MuiListItemButton-root:hover': {
              backgroundColor: 'transparent'
            },
            '&.custom-autocomplete-paper': {
              ...theme.typography.body1,
              '& .MuiAutocomplete-option': {
                // ** Options are inset from the paper edge and rounded to match it.
                margin: theme.spacing(0, 2, 1),
                borderRadius: `${radii['3xl']}px`,
                '&:last-child': {
                  marginBottom: 0
                },
                '&.Mui-focused': {
                  color: theme.palette.primary.main,
                  backgroundColor: hexToRGBA(theme.palette.primary.main, 0.08),
                  '& .MuiTypography-root, & svg': {
                    color: 'inherit'
                  }
                },
                '&[aria-selected="true"]': {
                  color: theme.palette.common.white,
                  backgroundColor: theme.palette.primary.main,
                  '& .MuiTypography-root, & svg': {
                    color: 'inherit'
                  }
                },
                '& .MuiCheckbox-root.Mui-checked path:first-of-type': {
                  fill: theme.palette.common.white
                },
                '& .MuiCheckbox-root.Mui-checked path:last-of-type': {
                  fill: theme.palette.primary.main,
                  stroke: theme.palette.primary.main
                }
              }
            }
          }
        }),
        inputRoot: {
          '& .MuiAutocomplete-tagSizeSmall': {
            height: 22
          }
        }
      }
    }
  }
}

export default Autocomplete
