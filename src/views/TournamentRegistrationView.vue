<template>
  <div class="tournament-registration-container">
    <div class="registration-card">
      <div class="card-header">
        <h1 class="title">{{ $t('tournament.tournamentRegistration') }}</h1>
        <p class="subtitle">{{ $t('tournament.registerRiderSubtitle') }}</p>
      </div>

      <form @submit.prevent="handleRegistration" class="registration-form">
        <!-- Rider Information -->
        <div class="section">
          <h3 class="section-title">{{ $t('registration.riderInformation') }}</h3>

          <div class="form-row">
            <div class="form-group">
              <label for="riderName" class="form-label">{{ $t('registration.riderName') }}</label>
              <input
                id="riderName"
                v-model="form.riderName"
                type="text"
                class="form-input readonly-input"
                readonly
                :title="$t('registration.autoFromAccount')"
              />
            </div>

            <div class="form-group">
              <label for="birthDate" class="form-label">{{ $t('registration.birthDate') }}</label>
              <input
                id="birthDate"
                v-model="form.birthDate"
                type="date"
                class="form-input readonly-input"
                readonly
                :title="$t('registration.autoFromAccount')"
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
        </div>

        <!-- Horse Information -->
        <div class="section">
          <h3 class="section-title">{{ $t('registration.horseInformation') }}</h3>

          <div class="form-group">
            <label for="horseName" class="form-label">{{ $t('registration.horseName') }}</label>
            <input
              id="horseName"
              v-model="form.horseName"
              type="text"
              class="form-input"
              :placeholder="$t('registration.horseNamePlaceholder')"
              required
            />
          </div>
        </div>

        <!-- Location Requirements -->
        <div class="section">
          <h3 class="section-title">{{ $t('registration.spaceRequirements') }}</h3>

          <div class="location-grid">
            <div class="location-item">
              <label for="stallSpaces" class="location-label">{{
                $t('registration.stallSpaces')
              }}</label>
              <input
                id="stallSpaces"
                v-model.number="form.stallSpaces"
                type="number"
                class="location-input"
                min="0"
                max="10"
                :placeholder="$t('registration.quantity')"
              />
            </div>

            <div class="location-item">
              <label for="campingSpaces" class="location-label">{{
                $t('registration.campingSpaces')
              }}</label>
              <input
                id="campingSpaces"
                v-model.number="form.campingSpaces"
                type="number"
                class="location-input"
                min="0"
                max="10"
                :placeholder="$t('registration.quantity')"
              />
            </div>

            <div class="location-item">
              <label for="chargingSpaces" class="location-label">{{
                $t('registration.chargingSpaces')
              }}</label>
              <input
                id="chargingSpaces"
                v-model.number="form.chargingSpaces"
                type="number"
                class="location-input"
                min="0"
                max="5"
                :placeholder="$t('registration.quantity')"
              />
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="section">
          <h3 class="section-title">{{ $t('registration.additionalInformation') }}</h3>

          <div class="form-group">
            <label for="comments" class="form-label">{{ $t('registration.specialWishes') }}</label>
            <textarea
              id="comments"
              v-model="form.comments"
              class="form-textarea"
              rows="4"
              :placeholder="$t('registration.specialWishesPlaceholder')"
            ></textarea>
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="errorMessage" class="error-message">
          <h4>{{ $t('registration.registrationError') }}</h4>
          <p>{{ errorMessage }}</p>
          <div v-if="errorDetails" class="error-details">
            <pre>{{ errorDetails }}</pre>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="handleCancel">
            {{ $t('registration.cancel') }}
          </button>
          <button type="submit" class="btn btn-primary" :disabled="!isFormValid || isSubmitting">
            {{
              isSubmitting ? $t('registration.submitting') : $t('registration.submitRegistration')
            }}
          </button>
        </div>
      </form>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content" @click.stop>
        <div class="success-icon">✓</div>
        <h3>{{ $t('registration.registrationSuccess') }}</h3>
        <p>
          {{ $t('registration.registrationSuccessMessage') }}
        </p>
        <button class="btn btn-primary" @click="closeSuccessModal">
          {{ $t('registration.ok') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n'

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
  riderName: 'Dane', // demo values
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

const ageCategories = [
  {
    value: 'U14',
  },
  {
    value: 'U16',
  },
  {
    value: 'U18',
  },
  {
    value: 'OFFEN',
  },
]

const isFormValid = computed(() => {
  return form.value.ageCategory !== '' && form.value.horseName.trim() !== ''
})

// Get JWT token from localStorage (adjust based on your auth implementation)
const getAuthToken = () => {
  return authStore.token
}

const handleRegistration = async () => {
  if (!isFormValid.value) return

  // Clear previous errors
  errorMessage.value = ''
  errorDetails.value = ''
  isSubmitting.value = true

  try {
    // Get auth token
    const token = getAuthToken()
    if (!token) {
      errorMessage.value = t('registration.errors.mustBeLoggedIn')
      isSubmitting.value = false
      return
    }

    // Prepare the request data - only send fields that backend expects
    const registrationData = {
      ageCategory: form.value.ageCategory,
      horseName: form.value.horseName,
      stallSpaces: form.value.stallSpaces,
      campingSpaces: form.value.campingSpaces,
      chargingSpaces: form.value.chargingSpaces,
      comments: form.value.comments,
    }

    console.log('Sending registration data:', registrationData)

    // Make the API call with authentication headers
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
      // The request was made and the server responded with a status code
      console.log('Error status:', error.response.status)
      console.log('Error data:', error.response.data)

      if (error.response.status === 401) {
        errorMessage.value = t('auth.sessionExpired')
      } else if (error.response.status === 400) {
        // Show validation errors
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
      // The request was made but no response was received
      errorMessage.value = t('registration.errors.noResponse')
    } else {
      // Something happened in setting up the request
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
/* All previous styles remain the same */
.tournament-registration-container {
  min-height: 100vh;
  background-color: #ffffff;
  font-family: Arial, sans-serif;
  color: #2c3e50;
  padding: 2rem;
}

.registration-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
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
  padding: 2rem;
}

.section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #4a90e2;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
  color: #2c3e50;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
}

.readonly-input {
  background-color: #f8f9fa;
  cursor: not-allowed;
  color: #6c757d;
}

.readonly-input:focus {
  border-color: #ddd;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
  color: #2c3e50;
}

.form-textarea:focus {
  outline: none;
  border-color: #4a90e2;
}

.age-category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.age-category-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.age-category-item:hover {
  border-color: #4a90e2;
}

.age-category-item.active {
  border-color: #4a90e2;
  background: #f8f9fa;
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
  gap: 1.5rem;
}

.location-item {
  background: #f8f9fa;
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
}

.location-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  cursor: pointer;
}

.location-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  text-align: center;
  transition: border-color 0.2s;
  box-sizing: border-box;
  color: #2c3e50;
}

.location-input:focus {
  outline: none;
  border-color: #4a90e2;
}

/* New error styling */
.error-message {
  background-color: #ffeaa7;
  border: 1px solid #fdcb6e;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.error-message h4 {
  color: #e17055;
  margin: 0 0 0.5rem 0;
}

.error-message p {
  color: #2d3436;
  margin: 0 0 0.5rem 0;
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
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #357abd;
}

.btn-primary:disabled {
  background-color: #bbb;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #f8f9fa;
  border-color: #ccc;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  margin: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #27ae60;
}

.modal-content h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.modal-content p {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .tournament-registration-container {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
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

  .registration-form {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .age-category-grid {
    grid-template-columns: 1fr;
  }
}
</style>
