<template>
  <div class="language-switcher">
    <div class="language-menu" @click="toggleDropdown" ref="languageMenuTrigger">
      <svg class="language-icon" width="16" height="16" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
        />
      </svg>
      <span class="current-language">{{ currentLanguageLabel }}</span>
      <svg
        class="dropdown-icon"
        :class="{ rotated: showDropdown }"
        width="16"
        height="16"
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="M7 10l5 5 5-5z" />
      </svg>
    </div>

    <div v-if="showDropdown" class="language-dropdown" ref="dropdownMenu">
      <button
        v-for="language in availableLanguages"
        :key="language.code"
        @click="changeLanguage(language.code)"
        class="language-option"
        :class="{ active: locale === language.code }"
      >
        <span class="language-flag">{{ language.flag }}</span>
        <span class="language-name">{{ language.name }}</span>
        <svg
          v-if="locale === language.code"
          class="check-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// Dropdown state
const showDropdown = ref(false)
const languageMenuTrigger = ref<HTMLElement>()
const dropdownMenu = ref<HTMLElement>()

// Available languages
const availableLanguages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]

// Computed properties
const currentLanguageLabel = computed(() => {
  const current = availableLanguages.find((lang) => lang.code === locale.value)
  return current?.name || locale.value.toUpperCase()
})

// Methods
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const changeLanguage = (languageCode: string) => {
  locale.value = languageCode
  localStorage.setItem('user-language', languageCode)
  closeDropdown()
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (
    showDropdown.value &&
    languageMenuTrigger.value &&
    dropdownMenu.value &&
    !languageMenuTrigger.value.contains(event.target as Node) &&
    !dropdownMenu.value.contains(event.target as Node)
  ) {
    closeDropdown()
  }
}

onMounted(() => {
  // Load saved language preference
  const savedLanguage = localStorage.getItem('user-language')
  if (savedLanguage && availableLanguages.some((lang) => lang.code === savedLanguage)) {
    locale.value = savedLanguage
  }

  // Set up click outside handler
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.language-switcher {
  position: relative;
}

.language-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
}

.language-menu:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.language-icon {
  color: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

.current-language {
  font-size: 0.85rem;
  font-weight: 500;
  min-width: 60px;
}

.dropdown-icon {
  transition: transform 0.2s ease;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 1000;
  overflow: hidden;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  color: #495057;
  font-size: 0.85rem;
}

.language-option:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.language-option.active {
  background: #e3f2fd;
  color: #1976d2;
}

.language-flag {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.language-name {
  flex: 1;
  font-weight: 500;
}

.check-icon {
  color: #27ae60;
  flex-shrink: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .language-dropdown {
    left: 0;
    right: 0;
    min-width: auto;
  }

  .current-language {
    display: none;
  }
}
</style>
