// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'

// ** Store Imports
import { store } from '../store'
import { Provider } from 'react-redux'
import { createContext, useContext } from 'react'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Fake-DB Import
import 'src/@fake-db'

// ** Third Party Import
import { Toaster } from 'sonner'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Design Tokens
import { radii } from 'src/configs/designTokens'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'src/iconify-bundle/icons-bundle-react'

// ** Global css styles
import '../../styles/globals.css'

// ** Sweet Alert 2
import Swal from './sweetalert'
import useDisableNumberInputScroll from 'src/hooks/disableScroll'

export const useSweetAlert = () => useContext(SweetAlertContext)

const SweetAlertContext = createContext()
const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  // GLOBAL DISABLE SCROLL INPUT ON NUMBER
  useDisableNumberInputScroll()

  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)
  const setConfig = Component.setConfig ?? undefined
  const authGuard = Component.authGuard ?? true
  const guestGuard = Component.guestGuard ?? false
  const aclAbilities = Component.acl ?? defaultACLObj

  const env = process.env.NEXT_PUBLIC_ENVIRONTMENT || process.env.NEXT_PUBLIC_ENVIRONMENT || 'production'
  const baseTitle = themeConfig.templateName
  const pageTitle = env === 'development' ? `${baseTitle} - Dev` : baseTitle
  const faviconHref = env === 'development' ? '/favicon-dev.svg?v=2' : '/favicon.ico'
  const manifestHref = env === 'development' ? '/manifest-dev.json' : '/manifest.json'

  return (
    <Provider store={store}>
      <SweetAlertContext.Provider value={Swal}>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>{pageTitle}</title>
            <meta name='description' content={pageTitle} />
            <link rel="icon" href={faviconHref} />
            <link rel="shortcut icon" href={faviconHref} />
            <link rel="manifest" href={manifestHref} />
            <meta name='keywords' content='' />
            <meta name='viewport' content='initial-scale=1, width=device-width' />
            <meta name="robots" content="noindex, nofollow" />
          </Head>

          <AuthProvider>
            <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>
                        <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard} authGuard={authGuard}>
                          {getLayout(<Component {...pageProps} />)}
                        </AclGuard>
                      </Guard>
                      <Toaster
                        position={settings.toastPosition}
                        richColors
                        closeButton
                        expand={false}
                        duration={4000}
                        toastOptions={{
                          style: {
                            fontFamily: 'Geist, sans-serif',
                            borderRadius: `${radii.lg}px`,
                            fontSize: '0.875rem'
                          }
                        }}
                      />
                    </ThemeComponent>
                  )
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </AuthProvider>
        </CacheProvider>
      </SweetAlertContext.Provider>
    </Provider>
  )
}

export default App
