<template>
  <div class="forgot-password-container">
    <Card class="forgot-password-card">
      <template #title>
        <h2 class="forgot-password-title">{{ $t('auth.forgotPasswordTitle') }}</h2>
      </template>
      <template #content>
        <div v-if="!emailSent" class="forgot-password-form">
          <p class="description">{{ $t('auth.forgotPasswordDescription') }}</p>

          <form @submit.prevent="handleSubmit" class="reset-form">
            <div class="form-group">
              <label for="email" class="form-label">{{ $t('auth.email') }}</label>
              <InputText
                id="email"
                v-model="email"
                type="email"
                :placeholder="$t('auth.emailPlaceholder')"
                :disabled="isLoading"
                fluid
              />
            </div>

            <Message v-if="error" severity="error" :closable="false">
              {{ error }}
            </Message>

            <Button
              type="submit"
              :label="isLoading ? $t('auth.sending') : $t('auth.sendResetLink')"
              :loading="isLoading"
              :disabled="!isEmailValid"
              class="w-full"
            />
          </form>

          <Divider />

          <div class="back-to-login">
            <router-link to="/login" class="back-link">
              <i class="pi pi-arrow-left"></i>
              <span>{{ $t('auth.backToLogin') }}</span>
            </router-link>
          </div>
        </div>

        <!-- Success State -->
        <div v-else class="success-state">
          <div class="success-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <h3>{{ $t('auth.emailSentTitle') }}</h3>
          <p class="success-message">
            {{ $t('auth.emailSentMessage', { email: email }) }}
          </p>
          <p class="resend-info">
            {{ $t('auth.didntReceiveEmail') }}
            <button @click="handleResend" :disabled="resendCooldown > 0" class="resend-button">
              {{ resendCooldown > 0
              ? $t('auth.resendIn', { seconds: resendCooldown })
              : $t('auth.resendEmail')
              }}
            </button>
          </p>
          <Button
            :label="$t('auth.backToLogin')"
            severity="secondary"
            outlined
            class="w-full mt-3"
            @click="$router.push('/login')"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Divider from 'primevue/divider'

const router = useRouter()

const email = ref('')
const isLoading = ref(false)
const error = ref('')
const emailSent = ref(false)
const resendCooldown = ref(0)
let cooldownInterval: ReturnType<typeof setInterval> | null = null

const isEmailValid = computed(() => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email.value)
})

const handleSubmit = async () => {
  if (!isEmailValid.value) return

  error.value = ''
  isLoading.value = true

  try {
    await authService.requestPasswordReset(email.value)
    emailSent.value = true
    startResendCooldown()
  } catch (err: any) {
    error.value = err.message || 'Failed to send reset email. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleResend = async () => {
  if (resendCooldown.value > 0) return
  await handleSubmit()
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownInterval) {
      clearInterval(cooldownInterval)
      cooldownInterval = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.forgot-password-card {
  width: 100%;
  max-width: 450px;
}

.forgot-password-title {
  text-align: center;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
}

.description {
  color: #6b7280;
  text-align: center;
  margin-bottom: 0;
  line-height: 1.6;
}

.forgot-password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.reset-form {
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

.back-to-login {
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #357abd;
}

.success-state {
  text-align: center;
}

.success-icon {
  margin: 0 auto 1.5rem;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #e8f5e9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon i {
  font-size: 3rem;
  color: #27ae60;
}

.success-state h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
}

.success-message {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.resend-info {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 1rem 0;
}

.resend-button {
  background: none;
  border: none;
  color: #4a90e2;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  padding: 0;
  transition: color 0.2s ease;
}

.resend-button:hover:not(:disabled) {
  color: #357abd;
}

.resend-button:disabled {
  color: #9ca3af;
  cursor: not-allowed;
  text-decoration: none;
}

@media (max-width: 600px) {
  .forgot-password-container {
    padding: 1rem;
  }

  .forgot-password-title {
    font-size: 1.5rem;
  }

  .success-icon {
    width: 60px;
    height: 60px;
  }

  .success-icon i {
    font-size: 2rem;
  }
}
</style>
