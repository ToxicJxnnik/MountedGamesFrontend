<template>
  <div class="callback-container">
    <Card class="callback-card">
      <template #content>
        <div class="loading-content">
          <ProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="4"
            animationDuration="1s"
          />
          <p class="loading-text">Processing authentication...</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import ProgressSpinner from 'primevue/progressspinner'

// This component doesn't need any logic for popup auth
// Auth0 handles the callback automatically
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.callback-card {
  min-width: 300px;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
}

.loading-text {
  color: #2c3e50;
  font-size: 1rem;
  margin: 0;
}
</style>
