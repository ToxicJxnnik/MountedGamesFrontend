<template>
  <div class="personal-info-container">
    <Card class="personal-info-card">
      <template #title>
        <h2 class="form-title">{{ $t('personalInfo.title') }}</h2>
      </template>
      <template #content>
        <form @submit.prevent="handleSave" class="personal-info-form">
          <!-- Personal Information Section -->
          <div class="form-section">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName" class="form-label">{{ $t('personalInfo.firstName') }}</label>
                <InputText id="firstName" v-model="personalForm.firstName" fluid />
              </div>

              <div class="form-group">
                <label for="lastName" class="form-label">{{ $t('personalInfo.lastName') }}</label>
                <InputText id="lastName" v-model="personalForm.lastName" fluid />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="birthDate" class="form-label">{{ $t('personalInfo.birthDate') }}</label>
                <DatePicker
                  id="birthDate"
                  v-model="personalForm.birthDate"
                  dateFormat="yy-mm-dd"
                  showIcon
                  fluid
                />
              </div>

              <div class="form-group">
                <label for="nationality" class="form-label">{{
                  $t('personalInfo.nationality')
                }}</label>
                <Select
                  id="nationality"
                  v-model="personalForm.nationality"
                  :options="nationalityOptions"
                  optionLabel="label"
                  optionValue="value"
                  :placeholder="$t('personalInfo.pleaseSelect')"
                  fluid
                />
              </div>
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">{{ $t('personalInfo.phone') }}</label>
              <InputText
                id="phone"
                v-model="personalForm.phone"
                :placeholder="$t('personalInfo.phonePlaceholder')"
                fluid
              />
            </div>
          </div>

          <!-- Club and Membership Information Section -->
          <Divider />

          <div class="form-section">
            <h3 class="section-title">{{ $t('personalInfo.clubAndMembership') }}</h3>

            <div class="form-group">
              <label for="club" class="form-label">{{ $t('personalInfo.club') }}</label>
              <InputText
                id="club"
                v-model="personalForm.club"
                :placeholder="$t('personalInfo.clubPlaceholder')"
                fluid
              />
              <small class="form-note">{{ $t('personalInfo.clubNote') }}</small>
            </div>

            <div class="form-group">
              <label for="membershipNumber" class="form-label">{{
                $t('personalInfo.membershipNumber')
              }}</label>
              <InputText
                id="membershipNumber"
                v-model="personalForm.membershipNumber"
                :placeholder="$t('personalInfo.membershipPlaceholder')"
                fluid
              />
              <small class="form-note">{{ $t('personalInfo.membershipNote') }}</small>
            </div>

            <div class="form-group">
              <label for="role" class="form-label">{{ $t('personalInfo.role') }}</label>
              <Select
                id="role"
                v-model="personalForm.role"
                :options="roleOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="$t('personalInfo.pleaseSelect')"
                fluid
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <Button
              type="button"
              :label="$t('personalInfo.discard')"
              severity="secondary"
              outlined
              @click="handleDiscard"
              :disabled="isLoading"
            />
            <Button
              type="submit"
              :label="isLoading ? $t('personalInfo.saving') : $t('personalInfo.save')"
              :loading="isLoading"
              :disabled="!isFormValid"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import Divider from 'primevue/divider'

const router = useRouter()
const { t } = useI18n()

const personalForm = reactive({
  firstName: '',
  lastName: '',
  birthDate: null as Date | null,
  nationality: '',
  phone: '',
  club: '',
  membershipNumber: '',
  role: '',
})

const isLoading = ref(false)

const nationalityOptions = [
  { label: t('personalInfo.countries.DE'), value: 'DE' },
  { label: t('personalInfo.countries.AT'), value: 'AT' },
  { label: t('personalInfo.countries.CH'), value: 'CH' },
  { label: t('personalInfo.countries.FR'), value: 'FR' },
  { label: t('personalInfo.countries.IT'), value: 'IT' },
  { label: t('personalInfo.countries.NL'), value: 'NL' },
  { label: t('personalInfo.countries.BE'), value: 'BE' },
  { label: t('personalInfo.countries.DK'), value: 'DK' },
  { label: t('personalInfo.countries.SE'), value: 'SE' },
  { label: t('personalInfo.countries.NO'), value: 'NO' },
  { label: t('personalInfo.countries.other'), value: 'other' },
]

const roleOptions = [
  { label: t('personalInfo.roles.rider'), value: 'rider' },
  { label: t('personalInfo.roles.trainer'), value: 'trainer' },
  { label: t('personalInfo.roles.official'), value: 'official' },
  { label: t('personalInfo.roles.volunteer'), value: 'volunteer' },
  { label: t('personalInfo.roles.parent'), value: 'parent' },
  { label: t('personalInfo.roles.other'), value: 'other' },
]

const isFormValid = computed(() => {
  return (
    personalForm.firstName &&
    personalForm.lastName &&
    personalForm.birthDate &&
    personalForm.nationality &&
    personalForm.club
  )
})

const handleSave = async () => {
  if (!isFormValid.value) {
    return
  }

  isLoading.value = true

  try {
    // Format date to YYYY-MM-DD
    const formattedDate = personalForm.birthDate
      ? new Date(personalForm.birthDate).toISOString().split('T')[0]
      : ''

    const requestData = {
      FirstName: personalForm.firstName,
      LastName: personalForm.lastName,
      DateOfBirth: formattedDate,
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

    router.push('/')
  } catch (error) {
    console.error('Failed to save personal information:', error)
    alert(t('registration.errors.saveError'))
  } finally {
    isLoading.value = false
  }
}

const handleDiscard = () => {
  if (confirm(t('personalInfo.discardConfirm'))) {
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
  width: 100%;
  max-width: 700px;
}

.form-title {
  text-align: center;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
}

.personal-info-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
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

.form-note {
  color: #6b7280;
  font-style: italic;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
}

@media (max-width: 768px) {
  .personal-info-container {
    padding: 1rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
