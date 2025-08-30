// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import encrypt from 'src/utils/encrypt'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        await axios({
          method: 'POST',
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/auth/me`,
          headers: {
            Authorization: storedToken
          }
        })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.data.userInfo, role: 'admin' })

            // Redirect to point-of-sale if menuId is only [27]
            if (response.data.data.userInfo.menuId.length === 1 && response.data.data.userInfo.menuId[0] === 27) {
              router.replace('/point-of-sale')
            }
          })
          .catch(err => {
            console.log(err, 'error auth')
            window.localStorage.clear()
            setUser(null)
            setLoading(false)
            router.replace('/login')
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Route guard effect - redirect to point-of-sale when accessing other routes
  useEffect(() => {
    if (user && user.menuId && user.menuId.length === 1 && user.menuId[0] === 27) {
      if (router.pathname !== '/point-of-sale' && router.pathname !== '/login') {
        router.replace('/point-of-sale')
      }
    }
  }, [router.pathname, user])

  const handleLogin = (params, errorCallback) => {
    axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/login`,
      data: {
        auth: encrypt(
          JSON.stringify({
            email: params.email.trim(),
            password: params.password
          })
        )
      }
    })
      .then(async response => {
        localStorage.setItem(authConfig.storageTokenKeyName, response.data.data.token)
        localStorage.setItem(authConfig.storageRefreshTokenKeyName, response.data.data.refreshToken)
        localStorage.setItem(authConfig.onTokenExpiration, response.data.data.refreshToken)
        localStorage.setItem('userData', JSON.stringify({ ...response.data.data.userInfo, role: 'admin' }))
        let returnUrl = router.query.returnUrl
        setUser({ ...response.data.data.userInfo, role: 'admin' })
        // Redirect to point-of-sale if menuId is only [27]
        if (response.data.data.userInfo.menuId.length === 1 && response.data.data.userInfo.menuId[0] === 27) {
          returnUrl = '/point-of-sale'
        }

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }
  const handleLogout = () => {
    setUser(null)
    window.localStorage.clear()
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
