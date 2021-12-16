<template>
  <div class="modal">
    <button @click="close()">X</button>
    <div class="container">
      <div class="toggle-container">
        <button @click="toggleMode('subscription')">Subscribe</button>
        <button @click="toggleMode('single')">Single</button>
      </div>
      <div class="fixed-height">
        <div v-if="mode == 'single'">
          <Payments />
        </div>
        <div v-if="mode == 'subscription'">
          <PaymentsSubscription />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Payments from '@/components/Payments'
import PaymentsSubscription from '@/components/PaymentsSubscription'
export default {
  components: {
    PaymentsSubscription,
    Payments,
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
