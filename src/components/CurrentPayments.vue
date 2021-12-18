<template>
  <div class="subscriptions-wrapper">
    <h3>Current Subscriptions</h3>
    <div v-if="cardsAndSubsResult.length > 0">
      <div
        v-for="sub in cardsAndSubsResult"
        :key="sub.id"
        class="subscription-wrapper"
      >
        <div class="plan-details" v-for="plan in sub.items.data" :key="plan.id">
          <strong>{{ plan.quantity }} </strong>credits, each
          {{ plan.plan.interval }}
        </div>

        <h4>Payment method</h4>
        <div class="card" v-if="sub.card">
          <span class="card-brand">{{ sub.card.brand }}</span>
          <span class="card-hidden-digits">....</span>{{ sub.card.last4 }}
        </div>

        <span class="renew-date"
          >This will automatically renew on
          {{ sub.current_period_end | unixDate }}</span
        >

        <button class="cancel" @click="cancelSubscription(sub.id)">
          Cancel this subscription
        </button>
      </div>
    </div>
    <div v-if="cardsAndSubsResult.length <= 0">No active subscriptions</div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('stripeData', ['cardsAndSubsResult']),
  },
  mounted() {
    this.$store.dispatch('stripeData/getCardsAndSubs')
  },
  methods: {
    async cancelSubscription(subId) {
      try {
        const cancelSubscription = await axios({
          method: 'delete',
          url: `${process.env.VUE_APP_API_URL}/subscription`,
          data: {
            subId: subId,
          },
        })

        if (cancelSubscription.data.status === 'canceled') {
          this.$store.dispatch('stripeData/getCardsAndSubs')
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
.plan-details {
  background-color: $color-ellen-brand-bright;
  border-radius: $border-radius;
}
h4 {
  margin: 5px 0 0;
}

.card {
  display: flex;
  align-items: center;
  justify-content: center;

  &-brand {
    font-weight: 400;
    text-transform: capitalize;
  }

  &-hidden-digits {
    font-size: 60px;
    color: $color-ellen-dark;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    line-height: 0;
    padding-bottom: 35px;
    margin: 0 5px 0 10px;
  }
}

$component-width: 100%;
$component-max-width: 400px;

.subscriptions-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: $component-width;
  max-width: $component-max-width;

  .subscription-wrapper {
    border: solid $color-ellen-light-gray 2px;
    border-radius: $border-radius;
    padding: 10px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: $component-max-width;
  }
}

.renew-date {
  display: inline-block;
  font-size: rem-calc(11px);
  width: 100%;
}

.cancel {
  background-color: $color-ellen-light-gray;
  border: solid 2px salmon;
  color: $color-black;
  max-width: 200px;
  font-size: rem-calc(12px);
  margin: 10px auto 0;
}
</style>
