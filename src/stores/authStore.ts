import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { setCookie, deleteCookie, getCookie } from '@/utils/cookies'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  // State - Initialize token from cookie instead of localStorage
  const user = ref<User | null>(null)
  const token = ref<string | null>(getCookie('auth_token') || null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Helper function to extract error message from different error types
  const extractErrorMessage = (err: unknown, defaultMessage: string): string => {
    // Check if it's an object with response.data.message (Axios error)
    if (
      err &&
      typeof err === 'object' &&
      'response' in err &&
      err.response &&
      typeof err.response === 'object' &&
      'data' in err.response &&
      err.response.data &&
      typeof err.response.data === 'object' &&
      'message' in err.response.data &&
      typeof err.response.data.message === 'string'
    ) {
      return err.response.data.message
    }

    // Check if it's a regular Error object
    if (err instanceof Error) {
      return err.message
    }

    // Check if it's a string
    if (typeof err === 'string') {
      return err
    }

    return defaultMessage
  }

  // Actions
  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await authService.register(email, password, firstName, lastName)

      user.value = response.user
      token.value = response.token
      setCookie('auth_token', response.token)
      // Also store user info in cookie for easier retrieval
      setCookie('user_info', JSON.stringify(response.user))

      return response
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, 'Registration failed')
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await authService.login(email, password)

      user.value = response.user
      token.value = response.token
      setCookie('auth_token', response.token)
      // Also store user info in cookie for easier retrieval
      setCookie('user_info', JSON.stringify(response.user))

      return response
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, 'Login failed')
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err: unknown) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      token.value = null
      deleteCookie('auth_token')
      deleteCookie('user_info')
    }
  }

  const getCurrentUser = async () => {
    if (!token.value) return null

    try {
      const userData = await authService.getCurrentUser()
      user.value = userData
      // Update user info in cookie
      setCookie('user_info', JSON.stringify(userData))
      return userData
    } catch (err: unknown) {
      console.error('Get current user error:', err)

      // Check if it's a 401 error (unauthorized)
      const is401Error =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'status' in err.response &&
        err.response.status === 401

      if (is401Error) {
        await logout()
      }
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize auth state on store creation
  const initAuth = async () => {
    // Get token from cookie
    const cookieToken = getCookie('auth_token')
    if (cookieToken) {
      token.value = cookieToken

      // Try to get user info from cookie first
      const userInfoCookie = getCookie('user_info')
      if (userInfoCookie) {
        try {
          user.value = JSON.parse(userInfoCookie)
        } catch (err) {
          console.error('Failed to parse user info from cookie:', err)
        }
      }

      // If we have token but no user, fetch user from API
      if (!user.value) {
        try {
          await getCurrentUser()
        } catch (err: unknown) {
          console.error('Failed to initialize auth:', err)
          // If token is invalid, clear everything
          await logout()
        }
      }
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    // Actions
    register,
    login,
    logout,
    getCurrentUser,
    clearError,
    initAuth,
  }
})
