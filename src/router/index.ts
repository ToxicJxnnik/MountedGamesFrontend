import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/MountedGamesView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/personal-info',
      name: 'personal-info',
      component: () => import('../views/PersonalInfoView.vue'),
    },
    {
      path: "/tournament-details",
      name: "tournament-details",
      component: () => import('../views/TurnierDetail.vue'),
    },
    {
      path: "/tournament-login",
      name: "tournament-login",
      component: () => import('../views/LoginInTournament.vue'),
    }
      path: '/tournament-registration',
      name: 'tournament-registration',
      component: () => import('../views/TournamentRegistrationView.vue'),
    },
  ],
})

export default router
