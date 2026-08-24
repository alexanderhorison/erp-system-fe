const isDevelopment = () => process.env.NEXT_PUBLIC_ENVIRONTMENT == 'development'

// ** Primary brand color.
// Production: stone (design system base). Development/SIT: blue, so the
// environment is identifiable at a glance.
const environtmentColor = () => (isDevelopment() ? '#1976D2' : '#57534E')

// ** Darker shade of the primary, used for hover/active states.
const environtmentColorDark = () => (isDevelopment() ? '#1565C0' : '#44403C')

// ** Lighter shade of the primary.
const environtmentColorLight = () => (isDevelopment() ? '#42A5F5' : '#79716B')

module.exports = { environtmentColor, environtmentColorDark, environtmentColorLight }
