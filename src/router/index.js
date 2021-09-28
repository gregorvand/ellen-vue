import Vue from 'vue'
import VueRouter from 'vue-router'
import EventCreate from '../views/EventCreate.vue'
import EventList from '../views/EventList.vue'
import EventShow from '../views/EventShow.vue'

import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard.vue'
import Account from '@/views/Account.vue'
import RegisterUser from '@/views/RegisterUser.vue'
import LoginUser from '@/views/LoginUser.vue'
import CompanySheet from '@/views/CompanySheet.vue'
import EarningsFeed from '@/views/EarningsFeed.vue'

import Vue2TouchEvents from 'vue2-touch-events'

Vue.use(VueRouter)
Vue.use(Vue2TouchEvents)

// Stripe set up
import { StripePlugin } from '@vue-stripe/vue-stripe'
const options = {
  pk: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY,
}

Vue.use(StripePlugin, options)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/account',
    name: 'account',
    component: Account,
    meta: { requiresAuth: true },
  },
  {
    path: '/list',
    name: 'event-list',
    component: EventList,
  },
  {
    path: '/event/:id',
    name: 'event-show',
    component: EventShow,
    props: true,
  },
  {
    path: '/event/create',
    name: 'event-create',
    component: EventCreate,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterUser,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginUser,
  },
  {
    path: '/company/:id',
    name: 'company',
    component: CompanySheet,
    meta: { requiresAuth: true },
  },
  {
    path: '/earnings',
    name: 'earnings',
    component: EarningsFeed,
    meta: { requiresAuth: true },
  },
  // {
  //   path: '/payments',
  //   name: 'payments',
  //   component: Payments,
  //   meta: { requiresAuth: true },
  // },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('user')
  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    next('/')
  }
  next()
})

export default router
