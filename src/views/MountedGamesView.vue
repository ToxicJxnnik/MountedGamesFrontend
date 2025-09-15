<template>
  <div class="mounted-games">
        <!-- Main Content -->
    <main class="main-content">
      <!-- Current Tournament Section -->
      <section class="current-tournament">
        <h2>Aktuelles Turnier:</h2>
        <div class="tournament-card">
          <h3>{{ currentTournament.name }}</h3>
          <div class="tournament-details">
            <table class="tournament-table">
              <thead>
              <tr>
                <th>Turnier</th>
                <th>Datum</th>
                <th>Platz</th>
                <th>Regelplatz</th>
                <th>Details</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="round in currentTournament.rounds" :key="round.name">
                <td>{{ round.name }}</td>
                <td>{{ round.time }}</td>
                <td>{{ round.place }}</td>
                <td><router-link to="/tournament-details" class="login-link-text">
            Details
          </router-link></td>
                <td><router-link to="/tournament-details" class="login-link-text">
            Details
          </router-link></td>
              </tr>
              <tr class="highlight">
                <td colspan="2">Heat 1<br>Heat 2<br>Heat 3</td>
                <td>30:10<br>30:30<br>10:00</td>
                <td colspan="2"></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Upcoming Tournaments Section -->
      <section class="upcoming-tournaments">
        <h2>Bevorstehende Turniere:</h2>
        <div class="tournament-cards">
          <div v-for="tournament in upcomingTournaments" :key="tournament.name" class="tournament-card">
            <h3>{{ tournament.name }}</h3>
            <p>{{ tournament.date }}<br>{{ tournament.location }}</p>
            <p v-if="tournament.registrationDeadline">Anmelden bis: {{ tournament.registrationDeadline }}</p>
            <p v-if="tournament.registrationStart">Anmelden ab: {{ tournament.registrationStart }}</p>
            <button
              v-if="tournament.canRegister"
              @click="handleRegister(tournament)"
              class="register-btn"
            >
              <router-link to="/tournament-login" class="login-link-text"> Anmelden </router-link>
            </button>
            <button
              v-else
              class="register-btn"
              disabled
            >
              Anmelden ab {{ tournament.registrationStart }}
            </button>
          </div>
        </div>
        <div class="account-notice">
          <p>Bei neugierigen mit account →<br>
            Anmelden Funktion<br>
            Anmelden ohne Account →<br>
            Popup "Anmelden oder Registrieren"</p>
        </div>
      </section>

      <!-- Past Tournaments Section -->
      <section class="past-tournaments">
        <h2>Vergangene Turniere:</h2>
        <table class="past-tournaments-table">
          <thead>
          <tr>
            <th>Turnier</th>
            <th>Datum</th>
            <th>Pferd</th>
            <th>Platzierung</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="tournament in pastTournaments" :key="tournament.name + tournament.date">
            <td>{{ tournament.name }}</td>
            <td>{{ tournament.date }}</td>
            <td>{{ tournament.horse }}</td>
            <td>{{ tournament.placement }}</td>
          </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// TypeScript interfaces
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

// Reactive data
const currentTournament = ref<CurrentTournament>({
  name: "Landesturnier Österreich, 2025 Q3 CPN",
  rounds: [
    { name: "Qualifikationsrunde 1", time: "8:00", place: "Regelplatz 1" },
    { name: "Qualifikationsrunde 2", time: "14:00", place: "Regelplatz 1" },
    { name: "Qualifikationsrunde 3", time: "10:00", place: "Regelplatz 1" },
    { name: "Halbfinale", time: "13:00", place: "Regelplatz 1" },
    { name: "Finale", time: "12:00", place: "Regelplatz 1" }
  ]
})

const upcomingTournaments = ref<UpcomingTournament[]>([
  {
    name: "Oberösterr. Landesturnier",
    date: "20.04.2025",
    location: "Dandorf, Güstrow",
    registrationDeadline: "Geben Sie 36",
    canRegister: true
  },
  {
    name: "Reichenhaller Gemeindeturnier",
    date: "12.12.2025",
    location: "Dandorf, Güstrow",
    registrationStart: "01.02.2025",
    canRegister: false
  },
  {
    name: "Freistädter Race",
    date: "15.03.2026",
    location: "Dandorf, Güstrow",
    registrationStart: "01.03.2026",
    canRegister: false
  }
])

const pastTournaments = ref<PastTournament[]>([
  {
    name: "Wildeshäuser Bezirksturnier 2024",
    date: "16.06.2024",
    horse: "Cara",
    placement: "1. Platz"
  },
  {
    name: "Reichenhaller Mounted Games 2011",
    date: "12.04.2011",
    horse: "Elvira",
    placement: "16. Platz"
  },
  {
    name: "Nordelbischer Solas Plus MG 2010",
    date: "02.08.2010",
    horse: "Stefan",
    placement: "4. Platz"
  },
  {
    name: "Saarländischer Dorfmeisterschaft 2009",
    date: "24.02.2009",
    horse: "Sabine",
    placement: "24. Platz"
  },
  {
    name: "Österr. Weihnachtsturnier 2009",
    date: "31.01.2009",
    horse: "Michael",
    placement: "2. Platz"
  }
])

// Methods
const handleRegister = (tournament: UpcomingTournament) => {
  console.log('Registering for tournament:', tournament.name)
  // Add registration logic here
}

onMounted(() => {
  console.log('Mounted Games component mounted')
})
</script>

<style scoped>
.mounted-games {
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  font-family: Arial, sans-serif;
  color: #2c3e50;
}

.header {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

.user-section {
  position: relative;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dropdown {
  display: flex;
  gap: 0.5rem;
}

.dropdown-btn {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-btn:hover {
  background: rgba(255,255,255,0.3);
}

.main-content {
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.current-tournament,
.upcoming-tournaments,
.past-tournaments {
  margin-bottom: 3rem;
}

.current-tournament h2,
.upcoming-tournaments h2,
.past-tournaments h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #4a90e2;
  padding-bottom: 0.5rem;
}

.tournament-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
  color: #2c3e50;
}

.tournament-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.tournament-card p {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.tournament-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.tournament-table th,
.tournament-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
  color: #2c3e50;
}

.tournament-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.tournament-table tr:hover {
  background-color: #f8f9fa;
}

.tournament-table tr.highlight {
  background-color: #e3f2fd;
}

.tournament-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.register-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.register-btn:hover:not(:disabled) {
  background-color: #357abd;
}

.register-btn:disabled {
  background-color: #bbb;
  cursor: not-allowed;
}

.account-notice {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
  color: #856404;
}

.past-tournaments-table {
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-collapse: collapse;
}

.past-tournaments-table th,
.past-tournaments-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
  color: #2c3e50;
}

.past-tournaments-table th {
  background-color: #4a90e2;
  color: white;
  font-weight: 600;
}

.past-tournaments-table tr:hover {
  background-color: #f8f9fa;
}

/* Ensure all text has good contrast */
h1, h2, h3, h4, h5, h6, p, span, div, td, th {
  color: #2c3e50;
}

@media (max-width: 768px) {
.login-link-text {
  color: #0077ff;        /* default link color */
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.login-link-text:hover {
  color: #0080ff;        /* hover color */
  text-decoration: underline;
}

.login-link-text:visited {
  color: #0056b3;        /* override browser green visited color */
}
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .main-content {
    padding: 1rem;
  }

  .tournament-cards {
    grid-template-columns: 1fr;
  }

  .tournament-table,
  .past-tournaments-table {
    font-size: 0.9rem;
  }
}
  .tournament-table th,
  .tournament-table td,
  .past-tournaments-table th,
  .past-tournaments-table td {
    padding: 0.5rem;
  }

</style>
