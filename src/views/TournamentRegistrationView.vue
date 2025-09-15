<template>
  <div class="tournament-registration-container">
    <div class="registration-card">
      <div class="card-header">
        <h1 class="title">Turnieranmeldung</h1>
        <p class="subtitle">Reiter anmelden für das Oberösterreich Landesturnier</p>
      </div>

      <form @submit.prevent="handleRegistration" class="registration-form">
        <!-- Rider Information -->
        <div class="section">
          <h3 class="section-title">Reiterinformationen</h3>

          <div class="form-row">
            <div class="form-group">
              <label for="riderName" class="form-label">Name des Reiters</label>
              <input
                id="riderName"
                v-model="form.riderName"
                type="text"
                class="form-input readonly-input"
                readonly
                title="Wird automatisch aus Ihren Kontodaten übernommen"
              />
            </div>

            <div class="form-group">
              <label for="birthDate" class="form-label">Geburtsdatum</label>
              <input
                id="birthDate"
                v-model="form.birthDate"
                type="date"
                class="form-input readonly-input"
                readonly
                title="Wird automatisch aus Ihren Kontodaten übernommen"
              />
            </div>
          </div>

          <!-- Age Category Selection -->
          <div class="form-group">
            <label class="form-label">Altersgruppe*</label>
            <div class="age-category-grid">
              <div
                v-for="category in ageCategories"
                :key="category.value"
                class="age-category-item"
                :class="{ active: form.ageCategory === category.value }"
                @click="form.ageCategory = category.value"
              >
                <span class="category-label">{{ category.label }}</span>
                <span class="category-description">{{ category.description }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Horse Information -->
        <div class="section">
          <h3 class="section-title">Pferdinformationen</h3>

          <div class="form-group">
            <label for="horseName" class="form-label">Name des Pferdes*</label>
            <input
              id="horseName"
              v-model="form.horseName"
              type="text"
              class="form-input"
              placeholder="z.B. Mystique High Batman"
              required
            />
          </div>
        </div>

        <!-- Location Requirements -->
        <div class="section">
          <h3 class="section-title">Platzbedarf</h3>

          <div class="location-grid">
            <div class="location-item">
              <label for="stallSpaces" class="location-label">
                Stellplätze benötigt
              </label>
              <input
                id="stallSpaces"
                v-model.number="form.stallSpaces"
                type="number"
                class="location-input"
                min="0"
                max="10"
                placeholder="Anzahl"
              />
            </div>

            <div class="location-item">
              <label for="campingSpaces" class="location-label">
                Campingplätze benötigt
              </label>
              <input
                id="campingSpaces"
                v-model.number="form.campingSpaces"
                type="number"
                class="location-input"
                min="0"
                max="10"
                placeholder="Anzahl"
              />
            </div>

            <div class="location-item">
              <label for="chargingSpaces" class="location-label">
                E-Ladeplätze benötigt
              </label>
              <input
                id="chargingSpaces"
                v-model.number="form.chargingSpaces"
                type="number"
                class="location-input"
                min="0"
                max="5"
                placeholder="Anzahl"
              />
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="section">
          <h3 class="section-title">Zusätzliche Informationen</h3>

          <div class="form-group">
            <label for="comments" class="form-label">Besondere Wünsche oder Anmerkungen</label>
            <textarea
              id="comments"
              v-model="form.comments"
              class="form-textarea"
              rows="4"
              placeholder="Hier können Sie besondere Wünsche oder wichtige Informationen für die Turnierorganisation eintragen..."
            ></textarea>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="handleCancel">
            Abbrechen
          </button>
          <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
            Anmeldung einreichen
          </button>
        </div>
      </form>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content" @click.stop>
        <div class="success-icon">✓</div>
        <h3>Anmeldung erfolgreich!</h3>
        <p>Ihre Turnieranmeldung wurde erfolgreich eingereicht. Sie erhalten in Kürze eine Bestätigung per E-Mail.</p>
        <button class="btn btn-primary" @click="closeSuccessModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
  comments: ''
})

const showSuccessModal = ref(false)

const ageCategories = [
  {
    value: 'U14',
    label: 'U14',
    description: 'bis 13 Jahre'
  },
  {
    value: 'U16',
    label: 'U16',
    description: '14-15 Jahre'
  },
  {
    value: 'U18',
    label: 'U18',
    description: '16-17 Jahre'
  },
  {
    value: 'OFFEN',
    label: 'Offen',
    description: 'ab 18 Jahre'
  }
]

const isFormValid = computed(() => {
  // values from acc
  return form.value.ageCategory !== '' &&
         form.value.horseName.trim() !== ''
})

const handleRegistration = async () => {
  if (!isFormValid.value) return

  try {
    // fake success
    console.log('Registration data:', form.value)
    await new Promise(resolve => setTimeout(resolve, 1000))

    showSuccessModal.value = true
  } catch (error) {
    console.error('Registration failed:', error)
    // Handle error (show error message)
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

.input-note {
  display: block;
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
  font-style: italic;
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
