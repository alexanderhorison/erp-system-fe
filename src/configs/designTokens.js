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
  outline: 'rgba(255, 255, 255, 0.1)',
  // ** Hyperlinks. Blue-600/700 rather than the environment blue, so a link
  // reads as a link in both the stone (production) and blue (dev/SIT) themes.
  link: '#2563EB',
  linkHover: '#1D4ED8'
}

// ** Status colors (Tailwind red/amber/emerald 400-600), used to signal stock
// health on chips and badges. `fg` is the text/border tone, `bg` the tint behind
// it — both chosen to stay legible on a white surface.
const status = {
  danger: { fg: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  warning: { fg: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  success: { fg: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  info: { fg: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' }
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

// ** Sidebar colors. The surface is dark and derives from the environment
// colour, so production (stone) and development/SIT (blue) stay distinguishable
// at a glance — see `src/helpers/getEnvirontmentColor.js`.
const sidebarPalette = isDevelopment =>
  isDevelopment
    ? {
        // Development/SIT: a light blue surface, so the environment is obvious
        // without the navigation reading as a dark panel.
        background: '#E3F2FD',
        border: '#BBDEFB',
        foreground: '#0D3C61',
        muted: '#42688C',
        activeBg: '#BBDEFB',
        activeFg: '#0B2E4A',
        activeAccent: '#1976D2'
      }
    : {
        background: '#44403C',
        border: '#57534E',
        foreground: '#D6D3D1',
        muted: '#A8A29E',
        activeBg: 'rgba(255, 255, 255, 0.08)',
        activeFg: '#FAFAFA',
        activeAccent: '#79716B'
      }

const sidebarIsLight = process.env.NEXT_PUBLIC_ENVIRONTMENT == 'development'
const sidebar = sidebarPalette(sidebarIsLight)

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
  status,
  sidebarPalette,
  sidebarIsLight,
  colors,
  layout,
  sidebar,
  typographyTokens,
  spacingScale,
  radii,
  shadows
}
