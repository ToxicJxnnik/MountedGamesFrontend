<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

// Status bar data
const currentUser = ref({
  name: 'Max Mustermann',
  isLoggedIn: false
})

const systemStatus = ref({
  serverStatus: 'Online',
  lastUpdate: new Date().toLocaleTimeString('de-DE'),
  activeUsers: 42
})

const updateTime = () => {
  systemStatus.value.lastUpdate = new Date().toLocaleTimeString('de-DE')
}

onMounted(() => {
  setInterval(updateTime, 1000)
})

const handleLogout = () => {
  console.log('Logout clicked')
  // Add logout logic here
}

const handleLogin = () => {
  console.log('Logout clicked')
  // Add logout logic here
  router.push('/login')
}
</script>

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
          <span class="last-update">
            Letzte Aktualisierung: {{ systemStatus.lastUpdate }}
          </span>
          <span class="active-users">
            Aktive Benutzer: {{ systemStatus.activeUsers }}
          </span>
        </div>
      </div>

      <div class="status-center">
        <nav class="main-navigation">
          <RouterLink to="/" class="nav-link">Mounted Games</RouterLink>
        </nav>
      </div>

      <div class="status-right">
        <div v-if="currentUser.isLoggedIn" class="user-info">
          <span class="welcome-text">Willkommen, {{ currentUser.name }}</span>
          <button @click="handleLogout" class="logout-btn">Abmelden</button>
        </div>
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
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-text {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.logout-btn,
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

.logout-btn:hover,
.login-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.main-content {
  flex: 1;
  background-color: #f8f9fa;
}
</style>
