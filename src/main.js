import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import CompositionAPI from '@vue/composition-api'
import { provide } from '@vue/composition-api'
import VueMeta from 'vue-meta'

// Globally register all `_base`-prefixed components
import '@/components/_globals'
import dayjs from 'dayjs'

Vue.config.productionTip = false
Vue.use(CompositionAPI)
Vue.use(VueMeta)

Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
})

Vue.filter('unixDate', function (dateDigits) {
  return dayjs.unix(dateDigits).format('D MMMM')
})

new Vue({
  setup() {
    provide('vuex-store', store)
  },
  router,
  store,
  created() {
    const userString = localStorage.getItem('user') // grab user data from local storage
    if (userString) {
      // check to see if there is indeed a user
      const userData = JSON.parse(userString) // parse user data into JSON
      this.$store.commit('user/SET_USER_DATA', userData) // restore user data with Vuex
    }
  },
  render: (h) => h(App),
}).$mount('#app')
