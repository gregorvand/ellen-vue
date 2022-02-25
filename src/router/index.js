import Vue from 'vue'
import VueRouter from 'vue-router'
import VueGtm from '@gtm-support/vue2-gtm'
import EventCreate from '../views/EventCreate.vue'
import EventList from '../views/EventList.vue'
import EventShow from '../views/EventShow.vue'

import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard.vue'
import Onboarding from '@/views/Onboarding.vue'
import Account from '@/views/Account.vue'
import RegisterUser from '@/views/RegisterUser.vue'
import LoginUser from '@/views/LoginUser.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import CompanySheet from '@/views/CompanySheet.vue'
import EarningsFeed from '@/views/EarningsFeed.vue'
import Static from '@/views/Static.vue'

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
    path: '/onboarding',
    name: 'onboarding',
    component: Onboarding,
    meta: { requiresAuth: true },
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
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: '/reset-password/:token',
    name: 'reset-password',
    component: ResetPassword,
  },
  {
    path: '/company/:id',
    name: 'company',
    component: CompanySheet,
  },
  {
    path: '/earnings',
    name: 'earnings',
    component: EarningsFeed,
    meta: { requiresAuth: true },
  },
  {
    path: '/terms',
    name: 'terms',
    component: Static,
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
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('user')
  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    next('/')
  }
  next()
})

Vue.use(VueGtm, {
  id: 'GTM-N25JZLT', // Your GTM single container ID, array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy'] or array of objects [{id: 'GTM-xxxxxx', queryParams: { gtm_auth: 'abc123', gtm_preview: 'env-4', gtm_cookies_win: 'x'}}, {id: 'GTM-yyyyyy', queryParams: {gtm_auth: 'abc234', gtm_preview: 'env-5', gtm_cookies_win: 'x'}}], // Your GTM single container ID or array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy']
  queryParams: {
    // Add URL query string when loading gtm.js with GTM ID (required when using custom environments)
    // gtm_auth: 'AB7cDEf3GHIjkl-MnOP8qr',
    // gtm_preview: 'env-4',
    // gtm_cookies_win: 'x',
  },
  defer: false, // Script can be set to `defer` to speed up page load at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible). Defaults to false, so the script is loaded `async` by default
  enabled: true, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
  debug: true, // Whether or not display console logs debugs (optional)
  loadScript: true, // Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components) (optional)
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
  trackOnNextTick: false, // Whether or not call trackView in Vue.nextTick
})

export default router
