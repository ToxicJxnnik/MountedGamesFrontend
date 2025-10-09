<template>
  <div class="tournament-registration-container">
    <Card class="registration-card">
      <template #header>
        <div class="card-header">
          <h1 class="title">{{ $t('tournament.tournamentRegistration') }}</h1>
          <p class="subtitle">{{ $t('tournament.registerRiderSubtitle') }}</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleRegistration" class="registration-form">
          <!-- Rider Information -->
          <Panel :header="$t('registration.riderInformation')" :toggleable="false">
            <div class="form-row">
              <div class="form-group">
                <label for="riderName" class="form-label">{{ $t('registration.riderName') }}</label>
                <InputText
                  id="riderName"
                  v-model="form.riderName"
                  readonly
                  :title="$t('registration.autoFromAccount')"
                  fluid
                />
              </div>

              <div class="form-group">
                <label for="birthDate" class="form-label">{{ $t('registration.birthDate') }}</label>
                <InputText
                  id="birthDate"
                  v-model="form.birthDate"
                  readonly
                  :title="$t('registration.autoFromAccount')"
                  fluid
                />
              </div>
            </div>

            <!-- Age Category Selection -->
            <div class="form-group">
              <label class="form-label">{{ $t('registration.ageCategory') }}</label>
              <div class="age-category-grid">
                <div
                  v-for="category in ageCategories"
                  :key="category.value"
                  class="age-category-item"
                  :class="{ active: form.ageCategory === category.value }"
                  @click="form.ageCategory = category.value"
                >
                  <span class="category-label">{{
                    $t(`registration.ageCategories.${category.value}`)
                  }}</span>
                  <span class="category-description">{{
                    $t(`registration.ageCategories.${category.value}Description`)
                  }}</span>
                </div>
              </div>
            </div>
          </Panel>

          <!-- Horse Information -->
          <Panel :header="$t('registration.horseInformation')" :toggleable="false" class="mt-4">
            <div class="form-group">
              <label for="horseName" class="form-label">{{ $t('registration.horseName') }}</label>
              <InputText
                id="horseName"
                v-model="form.horseName"
                :placeholder="$t('registration.horseNamePlaceholder')"
                fluid
              />
            </div>
          </Panel>

          <!-- Location Requirements -->
          <Panel :header="$t('registration.spaceRequirements')" :toggleable="false" class="mt-4">
            <div class="location-grid">
              <div class="form-group">
                <label for="stallSpaces" class="form-label">{{
                  $t('registration.stallSpaces')
                }}</label>
                <InputNumber
                  id="stallSpaces"
                  v-model="form.stallSpaces"
                  :min="0"
                  :max="10"
                  showButtons
                  fluid
                />
              </div>

              <div class="form-group">
                <label for="campingSpaces" class="form-label">{{
                  $t('registration.campingSpaces')
                }}</label>
                <InputNumber
                  id="campingSpaces"
                  v-model="form.campingSpaces"
                  :min="0"
                  :max="10"
                  showButtons
                  fluid
                />
              </div>

              <div class="form-group">
                <label for="chargingSpaces" class="form-label">{{
                  $t('registration.chargingSpaces')
                }}</label>
                <InputNumber
                  id="chargingSpaces"
                  v-model="form.chargingSpaces"
                  :min="0"
                  :max="5"
                  showButtons
                  fluid
                />
              </div>
            </div>
          </Panel>

          <!-- Additional Information -->
          <Panel
            :header="$t('registration.additionalInformation')"
            :toggleable="false"
            class="mt-4"
          >
            <div class="form-group">
              <label for="comments" class="form-label">{{
                $t('registration.specialWishes')
              }}</label>
              <Textarea
                id="comments"
                v-model="form.comments"
                rows="4"
                :placeholder="$t('registration.specialWishesPlaceholder')"
                fluid
              />
            </div>
          </Panel>

          <!-- Error Display -->
          <Message v-if="errorMessage" severity="error" :closable="false" class="mt-4">
            <h4>{{ $t('registration.registrationError') }}</h4>
            <p>{{ errorMessage }}</p>
            <div v-if="errorDetails" class="error-details">
              <pre>{{ errorDetails }}</pre>
            </div>
          </Message>

          <!-- Form Actions -->
          <div class="form-actions">
            <Button
              type="button"
              :label="$t('registration.cancel')"
              severity="secondary"
              outlined
              @click="handleCancel"
            />
            <Button
              type="submit"
              :label="
                isSubmitting ? $t('registration.submitting') : $t('registration.submitRegistration')
              "
              :loading="isSubmitting"
              :disabled="!isFormValid"
            />
          </div>
        </form>
      </template>
    </Card>

    <!-- Success Modal -->
    <Dialog v-model:visible="showSuccessModal" modal :closable="false" :style="{ width: '400px' }">
      <template #header>
        <div class="success-header">
          <i class="pi pi-check-circle success-icon"></i>
          <h3>{{ $t('registration.registrationSuccess') }}</h3>
        </div>
      </template>
      <p>{{ $t('registration.registrationSuccessMessage') }}</p>
      <template #footer>
        <Button :label="$t('registration.ok')" @click="closeSuccessModal" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Panel from 'primevue/panel'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Dialog from 'primevue/dialog'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

interface RegistrationForm {
  riderName: string
  birthDate: string
  ageCategory: string
  horseName: string
  stallSpaces: number
  campingSpaces: number
  chargingSpaces: number
  comments: string
}

const form = ref<RegistrationForm>({
  riderName: 'Dane',
  birthDate: '2001-09-11',
  ageCategory: '',
  horseName: '',
  stallSpaces: 0,
  campingSpaces: 0,
  chargingSpaces: 0,
  comments: '',
})

const showSuccessModal = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')

const ageCategories = [{ value: 'U14' }, { value: 'U16' }, { value: 'U18' }, { value: 'OFFEN' }]

const isFormValid = computed(() => {
  return form.value.ageCategory !== '' && form.value.horseName.trim() !== ''
})

const getAuthToken = () => {
  return authStore.token
}

const handleRegistration = async () => {
  if (!isFormValid.value) return

  errorMessage.value = ''
  errorDetails.value = ''
  isSubmitting.value = true

  try {
    const token = getAuthToken()
    if (!token) {
      errorMessage.value = t('registration.errors.mustBeLoggedIn')
      isSubmitting.value = false
      return
    }

    const registrationData = {
      ageCategory: form.value.ageCategory,
      horseName: form.value.horseName,
      stallSpaces: form.value.stallSpaces,
      campingSpaces: form.value.campingSpaces,
      chargingSpaces: form.value.chargingSpaces,
      comments: form.value.comments,
    }

    console.log('Sending registration data:', registrationData)

    const response = await axios.post(
      'http://localhost:8080/api/event/1/register',
      registrationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    console.log('Registration successful:', response.data)
    showSuccessModal.value = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Registration failed:', error)

    if (error.response) {
      console.log('Error status:', error.response.status)
      console.log('Error data:', error.response.data)

      if (error.response.status === 401) {
        errorMessage.value = t('auth.sessionExpired')
      } else if (error.response.status === 400) {
        if (error.response.data.errors) {
          const errors = Object.entries(error.response.data.errors)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map(([field, messages]: [string, any]) => `${field}: ${messages.join(', ')}`)
            .join('\n')
          errorMessage.value = t('registration.errors.validationError')
          errorDetails.value = errors
        } else {
          errorMessage.value = error.response.data.message || 'Ungültige Anfrage'
          errorDetails.value = JSON.stringify(error.response.data, null, 2)
        }
      } else {
        errorMessage.value = t('registration.errors.serverError', {
          status: error.response.status,
          message: error.response.data.message || 'Unbekannter Fehler',
        })
        errorDetails.value = JSON.stringify(error.response.data, null, 2)
      }
    } else if (error.request) {
      errorMessage.value = t('registration.errors.noResponse')
    } else {
      errorMessage.value = t('registration.errors.requestError', { message: error.message })
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/')
}
</script>

<style scoped>
.tournament-registration-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem;
}

.registration-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  background-color: #4a90e2;
  color: white;
  padding: 2rem;
  text-align: center;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: white;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  color: white;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.age-category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.age-category-item {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.age-category-item:hover {
  border-color: #4a90e2;
  background: #f8f9fa;
}

.age-category-item.active {
  border-color: #4a90e2;
  background: #e3f2fd;
}

.category-label {
  display: block;
  font-weight: 600;
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.category-description {
  display: block;
  font-size: 0.85rem;
  color: #666;
}

.location-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.error-details {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 0.5rem;
  margin-top: 0.5rem;
}

.error-details pre {
  margin: 0;
  font-size: 0.8rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.success-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.success-icon {
  font-size: 3rem;
  color: #27ae60;
}

.success-header h3 {
  margin: 0;
}

@media (max-width: 768px) {
  .tournament-registration-container {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .age-category-grid {
    grid-template-columns: 1fr 1fr;
  }

  .location-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .title {
    font-size: 1.5rem;
  }

  .card-header {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .age-category-grid {
    grid-template-columns: 1fr;
  }
}
</style>
