// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { UseAuth } from 'src/hooks/useAuth'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Logo
import Logo from 'src/icons/logo'

// ** Styled Components
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)(() => ({
  marginLeft: 0,
  gap: 12,
  '& .MuiButtonBase-root': {
    padding: 0
  },
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    lineHeight: '20px',
    color: colors.foregroundAlt
  }
}))

// ** Brand panel — the left half from `md` up. Below that the screen is too
// narrow to sit side by side, so it stacks on top of the form instead: a compact,
// centred header (logo, name, subtitle) that the form panel's rounded top edge
// overlaps. The bottom padding is that overlap.
const BrandPanel = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flex: '0 0 auto',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: theme.spacing(10, 4, 18),
  color: colors.primaryForeground,
  background: `radial-gradient(circle at 50% 50%, ${stone[600]} 0%, ${stone[700]} 100%)`,
  boxShadow: shadows.sm,
  [theme.breakpoints.up('md')]: {
    flex: '1 1 50%',
    alignItems: 'stretch',
    textAlign: 'left',
    gap: theme.spacing(6),
    padding: theme.spacing(8, 10)
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(8, 20)
  }
}))

const TaglineIcon = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: 2,
  borderRadius: radii['3xl'],
  color: colors.primaryForeground,
  backgroundColor: colors.outline,
  border: `1px solid ${colors.border}`
}))

const schema = yup.object().shape({
  email: yup.string().required('Email atau Username harus diisi'),
  password: yup.string().min(5, 'Password minimal 5 karakter').required('Password harus diisi')
})

const defaultValues = {
  password: '',
  email: ''
}

const TAGLINES = [
  'Real-time multi-warehouse stock management',
  'Sales orders and barter in a single system',
  'Reports and transaction history, anytime'
]

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // ** Hooks
  const auth = UseAuth()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    const { email, password } = data

    // Sanitize and trim email
    const sanitizedEmail = email.trim().toLowerCase()
    setLoading(true)
    auth.login({ email: sanitizedEmail, password, rememberMe }, () => {
      setLoading(false)
      setError('email', {
        type: 'manual',
        message: 'Email or Password is invalid'
      })
    })
  }

  // ** A failed login is surfaced through `errors.email` (see `setError` above).
  // The design shows it as a standalone message below both fields rather than as
  // field helper text, so the manual error is rendered separately.
  const loginFailed = errors.email?.type === 'manual'

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'stretch',
        backgroundColor: colors.accent2
      }}
    >
      <BrandPanel>
        {/* Oversized watermark logo */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: -14,
            left: -70,
            width: 860,
            height: 860,
            opacity: 0.05,
            mixBlendMode: 'soft-light',
            pointerEvents: 'none'
          }}
        >
          <Logo width={860} height={860} />
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              width: { xs: 88, md: 112 },
              height: { xs: 88, md: 112 },
              p: { xs: 2.5, md: 4 },
              mx: { xs: 'auto', md: 0 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radii.full,
              backgroundColor: colors.background,
              mb: { xs: 4, md: 6 }
            }}
          >
            <Logo width='100%' height='100%' />
          </Box>

          <Typography
            sx={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: '24px', mb: 1, color: colors.primaryForeground }}
          >
            {themeConfig.templateName}
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', lineHeight: '20px', mb: { md: 6 }, color: colors.primaryForeground }}>
            Inventory Management System
          </Typography>

          {/* Desktop only — the stacked mobile header stays to logo, name and subtitle. */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 2, mb: 6 }}>
            {TAGLINES.map(tagline => (
              <Box key={tagline} sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <TaglineIcon>
                  <Icon icon='tabler:check' fontSize='1rem' />
                </TaglineIcon>
                <Typography sx={{ fontSize: '0.875rem', lineHeight: '20px', color: colors.primaryForeground }}>
                  {tagline}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography
            sx={{
              display: { xs: 'none', md: 'block' },
              fontSize: '0.75rem',
              lineHeight: '16px',
              color: colors.primaryForeground
            }}
          >
            © {new Date().getFullYear()} Tjahaya Berkat Abadi. All rights reserved.
          </Typography>
        </Box>
      </BrandPanel>

      {/* Form panel. Stacked (below `md`) it slides up over the brand header with a
          rounded top edge, and carries the copyright line at its foot. */}
      <Box
        sx={{
          flex: { xs: '1 0 auto', md: '1 1 50%' },
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 6, sm: 8 },
          mt: { xs: -8, md: 0 },
          position: 'relative',
          zIndex: 1,
          borderTopLeftRadius: { xs: `${radii['3xl']}px`, md: 0 },
          borderTopRightRadius: { xs: `${radii['3xl']}px`, md: 0 },
          backgroundColor: colors.background,
          boxShadow: shadows.sm
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: { xs: 480, md: 360 } }}>
            <Typography variant='h3' sx={{ color: colors.foreground, mb: 1 }}>
              Selamat Datang
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', lineHeight: '20px', color: colors.mutedForeground, mb: 4 }}>
              Silakan masuk ke akun Anda.
            </Typography>

            <Box
              component='form'
              noValidate
              autoComplete='off'
              onSubmit={handleSubmit(onSubmit)}
              sx={{ width: '100%' }}
            >
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder=''
                      error={Boolean(errors.email)}
                      {...(errors.email && !loginFailed && { helperText: errors.email.message })}
                    />
                  )}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password) || loginFailed}
                      {...(errors.password && { helperText: errors.password.message })}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>

              {loginFailed && (
                <Typography sx={{ fontSize: '0.875rem', lineHeight: '20px', color: colors.destructive, mb: 4 }}>
                  Email atau password yang Anda masukkan salah. Silakan coba lagi.
                </Typography>
              )}

              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  label='Remember Me'
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                />
                {process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true' && (
                  <Typography component={LinkStyled} href='/forgot-password' sx={{ fontSize: '0.875rem' }}>
                    Forgot Password?
                  </Typography>
                )}
              </Box>

              <Button fullWidth type='submit' variant='contained' disabled={loading}>
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 2, color: 'inherit' }} />
                    Loading...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>

              {process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true' && (
                <Typography sx={{ textAlign: 'center', color: colors.mutedForeground, mt: 4, fontSize: '0.875rem' }}>
                  New user? <LinkStyled href='/register'>Create an account</LinkStyled>
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Mobile only — on desktop the copyright sits in the brand panel. */}
        <Typography
          sx={{
            display: { xs: 'block', md: 'none' },
            mt: 8,
            textAlign: 'center',
            fontSize: '0.75rem',
            lineHeight: '16px',
            color: colors.mutedForeground
          }}
        >
          © {new Date().getFullYear()} Tjahaya Berkat Abadi. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
