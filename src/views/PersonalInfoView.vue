<template>
  <div class="personal-info-container">
    <div class="personal-info-card">
      <h2 class="form-title">Persönliche Informationen</h2>

      <form @submit.prevent="handleSave" class="personal-info-form">
        <!-- Personal Information Section -->
        <div class="form-section">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">Vorname *</label>
              <input
                id="firstName"
                v-model="personalForm.firstName"
                type="text"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="lastName" class="form-label">Nachname *</label>
              <input
                id="lastName"
                v-model="personalForm.lastName"
                type="text"
                class="form-input"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="birthDate" class="form-label">Geburtsdatum *</label>
              <input
                id="birthDate"
                v-model="personalForm.birthDate"
                type="date"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="nationality" class="form-label">Nationalität *</label>
              <select
                id="nationality"
                v-model="personalForm.nationality"
                class="form-select"
                required
              >
                <option value="">Bitte wählen...</option>
                <option value="DE">Deutschland</option>
                <option value="AT">Österreich</option>
                <option value="CH">Schweiz</option>
                <option value="FR">Frankreich</option>
                <option value="IT">Italien</option>
                <option value="NL">Niederlande</option>
                <option value="BE">Belgien</option>
                <option value="DK">Dänemark</option>
                <option value="SE">Schweden</option>
                <option value="NO">Norwegen</option>
                <option value="other">Andere</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="phone" class="form-label">Telefonnummer</label>
            <input
              id="phone"
              v-model="personalForm.phone"
              type="tel"
              class="form-input"
              placeholder="+49 123 456789"
            />
          </div>
        </div>

        <!-- Club and Membership Information Section -->
        <div class="form-section">
          <h3 class="section-title">Vereins- und Mitgliedsinformationen</h3>

          <div class="form-group">
            <label for="club" class="form-label">Verein/Club *</label>
            <input
              id="club"
              v-model="personalForm.club"
              type="text"
              class="form-input"
              placeholder="Name Ihres Reitvereins"
              required
            />
            <p class="form-note">Vereinszugehörigkeit wird bei Turnieren angezeigt</p>
          </div>

          <div class="form-group">
            <label for="membershipNumber" class="form-label">Mitgliedsnummer</label>
            <input
              id="membershipNumber"
              v-model="personalForm.membershipNumber"
              type="text"
              class="form-input"
              placeholder="z.B. FN-Mitgliedsnummer"
            />
            <p class="form-note">Für deutsche/österreichische Reiter erforderlich</p>
          </div>

          <div class="form-group">
            <label for="role" class="form-label">Rolle:</label>
            <select id="role" v-model="personalForm.role" class="form-select">
              <option value="">Bitte wählen...</option>
              <option value="rider">Reiter/in</option>
              <option value="trainer">Trainer/in</option>
              <option value="official">Offizieller</option>
              <option value="volunteer">Helfer/in</option>
              <option value="parent">Elternteil</option>
              <option value="other">Andere</option>
            </select>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" @click="handleDiscard" class="discard-btn" :disabled="isLoading">
            Verwerfen
          </button>
          <button type="submit" class="save-btn" :disabled="isLoading || !isFormValid">
            {{ isLoading ? 'Speichert...' : 'Speichern' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form data
const personalForm = reactive({
  firstName: '',
  lastName: '',
  birthDate: '',
  nationality: '',
  phone: '',
  club: '',
  membershipNumber: '',
  role: '',
})

const isLoading = ref(false)

// Computed properties
const isFormValid = computed(() => {
  return (
    personalForm.firstName &&
    personalForm.lastName &&
    personalForm.birthDate &&
    personalForm.nationality &&
    personalForm.club
  )
})

// Methods
const handleSave = async () => {
  if (!isFormValid.value) {
    return
  }

  isLoading.value = true

  try {
    // Map frontend form data to backend expected format
    const requestData = {
      FirstName: personalForm.firstName,
      LastName: personalForm.lastName,
      DateOfBirth: personalForm.birthDate,
      Nationality: personalForm.nationality,
      PhoneNumber: personalForm.phone,
      Club: personalForm.club,
      FinNumber: personalForm.membershipNumber,
      Role: personalForm.role,
    }

    console.log('Sending request data:', requestData)

    await axios.post('http://localhost:8080/api/information/update', requestData, {
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`,
        'Content-Type': 'application/json',
      },
    })

    // Show success message or redirect
    alert('Persönliche Informationen erfolgreich gespeichert!')

    // Redirect to the main mounted games view
    router.push('/')
  } catch (error) {
    console.error('Failed to save personal information:', error)
    alert('Fehler beim Speichern der Informationen. Bitte versuchen Sie es erneut.')
  } finally {
    isLoading.value = false
  }
}

const handleDiscard = () => {
  // Confirm before discarding
  if (confirm('Möchten Sie wirklich alle Änderungen verwerfen?')) {
    router.push('/')
  }
}
</script>

<style scoped>
.personal-info-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.personal-info-card {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 700px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.form-title {
  text-align: center;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.personal-info-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  border-bottom: 1px solid #e1e8ed;
  padding-bottom: 2rem;
}

.form-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.section-title {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
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

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #fff;
  color: #2c3e50;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.form-input::placeholder {
  color: #a0a0a0;
}

.form-select {
  cursor: pointer;
}

.form-note {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.5rem;
  font-style: italic;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e1e8ed;
}

.discard-btn {
  background: transparent;
  color: #6b7280;
  border: 2px solid #e1e8ed;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.discard-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #d1d5db;
  color: #4b5563;
}

.discard-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.save-btn:hover:not(:disabled) {
  background: #219a52;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.save-btn:disabled {
  background: #bbb;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .personal-info-container {
    padding: 1rem;
  }

  .personal-info-card {
    padding: 2rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .discard-btn,
  .save-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .personal-info-card {
    padding: 1.5rem;
  }
}
</style>
