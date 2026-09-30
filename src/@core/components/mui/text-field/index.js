// ** React Import
import { Children, forwardRef, isValidElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

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

// ** Text of the <MenuItem> a `select` field currently points at.
const selectedOptionLabel = (children, value) => {
  const values = Array.isArray(value) ? value : [value]
  const labels = []

  Children.forEach(children, child => {
    if (isValidElement(child) && values.includes(child.props.value)) labels.push(child.props.children)
  })

  return labels.length ? labels.map((label, index) => (index ? [', ', label] : label)) : null
}

// ** Only plain "Rp" / unit prefixes and suffixes carry meaning in the text view.
// ** Autocomplete's own end adornment (clear / popup buttons) is not an InputAdornment.
const adornmentContent = adornment => {
  if (isValidElement(adornment) && adornment.type === InputAdornment) return adornment.props.children

  return null
}

/**
 * A disabled field is not an input the user can act on, so it renders as a
 * label over plain text instead of a greyed-out pill. Pass `keepDisabledField`
 * for the rare disabled value that should keep the field treatment (e.g. a
 * highlighted, computed Sub Total).
 */
const DisabledText = ({ label, value, select, children, InputProps, inputProps, multiline, error, helperText, sx }) => {
  const raw = value ?? inputProps?.value
  const isEmpty = raw === undefined || raw === null || raw === '' || (Array.isArray(raw) && raw.length === 0)
  const text = select ? selectedOptionLabel(children, raw) : isEmpty ? null : String(raw)
  const prefix = adornmentContent(InputProps?.startAdornment)
  const suffix = adornmentContent(InputProps?.endAdornment)
  const chips = Array.isArray(InputProps?.startAdornment) ? InputProps.startAdornment : null

  return (
    <Box sx={[{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {label && (
        <Typography sx={{ width: '100%', mb: 1, lineHeight: 1.154, fontSize: 'body2.fontSize', color: 'text.primary' }}>
          {label}
        </Typography>
      )}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: multiline ? 'flex-start' : 'center',
          flexWrap: 'wrap',
          gap: 1,
          minHeight: multiline ? 0 : 40,
          py: multiline ? 1 : 0
        }}
      >
        {chips}
        <Typography
          sx={{
            fontSize: 'body2.fontSize',
            lineHeight: '20px',
            color: colors.mutedForeground,
            whiteSpace: multiline ? 'pre-wrap' : 'normal',
            overflowWrap: 'anywhere'
          }}
        >
          {prefix && `${prefix} `}
          {text ?? (chips ? null : '-')}
          {suffix && ` ${suffix}`}
        </Typography>
      </Box>
      {error && helperText && (
        <Typography sx={{ mt: 1, lineHeight: 1.154, fontSize: 'body2.fontSize', color: 'error.main' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  )
}

const CustomTextField = forwardRef((props, ref) => {
  // ** Props
  const { size = 'small', InputLabelProps, keepDisabledField = false, ...rest } = props

  if (rest.disabled && !keepDisabledField) {
    return (
      <DisabledText
        label={rest.label}
        value={rest.value}
        select={rest.select}
        InputProps={rest.InputProps}
        inputProps={rest.inputProps}
        multiline={rest.multiline}
        error={rest.error}
        helperText={rest.helperText}
        sx={rest.sx}
      >
        {rest.children}
      </DisabledText>
    )
  }

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
