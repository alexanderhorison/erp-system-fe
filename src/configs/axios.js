import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 10000,
  headers: { Accept: 'application/json' }
})

instance.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.authorization = `Bearer ${accessToken}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// interceptor response
instance.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    let originalConfig = error.config
    
    // Check if error.response exists before destructuring
    if (error.response) {
      const { status, data } = error.response
      if (originalConfig.url !== '/user/login') {
        if (status === 401 && data.message === 'jwt expired') {
          window.localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export default instance
