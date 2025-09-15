<template>
  <div class="tournament-container">
    <h1>Landesturnier OÖ</h1>

    <!-- Qualifikationsrunde 1 -->
    <div class="round">
      <h2>Qualifikationsrunde 1</h2>
    </div>

    <!-- Qualifikationsrunde 2 -->
    <div class="round">
      <h2>Qualifikationsrunde 2 - In Gang</h2>

      <div class="heats">
        <div class="heat" v-for="heat in heats" :key="heat.id">
          <h3>Heat {{ heat.id }} <span v-if="heat.status">({{ heat.status }})</span></h3>

          <div class="participant" v-for="p in heat.participants" :key="p.name">
            <span class="pos">{{ p.position }}</span>
            <span class="name">{{ p.name }}</span>
            <span class="team">{{ p.team }}</span>
            <span class="points">{{ p.points ? p.points + ' Punkte' : '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Qualifikationsrunde 3 -->
    <div class="round">
      <h2>Qualifikationsrunde 3</h2>
    </div>

    <!-- Finale -->
    <div class="round">
      <h2>Finale</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Participant {
  position: number
  name: string
  team: string
  points?: number
}

interface Heat {
  id: number
  status?: string
  participants: Participant[]
}

// Hardcoded data basierend auf Screenshot
const heats: Heat[] = [
  {
    id: 7,
    status: "Abgeschlossen",
    participants: [
      { position: 1, name: "Lisa Schmidt", team: "FV München", points: 87 },
      { position: 2, name: "Tom Weber", team: "RC Stuttgart", points: 92 },
      { position: 3, name: "Emma Fischer", team: "Ponyhof Dresden", points: 95 },
      { position: 4, name: "Paul Müller", team: "RV Hannover", points: 89 },
      { position: 5, name: "Nina Bauer", team: "RC Berlin", points: 91 },
      { position: 6, name: "Max Koch", team: "Team Austria", points: 88 }
    ]
  },
  {
    id: 8,
    status: "LIVE",
    participants: [
      { position: 1, name: "Sarah Müller", team: "RC Berlin" },
      { position: 2, name: "Jonas Wagner", team: "FV Dresden" },
      { position: 3, name: "Lena Hoffmann", team: "Team Schweiz" },
      { position: 4, name: "Felix Braun", team: "RC Frankfurt" },
      { position: 5, name: "Julia Klein", team: "RC Hannover" },
      { position: 6, name: "Robert Jung", team: "FV Leipzig" }
    ]
  },
  {
    id: 9,
    status: "Anstehend",
    participants: [
      { position: 1, name: "Anna Schmidt", team: "FV Aachen" },
      { position: 2, name: "David Mayer", team: "RC Hamburg" },
      { position: 3, name: "Sophie Wolf", team: "RV Leipzig" },
      { position: 4, name: "Michael Lang", team: "FV Berlin" },
      { position: 5, name: "Petra Richter", team: "RC Hamburg" },
      { position: 6, name: "Stefan Huber", team: "Ponyhof Dresden" }
    ]
  }
]
</script>

<style scoped>
.tournament-container {
  max-width: 900px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
}

.round {
  margin-bottom: 2rem;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 10px;
}

.heats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.heat {
  flex: 1;
  min-width: 250px;
  background: #e8f5e9;
  border-radius: 8px;
  padding: 0.5rem;
}

.heat h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.participant {
  display: flex;
  justify-content: space-between;
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.pos {
  font-weight: bold;
}

.name {
  flex: 1;
  margin-left: 0.5rem;
}

.team {
  margin-left: 0.5rem;
  font-style: italic;
  color: #555;
}

.points {
  margin-left: 0.5rem;
  font-weight: bold;
}
</style>
