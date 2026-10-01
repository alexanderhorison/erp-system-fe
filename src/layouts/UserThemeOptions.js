// ** Design Tokens (extracted from Figma — see src/configs/designTokens.js)
import { colors, radii, shadows, typographyTokens } from 'src/configs/designTokens'

/**
 * User theme overrides.
 * -------------------------------------------------------------------------------------
 * Merged over the core template theme in `src/@core/theme/ThemeOptions.js`.
 * This is where the Figma design language is applied on top of the base template.
 */
const UserThemeOptions = () => {
  const { fontFamilyBody, heading3, heading4, paragraphSmall, paragraphMini, weights } = typographyTokens

  const px = value => `${value}px`

  return {
    shape: {
      // ** Cards/menus/surfaces. Inputs and buttons opt into the pill radius via
      // component overrides below.
      borderRadius: radii.lg
    },
    typography: {
      fontFamily: [
        fontFamilyBody,
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"'
      ].join(','),
      h3: {
        fontSize: px(heading3.fontSize),
        lineHeight: heading3.lineHeight / heading3.fontSize,
        letterSpacing: px(heading3.letterSpacing),
        fontWeight: heading3.fontWeight
      },
      h4: {
        fontSize: px(heading4.fontSize),
        lineHeight: heading4.lineHeight / heading4.fontSize,
        letterSpacing: px(heading4.letterSpacing),
        fontWeight: heading4.fontWeight
      },
      body2: {
        fontSize: px(paragraphSmall.fontSize),
        lineHeight: paragraphSmall.lineHeight / paragraphSmall.fontSize
      },
      caption: {
        fontSize: px(paragraphMini.fontSize),
        lineHeight: paragraphMini.lineHeight / paragraphMini.fontSize
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: radii.full,
            textTransform: 'none',
            fontWeight: weights.semibold,
            fontSize: px(paragraphSmall.fontSize),
            lineHeight: `${paragraphSmall.lineHeight}px`
          },
          // ** The core theme's `contained` override is a function; a plain object
          // here replaces it in the merge and drops its padding, leaving contained
          // buttons ~8px shorter than outlined ones. Medium padding is restated so
          // Cancel/Save pairs stay the same height (matches `outlined` in core).
          contained: ({ ownerState }) => ({
            boxShadow: shadows.xs,
            '&:hover': { boxShadow: shadows.xs },
            ...(ownerState.size === 'medium' && { padding: '10px 20px' })
          }),
          sizeSmall: { borderRadius: radii.full },
          sizeLarge: { borderRadius: radii.full }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: radii.full }
        }
      },
      MuiCheckbox: {
        styleOverrides: {
          root: { borderRadius: radii.sm }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: radii['3xl'] }
        }
      },
      MuiPaper: {
        styleOverrides: {
          rounded: { borderRadius: radii['3xl'] }
        }
      }
    },
    // ** Non-MUI values kept on the theme so components can read Figma tokens
    // without importing the token module directly.
    designTokens: { colors, radii, shadows, typographyTokens }
  }
}

export default UserThemeOptions
