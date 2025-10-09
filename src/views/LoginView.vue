<template>
  <div class="login-container">
    <Card class="login-card">
      <template #title>
        <h2 class="login-title">{{ $t('auth.loginTitle') }}</h2>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">{{ $t('auth.email') }}</label>
            <InputText
              id="email"
              v-model="loginForm.email"
              type="email"
              placeholder="max.mustermann@email.com"
              :disabled="authStore.isLoading"
              fluid
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">{{ $t('auth.password') }}</label>
            <Password
              id="password"
              v-model="loginForm.password"
              placeholder=""
              :disabled="authStore.isLoading"
              :feedback="false"
              toggleMask
              fluid
            />
          </div>

          <Message v-if="authStore.error" severity="error" :closable="false">
            {{ authStore.error }}
          </Message>

          <Button
            type="submit"
            :label="authStore.isLoading ? $t('auth.loggingIn') : $t('auth.login')"
            :loading="authStore.isLoading"
            :disabled="!isFormValid"
            class="w-full"
          />
        </form>

        <Divider align="center">
          <span class="divider-text">{{ $t('auth.orContinueWith') }}</span>
        </Divider>

        <!-- Social Login Buttons -->
        <div class="social-login-container">
          <Button
            @click="handleSocialSignIn('google-oauth2')"
            :disabled="authStore.isLoading"
            severity="secondary"
            outlined
            class="w-full social-btn"
          >
            <svg class="social-icon" viewBox="0 0 24 24" width="18" height="18">
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

          <Button
            @click="handleSocialSignIn('facebook')"
            :disabled="authStore.isLoading"
            severity="secondary"
            outlined
            class="w-full social-btn"
          >
            <svg class="social-icon" viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#1877F2"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            <span class="ml-2">{{ $t('auth.loginWithFacebook') }}</span>
          </Button>

          <Button
            @click="handleSocialSignIn('windowslive')"
            :disabled="authStore.isLoading"
            severity="secondary"
            outlined
            class="w-full social-btn"
          >
            <svg class="social-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="#F25022" d="M11.4 11.4H0V0h11.4v11.4z" />
              <path fill="#00A4EF" d="M24 11.4H12.6V0H24v11.4z" />
              <path fill="#7FBA00" d="M11.4 24H0V12.6h11.4V24z" />
              <path fill="#FFB900" d="M24 24H12.6V12.6H24V24z" />
            </svg>
            <span class="ml-2">{{ $t('auth.loginWithMicrosoft') }}</span>
          </Button>

          <Button
            @click="handleSocialSignIn('twitter')"
            :disabled="authStore.isLoading"
            severity="secondary"
            outlined
            class="w-full social-btn"
          >
            <svg class="social-icon" viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#000000"
                d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
              />
            </svg>
            <span class="ml-2">{{ $t('auth.loginWithTwitter') }}</span>
          </Button>
        </div>

        <div class="register-link">
          <p>
            {{ $t('auth.noAccount') }}
            <router-link to="/register" class="register-link-text">{{
              $t('auth.registerNow')
            }}</router-link>
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAuth0 } from '@auth0/auth0-vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Divider from 'primevue/divider'

const router = useRouter()
const authStore = useAuthStore()
const auth0 = useAuth0()

const loginForm = reactive({
  email: '',
  password: '',
})

const isFormValid = computed(() => {
  return loginForm.email && loginForm.password
})

onMounted(() => {
  authStore.clearError()
})

const handleLogin = async () => {
  if (!isFormValid.value) {
    return
  }

  try {
    authStore.clearError()
    await authStore.login(loginForm.email, loginForm.password)
    console.log('Login successful')
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
  }
}

const handleSocialSignIn = async (connection: string) => {
  try {
    await auth0.loginWithPopup({
      authorizationParams: {
        connection,
      },
    })

    const token = await auth0.getAccessTokenSilently()
    await authStore.socialLogin(token)
    router.push('/')
  } catch (error) {
    console.error('Social login failed:', error)
  }
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

.divider-text {
  font-size: 0.8rem;
  color: #6b7280;
  padding: 0 1rem;
}

.social-login-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.social-btn {
  justify-content: flex-start;
}

.social-icon {
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

@media (max-width: 600px) {
  .login-container {
    padding: 1rem;
  }

  .login-title {
    font-size: 1.5rem;
  }
}
</style>
