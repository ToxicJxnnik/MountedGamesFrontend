<template>
  <div class="callback-container">
    <div class="loading">
      <div class="spinner"></div>
      <p>Processing authentication...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// This component doesn't need any logic for popup auth
// Auth0 handles the callback automatically
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.loading {
  text-align: center;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a90e2;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
