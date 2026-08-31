// ** React Import
import { forwardRef } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'

const TextFieldStyled = styled(TextField)(({ theme }) => ({
  alignItems: 'flex-start',
  '& .MuiInputLabel-root': {
    transform: 'none',
    lineHeight: 1.154,
    position: 'relative',
    width: "100%",
    marginBottom: theme.spacing(1),
    fontSize: theme.typography.body2.fontSize,
    color: `${theme.palette.text.primary} !important`
  },
  // ** This renders MUI's `filled` variant, which paints its own background,
  // rounds only its TOP corners and draws an underline via ::before/::after.
  // Layered under the pill border below, that showed up as a second, squared
  // box offset behind the field. `.MuiFilledInput-root` is targeted explicitly
  // because the theme's `MuiFilledInput` override (src/@core/theme/overrides/
  // input.js) matches `.MuiInputBase-root` with equal specificity and would
  // otherwise win on source order.
  '& .MuiFilledInput-root': {
    backgroundColor: 'transparent',
    borderRadius: 9999,
    '&:hover:not(.Mui-disabled)': {
      backgroundColor: 'transparent'
    },
    '&.Mui-focused': {
      backgroundColor: 'transparent'
    },
    '&:before, &:after': {
      display: 'none'
    }
  },
  '& .MuiInputBase-root': {
    // ** Pill-shaped fields (Figma: rounded-full). Multiline inputs keep a
    // softened corner instead, since a full radius distorts a tall textarea.
    borderRadius: 9999,
    width: "100%",
    backgroundColor: 'transparent !important',
    border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`,
    transition: theme.transitions.create(['border-color', 'box-shadow'], {
      duration: theme.transitions.duration.shorter
    }),
    '&:not(.Mui-focused):not(.Mui-disabled):not(.Mui-error):hover': {
      borderColor: `rgba(${theme.palette.customColors.main}, 0.28)`
    },
    '&:before, &:after': {
      display: 'none'
    },
    '&.MuiInputBase-sizeSmall': {
      borderRadius: 9999
    },
    '&.MuiInputBase-multiline': {
      borderRadius: 18
    },
    '&.Mui-error': {
      borderColor: theme.palette.error.main
    },
    '&.Mui-focused': {
      boxShadow: theme.shadows[2],
      '& .MuiInputBase-input:not(.MuiInputBase-readOnly):not([readonly])::placeholder': {
        transform: 'translateX(4px)'
      },
      '&.MuiInputBase-colorPrimary': {
        borderColor: theme.palette.primary.main
      },
      '&.MuiInputBase-colorSecondary': {
        borderColor: theme.palette.secondary.main
      },
      '&.MuiInputBase-colorInfo': {
        borderColor: theme.palette.info.main
      },
      '&.MuiInputBase-colorSuccess': {
        borderColor: theme.palette.success.main
      },
      '&.MuiInputBase-colorWarning': {
        borderColor: theme.palette.warning.main
      },
      '&.MuiInputBase-colorError': {
        borderColor: theme.palette.error.main
      },
      '&.Mui-error': {
        borderColor: theme.palette.error.main
      }
    },
    '&.Mui-disabled': {
      backgroundColor: `${theme.palette.action.selected} !important`
    },
    '& .MuiInputAdornment-root': {
      marginTop: '0 !important'
    }
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.secondary,
    // ** Chrome/Safari paint their own autofill background on the <input>
    // itself. It is clipped to the input box rather than the pill wrapper, so a
    // filled field showed a squared blue block inside the rounded border. The
    // colour cannot be unset, but an inset shadow large enough to cover the box
    // paints over it, and a long transition keeps it from flashing back.
    // An inset shadow is the only way to mask it: `background-color` itself is
    // ignored on an autofilled input. It is painted in the surface colour so the
    // field matches the card behind it, and the absurd transition delay stops
    // the browser re-applying its colour on focus/blur.
    '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active': {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
      WebkitTextFillColor: theme.palette.text.secondary,
      caretColor: theme.palette.text.secondary,
      borderRadius: 'inherit',
      transition: 'background-color 100000s ease-in-out 0s'
    },
    '&:not(textarea)': {
      padding: '15.5px 13px'
    },
    '&:not(textarea).MuiInputBase-inputSizeSmall': {
      padding: '7.5px 13px'
    },
    '&:not(.MuiInputBase-readOnly):not([readonly])::placeholder': {
      transition: theme.transitions.create(['opacity', 'transform'], { duration: theme.transitions.duration.shorter })
    },

    // ** For Autocomplete
    '&.MuiInputBase-inputAdornedStart:not(.MuiAutocomplete-input)': {
      paddingLeft: 0
    },
    '&.MuiInputBase-inputAdornedEnd:not(.MuiAutocomplete-input)': {
      paddingRight: 0
    }
  },
  '& .MuiFormHelperText-root': {
    lineHeight: 1.154,
    margin: theme.spacing(1, 0, 0),
    color: theme.palette.text.secondary,
    fontSize: theme.typography.body2.fontSize,
    '&.Mui-error': {
      color: theme.palette.error.main
    }
  },

  // ** For Select
  '& .MuiSelect-select:focus, & .MuiNativeSelect-select:focus': {
    backgroundColor: 'transparent'
  },
  '& .MuiSelect-filled .MuiChip-root': {
    height: 22
  },

  // ** For Autocomplete
  '& .MuiAutocomplete-input': {
    paddingLeft: '6px !important',
    paddingTop: '7.5px !important',
    paddingBottom: '7.5px !important',
    '&.MuiInputBase-inputSizeSmall': {
      paddingLeft: '6px !important',
      paddingTop: '2.5px !important',
      paddingBottom: '2.5px !important'
    }
  },
  '& .MuiAutocomplete-inputRoot': {
    paddingTop: '8px !important',
    paddingLeft: '8px !important',
    paddingBottom: '8px !important',
    '&:not(.MuiInputBase-sizeSmall).MuiInputBase-adornedStart': {
      paddingLeft: '13px !important'
    },
    '&.MuiInputBase-sizeSmall': {
      paddingTop: '5px !important',
      paddingLeft: '5px !important',
      paddingBottom: '5px !important',
      '& .MuiAutocomplete-tag': {
        margin: 2,
        height: 22
      }
    }
  },

  // ** For Textarea
  '& .MuiInputBase-multiline': {
    padding: '15.25px 13px',
    '&.MuiInputBase-sizeSmall': {
      padding: '7.25px 13px'
    },
    '& textarea.MuiInputBase-inputSizeSmall:placeholder-shown': {
      overflowX: 'hidden'
    }
  },

  // ** For Date Picker
  '& + .react-datepicker__close-icon': {
    top: 11,
    '&:after': {
      fontSize: '1.6rem !important'
    }
  }
}))

const CustomTextField = forwardRef((props, ref) => {
  // ** Props
  const { size = 'small', InputLabelProps, ...rest } = props

  return (
    <TextFieldStyled
      size={size}
      inputRef={ref}
      {...rest}
      variant='filled'
      InputLabelProps={{ ...InputLabelProps, shrink: true }}
    />
  )
})

export default CustomTextField
