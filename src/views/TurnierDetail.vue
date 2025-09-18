<template>
  <div class="tournament-container">
    <h1>Landesturnier OÖ</h1>

    <!-- Runde 1 -->
    <div class="round">
      <div class="round-header" @click="toggle(1)">
        <h2>Qualifikationsrunde 1</h2>
        <span>{{ openRound === 1 ? '▲' : '▼' }}</span>
      </div>
      <div v-if="openRound === 1" class="round-body">
        <p>Keine Heats vorhanden</p>
      </div>
    </div>

    <!-- Runde 2 -->
    <div class="round">
      <div class="round-header" @click="toggle(2)">
        <h2>Qualifikationsrunde 2 - In Gang</h2>
        <span>{{ openRound === 2 ? '▲' : '▼' }}</span>
      </div>
      <div v-if="openRound === 2" class="round-body">
        <div class="heats">
          <div v-for="heat in heatsRound2" :key="heat.id" class="heat">
            <h3>
              Heat {{ heat.id }}
              <span
                class="status"
                :class="{
                  done: heat.status === 'Abgeschlossen',
                  live: heat.status === 'Live',
                  upcoming: heat.status === 'Anstehend'
                }"
              >
                ({{ heat.status }})
              </span>
            </h3>
            <ul>
              <li v-for="p in heat.participants" :key="p.pos">
                <span class="pos">{{ p.pos }}.</span>
                <span class="name">{{ p.name }}</span>
                <span class="points" v-if="p">{{ p }} Punkte</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Runde 3 -->
    <div class="round">
      <div class="round-header" @click="toggle(3)">
        <h2>Qualifikationsrunde 3</h2>
        <span>{{ openRound === 3 ? '▲' : '▼' }}</span>
      </div>
      <div v-if="openRound === 3" class="round-body">
        <p>Keine Heats vorhanden</p>
      </div>
    </div>

    <!-- Finale -->
    <div class="round">
      <div class="round-header" @click="toggle(4)">
        <h2>Finale</h2>
        <span>{{ openRound === 4 ? '▲' : '▼' }}</span>
      </div>
      <div v-if="openRound === 4" class="round-body">
        <p>Keine Heats vorhanden</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const openRound = ref<number | null>(null)

function toggle(round: number) {
  openRound.value = openRound.value === round ? null : round
}

const heatsRound2 = [
  {
    id: 7,
    status: 'Abgeschlossen',
    participants: [
      { pos: 1, name: 'Lisa Schmidt', points: 87 },
      { pos: 2, name: 'Tom Weber', points: 92 },
      { pos: 3, name: 'Emma Fischer', points: 95 }
    ]
  },
  {
    id: 8,
    status: 'Live',
    participants: [
      { pos: 1, name: 'Sarah Müller' },
      { pos: 2, name: 'Jonas Wagner' }
    ]
  }
]
</script>

<style scoped>
/* Weißer Hintergrund */
.tournament-container {
  max-width: 1200px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
  background: #fff;
  color: #000;
}

/* Runde-Karten */
.round {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #f5f5f5;
}

/* Header */
.round-header {
  display: flex;
  justify-content: space-between;
  background: #eaeaea;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-weight: bold;
  color: #000;
}

/* Body */
.round-body {
  padding: 1rem;
  background: #fff;
  color: #000;
}

/* Heats */
.heats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.heat {
  flex: 1;
  min-width: 250px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.75rem;
  color: #000;
}

.heat h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #000;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin: 0.25rem 0;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #111;
}

.pos {
  font-weight: bold;
  margin-right: 0.5rem;
}

.name {
  flex: 1;
}

.points {
  font-weight: bold;
  color: #444;
}

/* Status Farben */
.status.done {
  color: green;
}
.status.live {
  color: orange;
}
.status.upcoming {
  color: blue;
}
</style>
