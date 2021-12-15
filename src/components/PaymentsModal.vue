<template>
  <div>
    <button @click="toggleMode('subscription')">Subscribe</button>
    <button @click="toggleMode('single')">Single</button>
    <div v-if="mode == 'single'">
      <Payments />
    </div>
    <div v-if="mode == 'subscription'">
      <PaymentsSubscription />
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

<style lang="scss" scoped></style>
