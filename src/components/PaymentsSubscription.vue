<template>
  <div class="form-container">
    Subscriptions....
    <div class="credit-selection">
      <div v-for="valueAmount in creditValues" :key="'radio-' + valueAmount.id">
        <input
          type="radio"
          :value="valueAmount.value"
          :id="'credit-selector-' + valueAmount.id"
          v-model="chargeCredits"
        />
        <label :for="'credit-selector-' + valueAmount.id">{{
          valueAmount.value
        }}</label>
      </div>
    </div>

    <br />
    <div class="summary">Credits to purchase: {{ chargeCredits }} <br /></div>
    <div class="stripe-card-form">
      <div class="card-inputs">
        <label>Card Number</label>
        <div id="card" class="card"></div>
        <span id="card-error">{{ cardError }}</span>
      </div>
      <button
        id="custom-button"
        @click="chargeCard"
        :disabled="chargeCredits == 0"
      >
        <span v-if="chargeCredits == 0">Select Credits</span>
        <span v-else>Pay ${{ chargeCredits * 30 }}</span>
        <!-- TODO: API-based real-time cost of tokens !-->
      </button>
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
    return {
      token: null,
      card: null,
      chargeCredits: 0,
      creditValues: [
        // these will eventually come from API
        { id: 1, value: 10 },
        { id: 2, value: 20 },
        { id: 3, value: 50 },
        { id: 4, value: 100 },
      ],
      cardError: '',
      isProcessing: false,
    }
  },
  computed: {
    stripeElements() {
      return this.$stripe.elements()
    },
    ...mapState(['user', 'credits']),
    ...mapGetters('credits', ['currentCredits']),
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
    async chargeCard() {
      const customer = await this.createStripeCustomer()
      console.log('customer?', customer)
      const { token, error } = await this.$stripe.createToken(this.card)
      if (error) {
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
          quantity: parseInt(this.chargeCredits),
        },
      })
      const makeCharge = await this.$stripe.confirmCardPayment(
        createSubscription.data.clientSecret,
        {
          payment_method: {
            card: this.card,
            billing_details: {
              email: this.user.user.email,
            },
          },
          receipt_email: 'gregor+receipt@ellen.me',
        }
      )

      if (makeCharge.error) {
        const notification = {
          type: 'error',
          message: `Oh no, we were not able to process the payment for this reason: ${makeCharge.error.message}`,
        }
        this.$store.dispatch('notification/add', notification, {
          root: true,
        })
        this.isProcessing = false
      } else {
        const notification = {
          type: 'success',
          message:
            'Great, we just added credits to your account, they should show up shortly',
        }
        this.isProcessing = false
        this.$store.dispatch('notification/add', notification, {
          root: true,
        })
        let currentBalance = this.$store.getters['credits/currentCredits']
        currentBalance = parseInt(currentBalance) + parseInt(this.chargeCredits)
        this.$store.dispatch('credits/setBalance', currentBalance)

        this.card.clear()
        this.cardError = ''
        this.chargeCredits = 0
      }
    },
    async createStripeCustomer() {
      // we create the customer when user clicks credits, since we can preempt we will then need the customer
      return await axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}/create-stripe-customer`,
      })
    },
  },
}
</script>

<style scoped lang="scss">
.form-container {
  position: relative;
  width: 100%;
  max-width: 500px;

  .credit-selection {
    display: flex;
    width: 100%;
    > div {
      display: flex;
      flex-basis: 45%;
    }
  }

  > div {
    color: black !important;

    input {
      color: black !important;
    }

    input[type='radio'] {
      display: none;

      &:checked {
        + label {
          background-color: $color-ellen-brand;
        }
      }
    }
  }
}

.credit-selection {
  label {
    cursor: pointer;
    display: flex;
    border: solid $color-black 2px;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 2px;
    border-radius: 5px;

    &:hover {
      background-color: $color-ellen-brand;
    }
  }
}

.summary {
  text-align: left;
}

.stripe-card-form {
  background-color: #fbfbfb;
  padding: 10px;
  border-radius: $border-radius;
  width: 100%;

  button {
    width: 100%;
    max-width: 100%;
  }
}

.loading-coin {
  top: 0;
  width: 100%;
  position: absolute;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.9);

  > img {
    width: 100%;
  }
}
</style>
