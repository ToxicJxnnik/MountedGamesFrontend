import axios from 'axios'

interface UserResponse {
  id: number
  firstName: string
  lastName: string
  email: string
}

interface RegisterResponse {
  user: UserResponse
  token: string
}

interface LoginResponse {
  user: UserResponse
  token: string
}

const API_BASE_URL = 'http://localhost:8080/api'

// Add request/response interceptors for better debugging
axios.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url)
    console.log('Request config:', config)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// Replace your current response interceptor with this:
axios.interceptors.response.use(
  (response) => {
    console.log('Response received:', response)
    return response
  },
  (error) => {
    console.error('Response error:', error)

    // Extract the backend message and set it as error.message
    if (error.response?.data?.message) {
      error.message = error.response.data.message
    } else if (error.response?.data?.error) {
      error.message = error.response.data.error
    } else if (error.code === 'ECONNREFUSED') {
      error.message = 'Cannot connect to server. Is the backend running?'
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error. Check if backend is running and CORS is configured.'
    } else if (!error.response && error.request) {
      error.message = 'No response from server. Check backend URL and network connection.'
    }

    return Promise.reject(error)
  },
)

export const authService = {
  async register(
    email: string,
    password: string,
    captchaToken: string,
    firstName: string,
    lastName: string,
  ): Promise<RegisterResponse> {
    console.log('Attempting to register with:', { email, firstName, lastName })

    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
      captchaToken,
      firstName,
      lastName,
    })

    console.log('Registration successful:', response.data)
    return response.data
  },

  async login(email: string, password: string, captchaToken: string): Promise<LoginResponse> {
    console.log('Attempting to login with:', { email })
    console.log('Captcha Token:', captchaToken)
    console.log('Dane')
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      Email: email,
      Password: password,
      CaptchaToken: captchaToken,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Login successful:', response.data)
    return response.data
  },

  async socialLogin(accessToken: string, role?: string): Promise<LoginResponse> {
    console.log('Attempting social login with Auth0')

    const response = await axios.post(`${API_BASE_URL}/auth/social-login`, {
      accessToken,
      role: role || 'horseman',
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Social login successful:', response.data)
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`)
      localStorage.removeItem('auth_token')
    } catch (error) {
      console.error('Logout error:', error)
      // Still remove token even if API call fails
      localStorage.removeItem('auth_token')
    }
  },

  async getCurrentUser(): Promise<UserResponse> {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Get current user error:', error)
      throw error
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await axios.post(`${API_BASE_URL}/passwordreset/forgot-password`, {
        email,
      })
    } catch (error) {

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Cannot connect to server.')
        }
        if (error.response) {
          throw new Error(
            error.response.data?.message || `Password reset failed: ${error.response.status}`,
          )
        } else if (error.request) {
          throw new Error('No response from server. Check backend URL and network connection.')
        }
      }

      throw error
    }
  },

  async verifyResetToken(email: string, token: string): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/passwordreset/verify-reset-token`, {
        params: {
          email,
          token,
        }
      })

      console.log('Token verification result:', response.data)
      return response.data.isValid === true
    } catch (error) {
      console.error('Token verification error:', error)

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400 || error.response?.status === 404) {
          return false
        }
      }

      throw error
    }
  },

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      console.log('Resetting password with token')

      const response = await axios.put(`${API_BASE_URL}/passwordreset/reset-password`, {
        token,
        password,
      })

      console.log('Password reset successful:', response.data)
    } catch (error) {
      console.error('Password reset error:', error)

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Cannot connect to server. Is the backend running?')
        }
        if (error.response) {
          throw new Error(
            error.response.data?.message || `Password reset failed: ${error.response.status}`,
          )
        } else if (error.request) {
          throw new Error('No response from server. Check backend URL and network connection.')
        }
      }

      throw error
    }
  },
}
