<template>
  <div class="login-container">
    <Card class="login-card">
      <template #title>
        <h2 class="login-title">{{ $t('auth.login') }}</h2>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">{{ $t('auth.email') }}</label>
            <InputText
              id="email"
              v-model="loginForm.email"
              type="email"
              placeholder="Sample@gmail.com"
              :disabled="isLoading"
              fluid
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">{{ $t('auth.password') }}</label>
            <Password
              id="password"
              v-model="loginForm.password"
              :disabled="isLoading"
              :feedback="false"
              toggleMask
              fluid
            />
          </div>

          <div class="form-actions">
            <a href="#" @click.prevent="handleForgotPassword" class="forgot-password">
              {{ $t('auth.forgotPassword') }}
            </a>
          </div>

          <Button
            type="submit"
            :label="isLoading ? $t('auth.loggingIn') : $t('auth.login')"
            :loading="isLoading"
            class="w-full"
          />
        </form>

        <Divider />

        <Button
          @click="handleGoogleSignIn"
          severity="secondary"
          outlined
          class="w-full google-signin-btn"
        >
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
          <span class="ml-2">{{ $t('auth.loginWithGoogle') }}</span>
        </Button>

        <div class="register-link">
          <p>
            {{ $t('auth.noAccount') }}
            <router-link to="/register" class="register-link-text">
              {{ $t('auth.registerNow') }}
            </router-link>
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Divider from 'primevue/divider'

const router = useRouter()

const loginForm = reactive({
  email: '',
  password: '',
})

const isLoading = ref(false)

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
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: -0.5rem;
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

.google-signin-btn {
  justify-content: center;
  margin-top: 1rem;
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

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }

  .login-title {
    font-size: 1.5rem;
  }
}
</style>
