<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">{{ $t('auth.login') }}</h2>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">{{ $t('auth.email') }}</label>
          <input
            id="email"
            v-model="loginForm.email"
            type="email"
            class="form-input"
            placeholder="Sample@gmail.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">{{ $t('auth.password') }}</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            class="form-input"
            placeholder=""
            required
          />
        </div>

        <div class="form-actions">
          <a href="#" @click.prevent="handleForgotPassword" class="forgot-password">
            {{ $t('auth.forgotPassword') }}
          </a>
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? $t('auth.loggingIn') : $t('auth.login') }}
        </button>
      </form>

      <div class="divider">
        <hr class="divider-line" />
      </div>

      <button @click="handleGoogleSignIn" class="google-signin-btn">
        <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {{ $t('auth.loginWithGoogle') }}
      </button>

      <div class="register-link">
        <p>
          {{ $t('auth.noAccount') }}
          <router-link to="/register" class="register-link-text">
            {{ $t('auth.registerNow') }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form data
const loginForm = reactive({
  email: '',
  password: '',
})

const isLoading = ref(false)

// Methods
const handleLogin = async () => {
  isLoading.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Login attempt:', loginForm.email)

    // For demo purposes, just redirect to home
    // In a real app, you would validate credentials here
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  console.log('Forgot password clicked')
  // Implement forgot password logic
}

const handleGoogleSignIn = () => {
  console.log('Google sign in clicked')
  // Implement Google OAuth logic
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.login-card {
  background: rgb(209, 17, 17);
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.login-title {
  text-align: center;
  color: #067ff8;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #fff;
  color: #2c3e50;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.form-input::placeholder {
  color: #a0a0a0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.forgot-password {
  color: #4a90e2;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #357abd;
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  background: #4a90e2;
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: none;
}

.login-btn:hover:not(:disabled) {
  background: #357abd;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.login-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.divider {
  margin: 1.5rem 0;
  position: relative;
}

.divider-line {
  border: none;
  border-top: 1px solid #e1e8ed;
  margin: 0;
}

.google-signin-btn {
  width: 100%;
  background: white;
  color: #5f6368;
  border: 2px solid #e1e8ed;
  padding: 0.875rem 1.5rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.google-signin-btn:hover {
  background: #f8f9fa;
  border-color: #dadce0;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.google-icon {
  flex-shrink: 0;
}

.register-link {
  margin-top: 1.5rem;
  text-align: center;
}

.register-link p {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.register-link-text {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.register-link-text:hover {
  color: #357abd;
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem;
  }

  .login-title {
    font-size: 1.5rem;
  }
}
</style>
