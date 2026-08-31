const isDevelopment = () => process.env.NEXT_PUBLIC_ENVIRONTMENT == 'development'

// ** Primary brand color.
// Production: stone (design system base). Development/SIT: blue, so the
// environment is identifiable at a glance.
const environtmentColor = () => (isDevelopment() ? '#2475c6' : '#57534E')

// ** Darker shade of the primary, used for hover/active states.
const environtmentColorDark = () => (isDevelopment() ? '#1777e4' : '#44403C')

// ** Lighter shade of the primary.
const environtmentColorLight = () => (isDevelopment() ? '#2475c6' : '#79716B')

module.exports = { environtmentColor, environtmentColorDark, environtmentColorLight }
