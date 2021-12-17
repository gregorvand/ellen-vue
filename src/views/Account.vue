<template>
  <div>
    <div v-if="loggedIn" class="logoutButton" @click="logout">Logout</div>
    <TransactionRecord />
    <div class="container max-800">
      <CurrentPayments />
    </div>
    <div>
      <button @click="openPayments"></button>
    </div>
  </div>
</template>

<script>
import CurrentPayments from '../components/CurrentPayments.vue'
import TransactionRecord from '../components/TransactionRecord.vue'
// import PaymentsSubscription from '../components/PaymentsSubscription'
import { mapState } from 'vuex'
import { authComputed } from '@/store/helpers.js'

export default {
  components: { CurrentPayments, TransactionRecord },
  computed: {
    ...authComputed,
    ...mapState(['user']),
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    },
    openPayments() {
      this.$store.dispatch('ui/togglePaymentModal', 'open')
    },
  },
}
</script>

<style lang="scss" scoped>
.logoutButton {
  cursor: pointer;
}
</style>
