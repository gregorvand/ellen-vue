<template>
  <div>
    <div v-if="loggedIn" class="logoutButton" @click="logout">Logout</div>
    <PaymentsSubscription />
    <CurrentPayments />
  </div>
</template>

<script>
import CurrentPayments from '../components/CurrentPayments.vue'
import PaymentsSubscription from '../components/PaymentsSubscription'
import { mapState } from 'vuex'
import { authComputed } from '@/store/helpers.js'

export default {
  components: { CurrentPayments, PaymentsSubscription },
  computed: {
    ...authComputed,
    ...mapState(['user']),
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    },
  },
}
</script>

<style lang="scss" scoped>
.logoutButton {
  cursor: pointer;
}
</style>
