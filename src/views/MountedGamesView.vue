<template>
  <div class="mounted-games">
    <div class="main-content">
      <!-- Current Tournament Section -->
      <Panel :header="$t('tournament.currentTournament')" :toggleable="false" class="mb-4">
        <h3 class="tournament-name">{{ currentTournament.name }}</h3>

        <DataTable :value="currentTournament.rounds" stripedRows>
          <Column field="name" :header="$t('tournament.tournament')"></Column>
          <Column field="time" :header="$t('tournament.date')"></Column>
          <Column field="place" :header="$t('tournament.place')"></Column>
          <Column :header="$t('tournament.regularPlace')">
            <template #body>
              <router-link to="/tournament-details" class="tournament-link">
                {{ $t('tournament.details') }}
              </router-link>
            </template>
          </Column>
          <Column :header="$t('tournament.details')">
            <template #body>
              <router-link to="/tournament-details" class="tournament-link">
                {{ $t('tournament.details') }}
              </router-link>
            </template>
          </Column>
        </DataTable>
      </Panel>

      <!-- Upcoming Tournaments Section -->
      <Panel :header="$t('tournament.upcomingTournaments')" :toggleable="false" class="mb-4">
        <div class="tournament-cards">
          <Card
            v-for="tournament in upcomingTournaments"
            :key="tournament.name"
            class="tournament-card"
          >
            <template #title>{{ tournament.name }}</template>
            <template #content>
              <p class="tournament-info">
                {{ tournament.date }}<br />
                {{ tournament.location }}
              </p>
              <p v-if="tournament.registrationDeadline" class="registration-info">
                {{ $t('tournament.registerUntil') }} {{ tournament.registrationDeadline }}
              </p>
              <p v-if="tournament.registrationStart" class="registration-info">
                {{ $t('tournament.registerFrom') }} {{ tournament.registrationStart }}
              </p>
            </template>
            <template #footer>
              <Button
                v-if="tournament.canRegister"
                @click="handleRegister(tournament)"
                :label="$t('tournament.register')"
                class="w-full"
              />
              <Button
                v-else
                :label="$t('tournament.registerFromDate', { date: tournament.registrationStart })"
                disabled
                class="w-full"
              />
            </template>
          </Card>
        </div>
      </Panel>

      <!-- Past Tournaments Section -->
      <Panel :header="$t('tournament.pastTournaments')" :toggleable="false">
        <DataTable :value="pastTournaments" stripedRows>
          <Column field="name" :header="$t('tournament.tournament')"></Column>
          <Column field="date" :header="$t('tournament.date')"></Column>
          <Column field="horse" :header="$t('tournament.horse')"></Column>
          <Column field="placement" :header="$t('tournament.placement')"></Column>
        </DataTable>
      </Panel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Panel from 'primevue/panel'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

const router = useRouter()

interface TournamentRound {
  name: string
  time: string
  place: string
}

interface CurrentTournament {
  name: string
  rounds: TournamentRound[]
}

interface UpcomingTournament {
  name: string
  date: string
  location: string
  registrationDeadline?: string
  registrationStart?: string
  canRegister: boolean
}

interface PastTournament {
  name: string
  date: string
  horse: string
  placement: string
}

const currentTournament = ref<CurrentTournament>({
  name: 'Landesturnier Österreich, 2025 Q3 CPN',
  rounds: [
    { name: 'Qualifikationsrunde 1', time: '8:00', place: 'Regelplatz 1' },
    { name: 'Qualifikationsrunde 2', time: '14:00', place: 'Regelplatz 1' },
    { name: 'Qualifikationsrunde 3', time: '10:00', place: 'Regelplatz 1' },
    { name: 'Halbfinale', time: '13:00', place: 'Regelplatz 1' },
    { name: 'Finale', time: '12:00', place: 'Regelplatz 1' },
  ],
})

const upcomingTournaments = ref<UpcomingTournament[]>([
  {
    name: 'Oberösterr. Landesturnier',
    date: '20.04.2025',
    location: 'Dandorf, Güstrow',
    registrationDeadline: '30.10.2025',
    canRegister: true,
  },
  {
    name: 'Reichenhaller Gemeindeturnier',
    date: '12.12.2025',
    location: 'Dandorf, Güstrow',
    registrationStart: '01.02.2025',
    canRegister: false,
  },
  {
    name: 'Freistädter Race',
    date: '15.03.2026',
    location: 'Dandorf, Güstrow',
    registrationStart: '01.03.2026',
    canRegister: false,
  },
  {
    name: 'Neufelden Race',
    date: '15.03.2026',
    location: 'Dandorf, Güstrow',
    registrationStart: '01.03.2026',
    canRegister: false,
  },
])

const pastTournaments = ref<PastTournament[]>([
  {
    name: 'Wildeshäuser Bezirksturnier 2024',
    date: '16.06.2024',
    horse: 'Cara',
    placement: '1. Platz',
  },
  {
    name: 'Reichenhaller Mounted Games 2011',
    date: '12.04.2011',
    horse: 'Elvira',
    placement: '16. Platz',
  },
  {
    name: 'Nordelbischer Solas Plus MG 2010',
    date: '02.08.2010',
    horse: 'Stefan',
    placement: '4. Platz',
  },
  {
    name: 'Saarländischer Dorfmeisterschaft 2009',
    date: '24.02.2009',
    horse: 'Sabine',
    placement: '24. Platz',
  },
  {
    name: 'Österr. Weihnachtsturnier 2009',
    date: '31.01.2009',
    horse: 'Michael',
    placement: '2. Platz',
  },
])

const handleRegister = (tournament: UpcomingTournament) => {
  console.log('Registering for tournament:', tournament.name)
  router.push('/tournament-registration')
}

onMounted(() => {
  console.log('Mounted Games component mounted')
})
</script>

<style scoped>
.mounted-games {
  min-height: 100vh;
  width: 100%;
  background-color: #f8f9fa;
  font-family: Arial, sans-serif;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.tournament-name {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.tournament-link {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.tournament-link:hover {
  color: #357abd;
  text-decoration: underline;
}

.tournament-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.tournament-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tournament-info {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.registration-info {
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .tournament-cards {
    grid-template-columns: 1fr;
  }
}
</style>
