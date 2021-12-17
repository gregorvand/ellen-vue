<template>
  <div class="form-container">
    <h3>Buy credits (single)</h3>
    <div class="credit-selection">
      <div v-for="valueAmount in creditValues" :key="'radio-' + valueAmount.id">
        <input
          type="radio"
          :value="valueAmount"
          :id="'credit-selector-' + valueAmount.id"
          v-model="chargeCredits"
        />
        <label :for="'credit-selector-' + valueAmount.id">{{
          valueAmount.value
        }}</label>
      </div>
    </div>

    <div class="stored-card-wrapper" v-if="!cardsLoading">
      <div v-if="storedCards.length > 0">
        Stored cards
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
      <div v-else>No stored cards, add a new one below</div>
    </div>
    <div class="stored-card-wrapper" v-else>
      <BaseLoadingSpinner />
    </div>
    <div class="stripe-card-form">
      <div class="card-inputs" :class="{ hide: selectedCardId !== '' }">
        <label>Card Number</label>
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
          >Subscribe ${{ chargeCredits.value * chargeCredits.price }} /month ({{
            chargeCredits.value
          }}
          credits)</span
        >
        <!-- TODO: API-based real-time cost of tokens? Could not see immediately how to do that -->
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
        { id: 1, value: 10, price: 30 },
        { id: 2, value: 20, price: 25 },
        { id: 3, value: 50, price: 20 },
        { id: 4, value: 100, price: 15 },
      ],
      cardError: '',
      isProcessing: false,
      storedCards: [],
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
  },
  mounted() {
    // Style Object documentation here: https://stripe.com/docs/js/appendix/style
    this.getStoredCards()
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
    async getStoredCards() {
      await this.createStripeCustomer()
      const cardsAndSubsResult = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/current-cards-subscriptions`,
      })

      this.storedCards = cardsAndSubsResult.data.cards
      this.cardsLoading = false
    },
    async chargeCardSingle() {
      console.log('gots here')

      this.isProcessing = true
      // handle the token
      // send it to your server
      const createIntent = await axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}/create-payment-intent`,
        data: {
          chargeAmount: parseInt(this.chargeCredits.value),
        },
      })

      // const { token, error } = await this.$stripe.createToken(this.card)

      // if (error) {
      //   // handle error here
      //   this.cardError = error.message
      //   console.log(error)
      //   return
      // }

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

      console.log('well', paymentMethod)

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

        this.card.clear()
        this.cardError = ''
        this.chargeCredits = 0
        this.selectedCardId = ''
        this.getStoredCards()
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

  .card-inputs {
    &.hide {
      display: none;
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

.subscribe-blurb {
  font-size: 11px;
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

.stored-card-wrapper {
  min-height: 100px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  .card {
    margin: 10px auto;
    width: 250px;
    display: flex;
    height: 50px;
    align-items: center;
  }

  input[type='radio'] {
    display: none;
  }
  input + label {
    background-color: $color-ellen-brand-bright;
    border-radius: $border-radius;
    padding: 10px;
    margin: 10px;
    width: 200px;
    cursor: pointer;
    border: solid 2px $color-ellen-dark;

    &:hover {
      background-color: $color-white;
    }
  }

  input:checked + label {
    background-color: $color-ellen-dark;
    color: $color-ellen-brand-bright;
  }
}
</style>
