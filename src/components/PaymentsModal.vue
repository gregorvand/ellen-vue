<template>
  <div class="modal payments" :class="ui.payment_modal">
    <div class="container">
      <button class="close" @click="close()">X</button>
      <div class="toggle-container">
        <button
          @click="toggleMode('subscription')"
          :class="{ active: mode == 'subscription' }"
        >
          Subscribe
        </button>
        <button
          @click="toggleMode('single')"
          :class="{ active: mode == 'single' }"
        >
          Top Up
        </button>
      </div>
      <span class="upsell"> Subscribe and save 40%</span>
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
import { mapState } from 'vuex'
export default {
  components: {
    PaymentsSubscription,
    PaymentsSingle,
  },
  data: function () {
    return {
      mode: 'subscription',
      status: 'open',
    }
  },
  methods: {
    close() {
      this.$store.dispatch('ui/togglePaymentModal', 'closed')
    },
    toggleMode(mode) {
      this.mode = mode
    },
  },
  computed: {
    ...mapState(['ui', 'payment_modal']),
  },
}
</script>

<style lang="scss" scoped>
.modal {
  &.open {
    display: flex;
    z-index: 100;
  }

  &.closed {
    display: none;
  }
}
.container {
  position: relative;
  max-width: 600px;
  height: 100%;

  @include breakpoint(medium up) {
    height: 620px;
  }
}

button.close {
  width: 50px;
  height: 30px;
  position: absolute;
  right: 10px;
  top: 0px;
  padding: 0;
  min-width: 30px;
  background-color: transparent;
  color: $color-black;
  border: solid 2px $color-ellen-gray-transparent;
}

.toggle-container {
  display: flex;
  padding: 5px;
  border: solid rgb(238 238 238) thin;
  border-radius: 50px;
  background-color: $color-ellen-light-gray;

  button {
    margin: 5px;
    background-color: transparent;
    color: $color-black;
    border: solid transparent 3px;
    border-radius: 0px;

    &.active {
      background-color: $color-ellen-dark;
      border-radius: 50px;
      color: $color-white;
    }
  }
}

.fixed-height {
  height: 400px;
  width: 90%;

  > div {
    width: 100%;
  }

  @include breakpoint(medium up) {
    align-items: center;
    justify-content: center;
    display: flex;
    height: 500px;
  }
}

.upsell {
  font-size: 12px;
  background-color: hsl(55deg 100% 88%);
  margin: 2px auto;
  padding: 1px;
}
</style>
