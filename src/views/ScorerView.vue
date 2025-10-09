<template>
  <div class="referee-container">
    <Card class="referee-card">
      <template #header>
        <div class="card-header">
          <h1 class="title">{{ $t('referee.livePositioning') || 'Live Positioning' }}</h1>
          <div class="header-info">
            <Tag :value="currentHeat" severity="info" class="heat-tag"></Tag>
            <Tag value="Live" severity="success" class="live-tag"></Tag>
          </div>
        </div>
      </template>

      <template #content>
        <!-- Heat Selection -->
        <div class="controls">
          <div class="form-group">
            <label class="form-label">{{ $t('referee.selectHeat') || 'Select Heat' }}</label>
            <Select
              v-model="selectedHeat"
              :options="availableHeats"
              optionLabel="label"
              optionValue="value"
              placeholder="Select Heat"
              @change="loadHeatParticipants"
              fluid
            />
          </div>
          <Button
            :label="$t('referee.savePositions') || 'Save Positions'"
            icon="pi pi-save"
            @click="savePositions"
            :disabled="!hasChanges"
            severity="success"
            size="large"
          />
        </div>

        <Divider />

        <!-- Position Labels -->
        <div class="position-labels">
          <div
            v-for="position in participants.length"
            :key="position"
            class="position-label"
          >
            {{ position }}.
          </div>
        </div>

        <!-- Horizontal Draggable Helmets using VueDraggable -->
        <div class="helmets-track">
          <draggable
            v-model="participants"
            item-key="id"
            class="helmets-container"
            :animation="300"
            ghost-class="ghost"
            drag-class="dragging"
          >
            <template #item="{ element }">
              <div
                class="helmet-item"
                :style="{ backgroundColor: element.color }"
              />
            </template>
          </draggable>
        </div>

        <!-- Empty State -->
        <div v-if="participants.length === 0" class="empty-state">
          <i class="pi pi-users" style="font-size: 3rem; color: #ccc;"></i>
          <p>{{ $t('referee.noParticipants') || 'No participants in this heat' }}</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import Card from 'primevue/card'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'

interface Participant {
  id: number
  color: string
  originalPosition?: number
}

const currentHeat = ref('Heat 8')
const selectedHeat = ref('heat-8')
const participants = ref<Participant[]>([
  { id: 1, color: '#FF6B6B', originalPosition: 1 }, // Red
  { id: 2, color: '#4ECDC4', originalPosition: 2 }, // Turquoise
  { id: 3, color: '#FFD93D', originalPosition: 3 }, // Yellow
  { id: 4, color: '#6BCF7F', originalPosition: 4 }, // Green
  { id: 5, color: '#A78BFA', originalPosition: 5 }, // Purple
  { id: 6, color: '#F97316', originalPosition: 6 }, // Orange
])

const originalOrder = ref<Participant[]>([])

const availableHeats = [
  { label: 'Heat 7 - Completed', value: 'heat-7' },
  { label: 'Heat 8 - Live', value: 'heat-8' },
  { label: 'Heat 9 - Upcoming', value: 'heat-9' },
]

const hasChanges = computed(() => {
  if (originalOrder.value.length !== participants.value.length) return false
  return participants.value.some((p, idx) => p.id !== originalOrder.value[idx].id)
})

const loadHeatParticipants = () => {
  originalOrder.value = JSON.parse(JSON.stringify(participants.value))
  console.log('Loading heat:', selectedHeat.value)
  // In real app: fetch from API
}

const savePositions = async () => {
  console.log('Saving positions:', participants.value.map((p, idx) => ({
    id: p.id,
    color: p.color,
    position: idx + 1
  })))

  // In real app: send to API
  // await axios.post(`/api/heats/${selectedHeat.value}/positions`, ...)

  originalOrder.value = JSON.parse(JSON.stringify(participants.value))
  alert('Positions saved successfully!')
}

// Initialize
loadHeatParticipants()
</script>

<style scoped>
.referee-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 1rem;
}

.referee-card {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.title {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  color: white;
}

.header-info {
  display: flex;
  gap: 0.5rem;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.position-labels {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 0 1rem;
}

.position-label {
  width: 120px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.helmets-track {
  background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 2rem 1rem;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
}

.helmets-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: nowrap;
  padding: 0 1rem;
}

.helmet-item {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  cursor: move;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 4px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.helmet-item:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.helmet-item:active {
  cursor: grabbing;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
  text-align: center;
}

@media (max-width: 1024px) {
  .helmets-container {
    flex-wrap: wrap;
  }

  .position-labels {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .card-header {
    padding: 1.5rem;
  }

  .title {
    font-size: 1.4rem;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .helmet-item {
    width: 100px;
    height: 100px;
  }

  .position-label {
    width: 100px;
    font-size: 1.2rem;
  }

  .helmets-track {
    padding: 1.5rem 0.5rem;
  }
}

/* Optimized for iPad */
@media (hover: none) and (pointer: coarse) {
  .helmet-item {
    width: 140px;
    height: 140px;
  }

  .position-label {
    width: 140px;
    font-size: 1.8rem;
  }

  .helmets-track {
    padding: 3rem 1rem;
  }
}
</style>
