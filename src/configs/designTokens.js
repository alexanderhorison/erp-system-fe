/**
 * Design Tokens
 * -------------------------------------------------------------------------------------
 * Extracted from Figma (ERP-TBA). This is the single source of truth for the
 * visual language: colors, typography, spacing, radii and shadows.
 *
 * Prefer referencing these tokens (or the MUI theme values derived from them in
 * `src/layouts/UserThemeOptions.js`) over hardcoding values in components.
 */

// ** Neutral ramp (Figma: stone/*). The brand primary is derived from this ramp
// in production — see `src/helpers/getEnvirontmentColor.js`.
const stone = {
  50: '#FAFAF9',
  100: '#F5F5F4',
  200: '#E7E5E4',
  300: '#D6D3D1',
  400: '#A8A29E',
  500: '#78716C',
  600: '#57534E',
  700: '#44403C',
  800: '#292524',
  900: '#1C1917'
}

// ** Semantic colors (Figma: general/*, unofficial/*)
const colors = {
  foreground: '#0A0A0A',
  mutedForeground: '#737373',
  foregroundAlt: '#404040',
  primaryForeground: '#FAFAFA',
  background: '#FFFFFF',
  input: '#FFFFFF',
  border: '#E5E5E5',
  border3: '#D4D4D4',
  accent2: '#E5E5E5',
  destructive: '#DC2626',
  outline: 'rgba(255, 255, 255, 0.1)'
}

// ** Typography (Figma: heading */paragraph *). Font family is Geist.
const fontFamilyBody = 'Geist'

const typographyTokens = {
  fontFamilyBody,
  heading3: { fontSize: 24, lineHeight: 28.8, letterSpacing: -1, fontWeight: 600 },
  heading4: { fontSize: 20, lineHeight: 24, letterSpacing: 0, fontWeight: 600 },
  paragraphSmall: { fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  paragraphMini: { fontSize: 12, lineHeight: 16, letterSpacing: 0 },
  weights: { regular: 400, medium: 500, semibold: 600 }
}

// ** Spacing scale in px (Figma: 3xs..6xl)
const spacingScale = {
  '3xs': 2,
  '2xs': 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '6xl': 80
}

// ** Layout dimensions (Figma: Sidebar / Top Bar frames)
const layout = {
  sidebarWidth: 240,
  sidebarContentWidth: 208,
  topBarHeight: 64,
  navItemHeight: 32
}

// ** Sidebar-specific colors (Figma: sidebar/*)
const sidebar = {
  background: '#FFFFFF',
  border: '#E5E5E5',
  foreground: '#404040',
  muted: '#737373',
  activeBg: '#F5F5F4',
  activeAccent: '#57534E'
}

// ** Radii (Figma: rounded-*). `full` gives the pill shape used by inputs/buttons.
const radii = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 8,
  '3xl': 24,
  full: 9999
}

// ** Shadows (Figma: shadow-xs / shadow-sm)
const shadows = {
  xs: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
  sm: '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)',
  lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)'
}

module.exports = {
  stone,
  colors,
  layout,
  sidebar,
  typographyTokens,
  spacingScale,
  radii,
  shadows
}
