<template>
  <div class="subscriptions-wrapper">
    <h3>Current Subscriptions</h3>
    <div v-if="subscriptionsAndCards.length > 0">
      <div v-for="sub in subscriptionsAndCards" :key="sub.id">
        <div v-for="plan in sub.items.data" :key="plan.id">
          You will be charged for {{ plan.quantity }} credits every
          {{ plan.plan.interval }}
        </div>
        <span class="card-brand">{{ sub.card.brand }}</span> card to be charged:
        <br />
        Expires: {{ sub.card.exp_month }} / {{ sub.card.exp_year }} <br />
        Ending: {{ sub.card.last4 }}

        <button class="cancel" @click="cancelSubscription(sub.id)">
          Cancel this subscription
        </button>
      </div>
    </div>
    <div v-if="subscriptionsAndCards.length <= 0 && !this.loading">
      No active subscriptions
    </div>
    <div v-if="this.loading"><BaseLoadingSpinner /></div>
  </div>
</template>

<script>
import axios from 'axios'
import { mergeById } from '@/helpers/data_utilities'
export default {
  data() {
    return {
      subscriptionsAndCards: [],
      storedCards: [],
      currentSubscriptions: [],
      loading: true,
    }
  },
  mounted() {
    this.checkCardsAndSubscriptions()
  },
  methods: {
    async checkCardsAndSubscriptions() {
      const cardsAndSubsResult = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/current-cards-subscriptions`,
      })

      this.storedCards = cardsAndSubsResult.data.cards
      this.currentSubscriptions = cardsAndSubsResult.data.subscriptions

      // finds the associated card by payment ID and merges the result so that we have
      // array of subscriptions and their payment method details in one place

      const combinedSubscriptionResult = mergeById(
        cardsAndSubsResult.data.subscriptions.data,
        cardsAndSubsResult.data.cards
      )

      this.subscriptionsAndCards = combinedSubscriptionResult
      this.loading = false
    },
    async cancelSubscription(subId) {
      try {
        console.log(subId)
        const cancelSubscription = await axios({
          method: 'delete',
          url: `${process.env.VUE_APP_API_URL}/subscription`,
          data: {
            subId: subId,
          },
        })

        if (cancelSubscription.data.status == 'canceled') {
          this.checkCardsAndSubscriptions()
          const notification = {
            type: 'success',
            message: `We have just canceled this subscription and no further payments will be taken`,
          }
          this.$store.dispatch('notification/add', notification, {
            root: true,
          })
        } else {
          const notification = {
            type: 'error',
            message: `We were unable to cancel this - please contact Ellen support`,
          }
          this.$store.dispatch('notification/add', notification, {
            root: true,
          })
        }
      } catch (e) {}
    },
  },
}
</script>

<style lang="scss" scoped>
.card-brand {
  font-weight: 400;
  text-transform: capitalize;
}

.subscriptions-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cancel {
  background-color: $color-ellen-light-gray;
  border: solid 2px salmon;
  color: $color-black;
  max-width: 200px;
  font-size: rem-calc(12px);
  margin: 20px auto;
}
</style>
