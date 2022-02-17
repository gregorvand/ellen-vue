<template>
  <div class="payments form-container">
    <div class="credit-selection">
      <div
        class="credit-tap-area"
        v-for="valueAmount in creditValues"
        :key="'radio-' + valueAmount.id"
      >
        <input
          type="radio"
          :value="valueAmount"
          :id="'credit-selector-' + valueAmount.id"
          v-model="chargeCredits"
        />
        <label
          class="selector-label"
          :class="valueAmount.title"
          :for="'credit-selector-' + valueAmount.id"
          ><h3>{{ valueAmount.title }}</h3>
          <h4>{{ valueAmount.product }}</h4>
          <p class="blurb">{{ valueAmount.blurb }}</p>
          <span class="price-label"
            >${{ valueAmount.value * valueAmount.price }}/mo</span
          >
          <p class="small-label">{{ valueAmount.upsell }}</p>
        </label>
      </div>
    </div>
    <div class="stored-card-wrapper" v-if="storedCards.length > 0">
      <h4>Stored cards</h4>
      <div class="overflow-y">
        <div v-for="storedCard in storedCards" :key="storedCard.id">
          <div class="card">
            <input
              type="radio"
              v-model="selectedCardId"
              :value="storedCard.id"
              :id="'card-selector-' + storedCard.id"
            />
            <label :for="'card-selector-' + storedCard.id">
              <span class="card-brand">{{ storedCard.card.brand }}</span>
              <span class="card-hidden-digits">....</span
              >{{ storedCard.card.last4 }}
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="stripe-card-form">
      <div class="card-inputs" :class="{ hide: selectedCardId !== '' }">
        <label>Payment Card details</label>
        <!-- form populates from library -->
        <div id="card" class="card"></div>
        <span id="card-error">{{ cardError }}</span>
      </div>
      <button
        id="custom-button"
        @click="chargeCard"
        :disabled="chargeCredits == 0"
      >
        <span v-if="chargeCredits == 0">Select Plan</span>
        <span v-else
          >Subscribe ${{ chargeCredits.value * chargeCredits.price }} /month ({{
            chargeCredits.value
          }}
          credits)</span
        >
        <!-- TODO: API-based real-time cost of tokens? Could not see immediately how to do that -->
      </button>
      <span class="subscribe-blurb">
        Can be cancelled at any time from your dashboard.
        <br />
        All payments and stored card details handled securely by
        <a href="https://stripe.com/" target="_blank">Stripe</a>
      </span>
    </div>
    <div v-if="isProcessing" class="loading-coin">
      <strong>Processing payment</strong>
      <img
        src="@/assets/coin_gif.gif"
        class="coin"
        alt="welcome to ELLEN insights"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    const optionOne = {
      id: 1,
      value: 10,
      price: 30,
      title: 'starter',
      product: '10 credits',
      blurb: `e.g. Follow 5 companies each month and have 5 remaining credits to explore historical data.`,
    }
    const optionTwo = {
      id: 2,
      value: 30,
      price: 20,
      title: 'pro',
      product: '30 credits',
      blurb:
        'e.g. Follow 10 companies each month and have 20 remaining credits to explore historical data.',
      upsell: 'Most Popular',
    }
    return {
      token: null,
      card: null,
      chargeCredits: optionTwo, // set default to pro
      creditValues: [optionOne, optionTwo],
      cardError: '',
      isProcessing: false,
      selectedCardId: '',
      cardsLoading: true,
    }
  },
  computed: {
    stripeElements() {
      return this.$stripe.elements()
    },
    ...mapState(['user', 'credits']),
    ...mapState(['ui', 'payment_modal']),
    ...mapGetters('credits', ['currentCredits']),
    ...mapState('stripeData', ['storedCards']),
  },
  mounted() {
    // Style Object documentation here: https://stripe.com/docs/js/appendix/style
    this.card = this.stripeElements.create('card', {
      iconStyle: 'solid',
      style: {
        base: {
          iconColor: '#c4f0ff',
          color: '#05769C',
          fontWeight: 500,
          fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',

          ':-webkit-autofill': {
            color: '#fce883',
          },
          '::placeholder': {
            color: '#87BBFD',
          },
        },
        invalid: {
          iconColor: '#FFC7EE',
          color: '#FFC7EE',
        },
      },
    })
    this.card.mount('#card')
  },
  beforeDestroy() {
    this.card.destroy()
  },
  methods: {
    async getCreditPricing() {},
    async chargeCard() {
      const { token, error } = await this.$stripe.createToken(this.card)

      // error card input form unless user has since selected a stored card
      if (error && this.selectedCardId === '') {
        // handle error here
        this.cardError = error.message
        return
      }
      this.isProcessing = true

      // handle the token
      // send it to your server
      const createSubscription = await axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}/create-subscription`,
        data: {
          priceId: `${process.env.VUE_APP_STRIPE_SUBSCRIPTION_ID}`,
          quantity: parseInt(this.chargeCredits.value),
        },
      })

      let paymentMethod = {}

      if (this.selectedCardId === '') {
        paymentMethod = {
          payment_method: {
            card: this.card,
            billing_details: {
              email: this.user.user.email,
            },
          },
        }
      } else {
        paymentMethod = {
          payment_method: this.selectedCardId,
        }
      }

      const makeCharge = await this.$stripe.confirmCardPayment(
        createSubscription.data.clientSecret,
        paymentMethod
      )

      if (makeCharge.error) {
        const notification = {
          type: 'error',
          message: `We were not able to process the payment for this reason: ${makeCharge.error.message}`,
        }
        this.$store.dispatch('notification/add', notification, {
          root: true,
        })
        this.isProcessing = false
        this.selectedCardId = ''
      } else {
        const notification = {
          type: 'success',
          message: `${this.chargeCredits.value} credits added! 💰`,
        }
        this.isProcessing = false
        this.$store.dispatch('notification/add', notification, {
          root: true,
        })
        let currentBalance = this.$store.getters['credits/currentCredits']
        currentBalance =
          parseInt(currentBalance) + parseInt(this.chargeCredits.value)
        this.$store.dispatch('credits/setBalance', currentBalance)

        this.$store.dispatch('ui/togglePaymentModal', 'closed')
        this.card.clear()
        this.cardError = ''
        this.chargeCredits = 0
        this.selectedCardId = ''
        this.$store.dispatch('stripeData/getCardsAndSubs')
      }
    },
  },
}
</script>

<style scoped lang="scss">
h3 {
  font-size: 17px;
  text-transform: capitalize;
}
h4 {
  font-size: 24px;
}
.selector-label {
  flex-direction: column;
  font-size: 12px;
  padding: 20px;
}

.small-label {
  font-weight: bold;
  color: $color-ellen-dark;
}

.container {
  max-width: 60vw;
}

.pro h3 {
  background-color: $color-ellen-brand-dark;
  color: $color-white;
  padding: 5px 10px;
  border-radius: 10px;
}
</style>
