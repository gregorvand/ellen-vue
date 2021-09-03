<template>
  <div class="form-container">
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

    <br />
    <label>Card Number</label>
    <div id="card-number" class="card-number"></div>
    <label>Card Expiry</label>
    <div id="card-expiry"></div>
    <label>Card CVC</label>
    <div id="card-cvc"></div>
    <div id="card-error"></div>
    <button id="custom-button" @click="chargeCard">Pay</button>
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
      cardNumber: null,
      cardExpiry: null,
      cardCvc: null,
      chargeCredits: 0,
      creditValues: [
        // these will eventually come from API
        { id: 1, value: 10 },
        { id: 2, value: 20 },
        { id: 3, value: 50 },
        { id: 4, value: 100 },
      ],
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

    this.cardNumber = this.stripeElements.create('cardNumber', {
      style: {
        base: {
          iconColor: '#c4f0ff',
          color: '#000000',
          fontWeight: '500',
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
    this.cardNumber.mount('#card-number')
    this.cardExpiry = this.stripeElements.create('cardExpiry')
    this.cardExpiry.mount('#card-expiry')
    this.cardCvc = this.stripeElements.create('cardCvc')
    this.cardCvc.mount('#card-cvc')
  },
  beforeDestroy() {
    this.cardNumber.destroy()
    this.cardExpiry.destroy()
    this.cardCvc.destroy()
  },
  methods: {
    async chargeCard() {
      this.isProcessing = true
      const { token, error } = await this.$stripe.createToken(this.cardNumber)
      if (error) {
        // handle error here
        document.getElementById('card-error').innerHTML = error.message
        return
      }
      // handle the token
      // send it to your server
      const createIntent = await axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}/create-payment-intent`,
        data: {
          token: token,
          chargeAmount: parseInt(this.chargeCredits),
        },
      })

      const makeCharge = await this.$stripe.confirmCardPayment(
        createIntent.data.clientSecret,
        {
          payment_method: {
            card: this.cardNumber,
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

        this.cardNumber.clear()
        this.cardExpiry.clear()
        this.cardCvc.clear()
      }
    },
  },
}
</script>

<style scoped lang="scss">
.form-container {
  position: relative;
  > div {
    color: black !important;
    width: 200px;

    input {
      color: black !important;
    }
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
