// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
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
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import Logo from 'src/icons/logo'

// ** Styled Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: '',
  email: ''
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // ** Hooks
  const auth = UseAuth()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

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
  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        px: 4
      }}
    >
      {/* Centered Login Card */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 420,
          backgroundColor: 'background.paper',
          borderRadius: 4,
          boxShadow: 3,
          p: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Logo width={80} style={{ marginBottom: 24 }} />

        <Typography variant='h4' sx={{ mb: 1, textAlign: 'center' }}>
          {`Welcome to`}
        </Typography>

        <Typography variant='h4' sx={{ mb: 1, textAlign: 'center' }}>
          {`${themeConfig.templateName}! 👋🏻`}
        </Typography>

        <Typography variant='body2' sx={{ color: 'text.secondary', mb: 6, textAlign: 'center' }}>
          Please sign in to continue
        </Typography>

        {process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true' && (
          <Alert
            icon={false}
            sx={{
              py: 3,
              mb: 6,
              ...bgColors.primaryLight,
              '& .MuiAlert-message': { p: 0 }
            }}
          >
            <Typography variant='body2' sx={{ mb: 2, color: 'primary.main' }}>
              Admin: <strong>admin@vuexy.com</strong> / Pass: <strong>admin</strong>
            </Typography>
            <Typography variant='body2' sx={{ color: 'primary.main' }}>
              Client: <strong>client@vuexy.com</strong> / Pass: <strong>client</strong>
            </Typography>
          </Alert>
        )}

        {/* Login Form */}
        <Box component='form' noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
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
                  {...(errors.email && { helperText: errors.email.message })}
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 1.5 }}>
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
                  error={Boolean(errors.password)}
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

          <Box
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <FormControlLabel
              label='Remember Me'
              control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
            />
            {process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true' && (
              <Typography component={LinkStyled} href='/forgot-password'>
                Forgot Password?
              </Typography>
            )}
          </Box>

          <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }} disabled={loading}>
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 2, color: 'inherit' }} />
                Loading...
              </>
            ) : (
              'Login'
            )}
          </Button>

          {process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true' && (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
              New user? <LinkStyled href='/register'>Create an account</LinkStyled>
            </Typography>
          )}
        </Box>
      </Box>

      {/* Footer Illustration */}
      <FooterIllustrationsV2 />
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
