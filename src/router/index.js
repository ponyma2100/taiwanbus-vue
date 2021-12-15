import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CityBus from '../views/CityBus.vue'
import BusRoute from '../views/BusRoute.vue'
import Favorite from '../views/Favorite.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/citybus/:city',
    name: 'CityBus',
    component: CityBus,
    props: true
  },
  {
    path: '/citybus/:city/:routeName&:routeUID',
    name: 'BusRoute',
    component: BusRoute,
    props: true
  },
  {
    path: '/favorite',
    name: 'Favorite',
    component: Favorite,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
