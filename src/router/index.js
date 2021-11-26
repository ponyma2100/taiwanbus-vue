import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CityBus from '../views/CityBus.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/citybus/:city',
    name: 'CityBus',
    component: CityBus
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
