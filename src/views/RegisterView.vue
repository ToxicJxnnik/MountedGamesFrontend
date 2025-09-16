<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="register-title">{{ $t('auth.registerTitle') }}</h2>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName" class="form-label">{{ $t('auth.firstName') }}</label>
            <input
              id="firstName"
              v-model="registerForm.firstName"
              type="text"
              class="form-input"
              placeholder="Max"
              required
            />
          </div>

          <div class="form-group">
            <label for="lastName" class="form-label">{{ $t('auth.lastName') }}</label>
            <input
              id="lastName"
              v-model="registerForm.lastName"
              type="text"
              class="form-input"
              placeholder="Mustermann"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">{{ $t('auth.email') }}</label>
          <input
            id="email"
            v-model="registerForm.email"
            type="email"
            class="form-input"
            placeholder="max.mustermann@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">{{ $t('auth.password') }}</label>
          <input
            id="password"
            v-model="registerForm.password"
            type="password"
            class="form-input"
            placeholder=""
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">{{ $t('auth.confirmPassword') }}</label>
          <input
            id="confirmPassword"
            v-model="registerForm.confirmPassword"
            type="password"
            class="form-input"
            placeholder=""
            required
          />
          <div v-if="passwordError" class="error-message">
            {{ passwordError }}
          </div>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input
              v-model="registerForm.acceptTerms"
              type="checkbox"
              class="checkbox-input"
              required
            />
            <span class="checkbox-text">
              {{ $t('auth.acceptTerms') }}
            </span>
          </label>
        </div>

        <div v-if="authStore.error" class="error-message global-error">
          {{ authStore.error }}
        </div>

        <button type="submit" class="register-btn" :disabled="authStore.isLoading || !isFormValid">
          {{ authStore.isLoading ? $t('auth.registering') : $t('auth.register') }}
        </button>
      </form>

      <div class="divider">
        <hr class="divider-line" />
      </div>

      <button @click="handleGoogleSignUp" class="google-signin-btn">
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
        {{ $t('auth.registerWithGoogle') }}
      </button>

      <div class="login-link">
        <p>
          {{ $t('auth.haveAccount') }}
          <router-link to="/login" class="login-link-text">{{ $t('auth.loginNow') }}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue' // removed 'ref' import
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

// Form data
const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

// Computed properties
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

// Methods
const handleRegister = async () => {
  if (!isFormValid.value) {
    return
  }

  try {
    await authStore.register(
      registerForm.email,
      registerForm.password,
      registerForm.firstName,
      registerForm.lastName,
    )

    console.log('Registration successful')

    // Redirect to personal info page after successful registration
    router.push('/personal-info')
  } catch (error) {
    console.error('Registration failed:', error)
    // Error is already stored in authStore.error
  }
}

const handleGoogleSignUp = () => {
  console.log('Google sign up clicked')
  // Implement Google OAuth registration logic
  // After successful Google registration, also redirect to personal info
  router.push('/personal-info')
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
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.register-title {
  text-align: center;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.register-form {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.checkbox-group {
  margin-bottom: 2rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  line-height: 1.5;
}

.checkbox-input {
  margin: 0;
  transform: scale(1.2);
  accent-color: #4a90e2;
}

.checkbox-text {
  color: #2c3e50;
  font-size: 0.9rem;
}

.terms-link {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  color: #357abd;
  text-decoration: underline;
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.register-btn {
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

.register-btn:hover:not(:disabled) {
  background: #357abd;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.register-btn:disabled {
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
  color: #0077ff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.login-link-text:hover {
  color: #0080ff;
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 600px) {
  .register-container {
    padding: 1rem;
  }

  .register-card {
    padding: 2rem;
  }

  .register-title {
    font-size: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.global-error {
  background-color: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
