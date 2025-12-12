<template>
  <div class="register-container">
    <Card class="register-card">
      <template #title>
        <h2 class="register-title">{{ $t('auth.registerTitle') }}</h2>
      </template>
      <template #content>
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">{{ $t('auth.firstName') }}</label>
              <InputText
                id="firstName"
                v-model="registerForm.firstName"
                placeholder="Max"
                :disabled="authStore.isLoading"
                :invalid="!!fieldErrors.firstName"
                fluid
              />
              <small v-if="fieldErrors.firstName" class="p-error">
                {{ fieldErrors.firstName }}
              </small>
            </div>

            <div class="form-group">
              <label for="lastName" class="form-label">{{ $t('auth.lastName') }}</label>
              <InputText
                id="lastName"
                v-model="registerForm.lastName"
                placeholder="Mustermann"
                :disabled="authStore.isLoading"
                :invalid="!!fieldErrors.lastName"
                fluid
              />
              <small v-if="fieldErrors.lastName" class="p-error">
                {{ fieldErrors.lastName }}
              </small>
            </div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">{{ $t('auth.email') }}</label>
            <InputText
              id="email"
              v-model="registerForm.email"
              type="email"
              placeholder="max.mustermann@email.com"
              :disabled="authStore.isLoading"
              :invalid="!!fieldErrors.email"
              @input="clearFieldError('email')"
              fluid
            />
            <small v-if="fieldErrors.email" class="p-error">
              {{ fieldErrors.email }}
            </small>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">{{ $t('auth.password') }}</label>
            <Password
              id="password"
              v-model="registerForm.password"
              :disabled="authStore.isLoading"
              :invalid="!!fieldErrors.password"
              @input="clearFieldError('password')"
              toggleMask
              fluid
            />
            <small v-if="fieldErrors.password" class="p-error">
              {{ fieldErrors.password }}
            </small>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">{{ $t('auth.confirmPassword') }}</label>
            <Password
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              :disabled="authStore.isLoading"
              :feedback="false"
              :invalid="!!passwordError"
              toggleMask
              fluid
            />
            <small v-if="passwordError" class="p-error">
              {{ passwordError }}
            </small>
          </div>

          <div class="form-group checkbox-group">
            <Checkbox
              v-model="registerForm.acceptTerms"
              inputId="acceptTerms"
              :binary="true"
              :disabled="authStore.isLoading"
            />
            <label for="acceptTerms" class="checkbox-label">
              {{ $t('auth.acceptTerms') }}
            </label>
          </div>

          <!-- General error message (for errors that don't belong to a specific field) -->
          <Message v-if="generalError" severity="error" :closable="false">
            {{ generalError }}
          </Message>

          <Button
            type="submit"
            :label="authStore.isLoading ? $t('auth.registering') : $t('auth.register')"
            :loading="authStore.isLoading"
            :disabled="!isFormValid"
            class="w-full"
          />
        </form>

        <Divider align="center">
          <span class="divider-text">{{ $t('auth.orContinueWith') }}</span>
        </Divider>

        <!-- Social Registration Buttons -->
        <div class="social-login-container">
          <Button
            @click="handleSocialSignUp('google-oauth2')"
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
            <span class="ml-2">{{ $t('auth.registerWithGoogle') }}</span>
          </Button>

          <Button
            @click="handleSocialSignUp('facebook')"
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
            <span class="ml-2">{{ $t('auth.registerWithFacebook') }}</span>
          </Button>

          <Button
            @click="handleSocialSignUp('windowslive')"
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
            <span class="ml-2">{{ $t('auth.registerWithMicrosoft') }}</span>
          </Button>

          <Button
            @click="handleSocialSignUp('twitter')"
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
            <span class="ml-2">{{ $t('auth.registerWithTwitter') }}</span>
          </Button>
        </div>

        <div class="login-link">
          <p>
            {{ $t('auth.haveAccount') }}
            <router-link to="/login" class="login-link-text">{{ $t('auth.loginNow') }}</router-link>
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n'
import { useAuth0 } from '@auth0/auth0-vue'
import { useReCaptcha } from 'vue-recaptcha-v3'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Divider from 'primevue/divider'
import Checkbox from 'primevue/checkbox'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
const auth0 = useAuth0()

const recaptchaInstance = useReCaptcha()

const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

// Track field-specific errors
const fieldErrors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
})

// General error (for errors that don't belong to a specific field)
const generalError = ref('')

const passwordError = computed(() => {
  if (registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword) {
    return t('auth.passwordMismatch')
  }
  return ''
})

const isFormValid = computed(() => {
  return (
    registerForm.firstName &&
    registerForm.lastName &&
    registerForm.email &&
    registerForm.password &&
    registerForm.confirmPassword &&
    registerForm.password === registerForm.confirmPassword &&
    registerForm.acceptTerms
  )
})

// Clear a specific field error when user starts typing
const clearFieldError = (field: keyof typeof fieldErrors) => {
  fieldErrors[field] = ''
  generalError.value = ''
}

// Clear all field errors
const clearAllFieldErrors = () => {
  fieldErrors.firstName = ''
  fieldErrors.lastName = ''
  fieldErrors.email = ''
  fieldErrors.password = ''
  generalError.value = ''
}

// Parse backend error and assign to appropriate field
const handleErrorMessage = (errorMessage: string) => {
  clearAllFieldErrors()

  const lowerMessage = errorMessage.toLowerCase()

  // Check for email-related errors
  if (lowerMessage.includes('email') && lowerMessage.includes('already')) {
    fieldErrors.email = errorMessage
  } else if (lowerMessage.includes('email') && lowerMessage.includes('invalid')) {
    fieldErrors.email = errorMessage
  }
  // Check for password-related errors
  else if (lowerMessage.includes('password')) {
    fieldErrors.password = errorMessage
  }
  // Check for first name errors
  else if (lowerMessage.includes('first name') || lowerMessage.includes('firstname')) {
    fieldErrors.firstName = errorMessage
  }
  // Check for last name errors
  else if (lowerMessage.includes('last name') || lowerMessage.includes('lastname')) {
    fieldErrors.lastName = errorMessage
  }
  // Default: show as general error
  else {
    generalError.value = errorMessage
  }
}

const handleRegister = async () => {
  if (!isFormValid.value) {
    return
  }

  clearAllFieldErrors()

  if (!recaptchaInstance) {
    console.error('reCAPTCHA not loaded')
    return
  }

  await recaptchaInstance.recaptchaLoaded()

  try {
    const token = await recaptchaInstance.executeRecaptcha('submit')

    await authStore.register(
      registerForm.email,
      registerForm.password,
      token,
      registerForm.firstName,
      registerForm.lastName,
    )
    console.log('Registration successful')
    router.push('/personal-info')

  } catch (error: any) {
    console.error('Registration failed:', error)

    // Get the error message from the store or the error object
    const errorMessage = authStore.error || error.message || 'Registration failed'

    // Parse and assign the error to the appropriate field
    handleErrorMessage(errorMessage)
  }
}

const handleSocialSignUp = async (connection: string) => {
  try {
    await auth0.loginWithPopup({
      authorizationParams: {
        connection,
      },
    })

    const token = await auth0.getAccessTokenSilently()
    await authStore.socialLogin(token)
    router.push('/personal-info')
  } catch (error) {
    console.error('Social registration failed:', error)
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.register-card {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.register-title {
  text-align: center;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-label {
  color: #2c3e50;
  font-size: 0.9rem;
  cursor: pointer;
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

.login-link {
  margin-top: 1.5rem;
  text-align: center;
}

.login-link p {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.login-link-text {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.login-link-text:hover {
  color: #357abd;
  text-decoration: underline;
}

@media (max-width: 600px) {
  .register-container {
    padding: 1rem;
  }

  .register-card {
    max-height: 95vh;
  }

  .register-title {
    font-size: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
