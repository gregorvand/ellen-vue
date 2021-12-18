<template>
  <div>
    <div v-if="loggedIn" class="logoutButton" @click="logout">Logout</div>
    <TransactionRecord />
    <div class="container max-800 subscriptions-payments">
      <div class="payment-control">
        <h4>Credit Purchase</h4>
        <p>
          You can subscribe to credits every month or make one-off top ups.
          <br />1 credit buys 1 month of data for a given company.
        </p>
        <button @click="openPayments">Subscribe / Top Up</button>
      </div>
      <div class="subscriptions-column">
        <CurrentPayments />
      </div>
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

.subscriptions-payments {
  display: grid;
  grid-template-columns: 1fr;

  @include breakpoint(medium up) {
    grid-template-columns: 1fr 1fr;
  }

  > div {
    margin: 10px;
  }
}

.payment-control {
  height: 225px;
  background-color: $color-ellen-light-gray;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius;
  flex-direction: column;

  p {
    font-size: 13px;
    padding: 0 70px;
  }
}
</style>
