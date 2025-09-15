// App.vue
<template>
  <div id="app">
    <!-- Status Bar -->
    <header class="status-bar">
      <div class="status-left">
        <div class="system-info">
          <span class="server-status" :class="{ online: systemStatus.serverStatus === 'Online' }">
            <span class="status-dot"></span>
            Server: {{ systemStatus.serverStatus }}
          </span>
          <span class="last-update"> Letzte Aktualisierung: {{ systemStatus.lastUpdate }} </span>
          <span class="active-users"> Aktive Benutzer: {{ systemStatus.activeUsers }} </span>
        </div>
      </div>

      <div class="status-center">
        <nav class="main-navigation">
          <RouterLink to="/" class="nav-link">Mounted Games</RouterLink>
        </nav>
      </div>

      <div class="status-right">
        <!-- Show user info when logged in -->
        <div v-if="authStore.isAuthenticated && authStore.user" class="user-info">
          <div class="user-menu" @click="toggleDropdown" ref="userMenuTrigger">
            <div class="user-avatar">
              {{ userInitials }}
            </div>
            <span class="welcome-text"
              >Willkommen, {{ authStore.user.firstName }} {{ authStore.user.lastName }}</span
            >
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

          <!-- Dropdown Menu -->
          <div v-if="showDropdown" class="dropdown-menu" ref="dropdownMenu">
            <div class="dropdown-header">
              <div class="dropdown-user-info">
                <div class="dropdown-avatar">{{ userInitials }}</div>
                <div class="dropdown-details">
                  <div class="dropdown-name">
                    {{ authStore.user.firstName }} {{ authStore.user.lastName }}
                  </div>
                  <div class="dropdown-email">{{ authStore.user.email }}</div>
                </div>
              </div>
            </div>
            <hr class="dropdown-divider" />
            <router-link to="/profile" class="dropdown-item" @click="closeDropdown">
              <svg width="16" height="16" viewBox="0 0 24 24" class="dropdown-item-icon">
                <path
                  fill="currentColor"
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
              Profil
            </router-link>
            <router-link to="/settings" class="dropdown-item" @click="closeDropdown">
              <svg width="16" height="16" viewBox="0 0 24 24" class="dropdown-item-icon">
                <path
                  fill="currentColor"
                  d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"
                />
              </svg>
              Einstellungen
            </router-link>
            <hr class="dropdown-divider" />
            <button @click="handleLogout" class="dropdown-item logout-item">
              <svg width="16" height="16" viewBox="0 0 24 24" class="dropdown-item-icon">
                <path
                  fill="currentColor"
                  d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                />
              </svg>
              Abmelden
            </button>
          </div>
        </div>

        <!-- Show login button when not logged in -->
        <div v-else class="login-info">
          <button @click="handleLogin" class="login-btn">Anmelden</button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// Dropdown state
const showDropdown = ref(false)
const userMenuTrigger = ref<HTMLElement>()
const dropdownMenu = ref<HTMLElement>()

// Status bar data
const systemStatus = ref({
  serverStatus: 'Online',
  lastUpdate: new Date().toLocaleTimeString('de-DE'),
  activeUsers: 42,
})

// Computed properties
const userInitials = computed(() => {
  if (!authStore.user) return ''
  const firstName = authStore.user.firstName || ''
  const lastName = authStore.user.lastName || ''
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
})

// Methods
const updateTime = () => {
  systemStatus.value.lastUpdate = new Date().toLocaleTimeString('de-DE')
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    closeDropdown()
    console.log('Logout successful')
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const handleLogin = () => {
  console.log('Login clicked')
  router.push('/login')
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (
    showDropdown.value &&
    userMenuTrigger.value &&
    dropdownMenu.value &&
    !userMenuTrigger.value.contains(event.target as Node) &&
    !dropdownMenu.value.contains(event.target as Node)
  ) {
    closeDropdown()
  }
}

onMounted(() => {
  // Initialize auth state
  authStore.initAuth()

  // Set up time update interval
  setInterval(updateTime, 1000)

  // Set up click outside handler
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.status-bar {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  position: relative;
}

.status-left {
  flex: 1;
  display: flex;
  align-items: center;
}

.system-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.server-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #e74c3c;
  animation: pulse 2s infinite;
}

.server-status.online .status-dot {
  background-color: #27ae60;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.last-update,
.active-users {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
}

.status-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.main-navigation {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-weight: 500;
  border: 1px solid transparent;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.status-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}

.user-info {
  position: relative;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-menu:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.welcome-text {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
}

.dropdown-icon {
  transition: transform 0.2s ease;
  color: rgba(255, 255, 255, 0.7);
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  min-width: 280px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.dropdown-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4a90e2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.dropdown-details {
  flex: 1;
}

.dropdown-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.dropdown-email {
  color: #6c757d;
  font-size: 0.8rem;
}

.dropdown-divider {
  border: none;
  border-top: 1px solid #e9ecef;
  margin: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #495057;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 0.85rem;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.dropdown-item-icon {
  color: #6c757d;
  flex-shrink: 0;
}

.logout-item {
  color: #dc3545;
}

.logout-item:hover {
  background: #fff5f5;
  color: #dc3545;
}

.logout-item .dropdown-item-icon {
  color: #dc3545;
}

.login-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.main-content {
  flex: 1;
  background-color: #f8f9fa;
}

/* Responsive design */
@media (max-width: 768px) {
  .status-bar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .status-left,
  .status-center,
  .status-right {
    flex: none;
    width: 100%;
  }

  .status-center {
    justify-content: flex-start;
  }

  .status-right {
    justify-content: flex-start;
  }

  .system-info {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .dropdown-menu {
    left: 0;
    right: 0;
    min-width: auto;
  }
}
</style>
