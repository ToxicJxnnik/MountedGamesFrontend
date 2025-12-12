<template>
  <div class="reset-password-container">
    <Card class="reset-password-card">
      <template #title>
        <h2 class="reset-password-title">{{ $t('auth.resetPasswordTitle') }}</h2>
      </template>
      <template #content>
        <div v-if="!resetSuccess" class="reset-password-form">
          <p class="description">{{ $t('auth.resetPasswordDescription') }}</p>

          <!-- Token Invalid State -->
          <div v-if="tokenError" class="error-state">
            <div class="error-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3>{{ $t('auth.invalidTokenTitle') }}</h3>
            <p class="error-message">{{ $t('auth.invalidTokenMessage') }}</p>
            <Button
              :label="$t('auth.requestNewLink')"
              class="w-full mt-3"
              @click="$router.push('/forgot-password')"
            />
          </div>

          <!-- Reset Form -->
          <form v-else @submit.prevent="handleSubmit" class="password-reset-form">
            <div class="form-group">
              <label for="password" class="form-label">{{ $t('auth.newPassword') }}</label>
              <Password
                id="password"
                v-model="password"
                :placeholder="$t('auth.passwordPlaceholder')"
                :disabled="isLoading"
                toggleMask
                :feedback="true"
                fluid
              >
                <template #footer>
                  <div class="password-requirements">
                    <p class="requirement-title">{{ $t('auth.passwordRequirements') }}</p>
                    <ul>
                      <li :class="{ valid: hasMinLength }">
                        <svg v-if="hasMinLength" class="check-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <svg v-else class="x-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        {{ $t('auth.minLength') }}
                      </li>
                      <li :class="{ valid: hasUpperCase }">
                        <svg v-if="hasUpperCase" class="check-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <svg v-else class="x-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        {{ $t('auth.uppercase') }}
                      </li>
                      <li :class="{ valid: hasLowerCase }">
                        <svg v-if="hasLowerCase" class="check-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <svg v-else class="x-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        {{ $t('auth.lowercase') }}
                      </li>
                      <li :class="{ valid: hasNumber }">
                        <svg v-if="hasNumber" class="check-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <svg v-else class="x-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        {{ $t('auth.number') }}
                      </li>
                    </ul>
                  </div>
                </template>
              </Password>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">{{
                  $t('auth.confirmPassword')
                }}</label>
              <Password
                id="confirmPassword"
                v-model="confirmPassword"
                :placeholder="$t('auth.confirmPasswordPlaceholder')"
                :disabled="isLoading"
                :feedback="false"
                toggleMask
                fluid
              />
              <small v-if="passwordMismatch" class="p-error">
                {{ $t('auth.passwordMismatch') }}
              </small>
            </div>

            <Message v-if="error" severity="error" :closable="false">
              {{ error }}
            </Message>

            <Button
              type="submit"
              :label="isLoading ? $t('auth.resetting') : $t('auth.resetPassword')"
              :loading="isLoading"
              :disabled="!isFormValid"
              class="w-full"
            />
          </form>
        </div>

        <!-- Success State -->
        <div v-else class="success-state">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3>{{ $t('auth.passwordResetSuccessTitle') }}</h3>
          <p class="success-message">{{ $t('auth.passwordResetSuccessMessage') }}</p>
          <Button
            :label="$t('auth.goToLogin')"
            class="w-full"
            @click="$router.push('/login')"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services/authService'
import Card from 'primevue/card'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

const router = useRouter()
const route = useRoute()

const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref('')
const resetSuccess = ref(false)
const tokenError = ref(false)
const resetToken = ref('')

// Password validation
const hasMinLength = computed(() => password.value.length >= 8)
const hasUpperCase = computed(() => /[A-Z]/.test(password.value))
const hasLowerCase = computed(() => /[a-z]/.test(password.value))
const hasNumber = computed(() => /[0-9]/.test(password.value))

const isPasswordValid = computed(() => {
  return hasMinLength.value && hasUpperCase.value && hasLowerCase.value && hasNumber.value
})

const passwordMismatch = computed(() => {
  return confirmPassword.value && password.value !== confirmPassword.value
})

const isFormValid = computed(() => {
  return (
    isPasswordValid.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value &&
    !tokenError.value
  )
})

onMounted(async () => {
  // Get token from URL query parameter
  const token = route.query.token as string
  const email = route.query.email as string

  if (!token) {
    tokenError.value = true
    return
  }

  resetToken.value = token

  // Verify token validity
  try {
    await authService.verifyResetToken(email, token)
  } catch (err) {
    tokenError.value = true
  }
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  error.value = ''
  isLoading.value = true

  try {
    await authService.resetPassword(resetToken.value, password.value)
    resetSuccess.value = true
  } catch (err: any) {
    error.value = err.message || 'Failed to reset password. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.reset-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.reset-password-card {
  width: 100%;
  max-width: 450px;
}

.reset-password-title {
  text-align: center;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
}

.description {
  color: #6b7280;
  text-align: center;
  line-height: 1.6;
}

.reset-password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.password-reset-form {
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

.password-requirements {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-top: 0.5rem;
}

.requirement-title {
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
}

.password-requirements ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.password-requirements li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.85rem;
}

.password-requirements li.valid {
  color: #27ae60;
}

.check-icon {
  color: #27ae60;
  flex-shrink: 0;
}

.x-icon {
  color: #dc3545;
  flex-shrink: 0;
}

.error-state,
.success-state {
  text-align: center;
}

.error-icon,
.success-icon {
  margin: 0 auto 1.5rem;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon {
  background: #fee;
  color: #dc3545;
}

.success-icon {
  background: #e8f5e9;
  color: #27ae60;
}

.error-state h3,
.success-state h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
}

.error-message,
.success-message {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

@media (max-width: 600px) {
  .reset-password-container {
    padding: 1rem;
  }

  .reset-password-title {
    font-size: 1.5rem;
  }

  .error-icon,
  .success-icon {
    width: 60px;
    height: 60px;
  }

  .error-icon svg,
  .success-icon svg {
    width: 32px;
    height: 32px;
  }
}
</style>
