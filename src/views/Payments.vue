<template>
  <div class="form-container">
    <label>Card Number</label>
    <div id="card-number" class="card-number"></div>
    <label>Card Expiry</label>
    <div id="card-expiry"></div>
    <label>Card CVC</label>
    <div id="card-cvc"></div>
    <div id="card-error"></div>
    <button id="custom-button" @click="createToken">Generate Token</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      token: null,
      cardNumber: null,
      cardExpiry: null,
      cardCvc: null,
    }
  },
  computed: {
    stripeElements() {
      return this.$stripe.elements()
    },
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
    async createToken() {
      const { token, error } = await this.$stripe.createToken(this.cardNumber)
      if (error) {
        // handle error here
        document.getElementById('card-error').innerHTML = error.message
        return
      }
      console.log(token)
      // handle the token
      // send it to your server
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}/create-payment-intent`,
        data: token,
      }).then((res) => {
        console.log(res)
        this.$stripe
          .confirmCardPayment(res.data.clientSecret, {
            payment_method: {
              card: this.cardNumber,
            },
          })
          .then(function (result) {
            console.log('woo', result)
          })
      })
    },
  },
}
</script>

<style scoped lang="scss">
.form-container > div {
  color: black !important;
  width: 200px;
  border: solid black thin;

  input {
    color: black !important;
  }
}
</style>
