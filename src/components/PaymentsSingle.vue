<template>
  <div class="payments form-container">
    <div class="credit-selection">
      <div v-for="valueAmount in creditValues" :key="'radio-' + valueAmount.id">
        <input
          type="radio"
          :value="valueAmount"
          :id="'credit-selector-' + valueAmount.id"
          v-model="chargeCredits"
        />
        <label class="selector-label" :for="'credit-selector-' + valueAmount.id"
          ><h3>{{ valueAmount.title }}</h3>
          <h4>{{ valueAmount.product }}</h4>
          <p class="blurb">{{ valueAmount.blurb }}</p>
          <span class="price-label"
            >${{ valueAmount.value * valueAmount.price }}</span
          ></label
        >
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
        @click="chargeCardSingle"
        :disabled="chargeCredits == 0"
      >
        <span v-if="chargeCredits == 0">Select Credits</span>
        <span v-else
          >Purchase {{ chargeCredits.value }} credits (${{
            chargeCredits.value * chargeCredits.price
          }})</span
        >
        <!-- TODO: API-based real-time cost of tokens? Could not see immediately how to do that -->
      </button>
      <span class="subscribe-blurb">
        All payments handled securely by
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
    const multiplier = 1.65
    const optionOne = {
      id: 1,
      value: 10,
      price: 30 * multiplier,
      title: 'Top Up',
      product: '10 credits',
      blurb: `e.g. Access 5 companies and have 5 remaining credits to explore historical data.`,
    }
    return {
      token: null,
      card: null,
      chargeCredits: optionOne,
      creditValues: [optionOne],
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
    async chargeCardSingle() {
      this.isProcessing = true
      // handle the token
      // send it to your server

      const amountToCharge = this.chargeCredits.value * this.chargeCredits.price

      const createIntent = await axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}/create-payment-intent`,
        data: {
          chargeAmount: amountToCharge * 100,
        },
      })

      let paymentMethod = {}

      if (this.selectedCardId === '') {
        paymentMethod = {
          card: this.card,
          billing_details: {
            email: this.user.user.email,
          },
        }
      } else {
        paymentMethod = this.selectedCardId
      }

      const makeCharge = await this.$stripe.confirmCardPayment(
        createIntent.data.clientSecret,
        {
          payment_method: paymentMethod,
          receipt_email: 'gregor+receipt@ellen.me',
        }
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
}
h4 {
  font-size: 24px;
}
.selector-label {
  flex-direction: column;
  font-size: 12px;
  padding: 20px;
}

.container {
  max-width: 60vw;
}

.payments.form-container .credit-selection {
  grid-template-columns: 1fr;
}
</style>
