<template>
  <div>
    <h3>Current Subscriptions</h3>
    <div v-for="sub in subscriptionsAndCards" :key="sub.id">
      <div v-for="plan in sub.items.data" :key="plan.id">
        You will be charged for {{ plan.quantity }} credits every
        {{ plan.plan.interval }}
      </div>
      <span class="card-brand">{{ sub.card.brand }}</span> card to be charged:
      <br />
      Expires: {{ sub.card.exp_month }} / {{ sub.card.exp_year }} <br />
      Ending: {{ sub.card.last4 }}
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      subscriptionsAndCards: [],
      storedCards: [],
      currentSubscriptions: [],
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

      console.log(cardsAndSubsResult)

      this.storedCards = cardsAndSubsResult.data.cards
      this.currentSubscriptions = cardsAndSubsResult.data.subscriptions

      // finds the associated card by payment ID and merges the result so that we have
      // array of subscriptions and their payment method details in one place
      const mergeById = (a1, a2) =>
        a1.map((sub) => ({
          ...a2.find((item) => item.id === sub.default_payment_method && item),
          ...sub,
        }))

      const combinedSubscriptionResult = mergeById(
        cardsAndSubsResult.data.subscriptions.data,
        cardsAndSubsResult.data.cards
      )

      this.subscriptionsAndCards = combinedSubscriptionResult
      console.log(combinedSubscriptionResult)
    },
  },
}
</script>

<style lang="scss" scoped>
.card-brand {
  font-weight: 400;
  text-transform: capitalize;
}
</style>
