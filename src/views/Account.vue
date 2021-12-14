<template>
  <div>
    <div v-if="loggedIn" class="logoutButton" @click="logout">Logout</div>
    <TransactionRecord />
    <PaymentsSubscription />
    <CurrentPayments />
  </div>
</template>

<script>
import CurrentPayments from '../components/CurrentPayments.vue'
import TransactionRecord from '../components/TransactionRecord.vue'
import PaymentsSubscription from '../components/PaymentsSubscription'
import { mapState } from 'vuex'
import { authComputed } from '@/store/helpers.js'

export default {
  components: { CurrentPayments, PaymentsSubscription, TransactionRecord },
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
