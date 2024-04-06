// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
// import axios from 'axios'
import axios from 'src/configs/axios'

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
          url: '/user/auth/me',
          headers: {
            Authorization: storedToken
          }
        })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.data.user_info, role: 'admin' })
          })
          .catch(err => {
            console.log(err, 'error auth')
            window.localStorage.clear()
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    axios({
      method: 'POST',
      url: '/user/login',
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
        console.log(response.data.data)
        localStorage.setItem(authConfig.storageTokenKeyName, response.data.data.token)
        localStorage.setItem(authConfig.storageRefreshTokenKeyName, response.data.data.refreshToken)
        localStorage.setItem(authConfig.onTokenExpiration, response.data.data.refreshToken)
        localStorage.setItem('userData', JSON.stringify({ ...response.data.data.user_info, role: 'admin' }))
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.data.user_info, role: 'admin' })
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
    // axios
    //   .post(authConfig.loginEndpoint, params)
    //   .then(async response => {
    //     params.rememberMe
    // ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
    //       : null
    //     const returnUrl = router.query.returnUrl
    //     setUser({ ...response.data.userData })
    //     params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
    //     const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
    //     router.replace(redirectURL)
    //   })
    //   .catch(err => {
    //     if (errorCallback) errorCallback(err)
    //   })
  }
  console.log(user)

  const handleLogout = () => {
    setUser(null)
    window.localStorage.clear()
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
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
