<template>
  <div class="modal">
    <button @click="close()">X</button>
    <div class="container">
      <div class="toggle-container">
        <button @click="toggleMode('single')">Single</button>
        <button @click="toggleMode('subscription')">Subscribe</button>
      </div>
      <div class="fixed-height">
        <div v-if="mode == 'single'">
          <PaymentsSingle />
        </div>
        <div v-if="mode == 'subscription'">
          <PaymentsSubscription />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PaymentsSingle from '@/components/PaymentsSingle'
import PaymentsSubscription from '@/components/PaymentsSubscription'
export default {
  components: {
    PaymentsSubscription,
    PaymentsSingle,
  },
  data: function () {
    return {
      mode: 'subscription',
    }
  },
  methods: {
    toggleMode(mode) {
      this.mode = mode
    },
  },
}
</script>

<style lang="scss" scoped>
.toggle-container {
  display: flex;

  button {
    margin: 5px;
  }
}

.fixed-height {
  height: 300px;
}
</style>
