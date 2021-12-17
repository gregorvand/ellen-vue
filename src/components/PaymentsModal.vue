<template>
  <div class="modal payments" :class="status">
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
      status: 'open',
    }
  },
  methods: {
    toggleMode(mode) {
      this.mode = mode
    },
    close() {
      this.status = 'closed'
    },
  },
}
</script>

<style lang="scss" scoped>
.modal {
  &.open {
    display: flex;
  }

  &.closed {
    display: none;
  }
}
.container {
  position: relative;
  max-width: 500px;
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

  button {
    margin: 5px;
    background-color: transparent;
    color: $color-black;
    border: solid transparent 3px;
    border-radius: 0px;

    &.active {
      border-bottom: solid $color-ellen-dark 3px;
    }
  }
}

.fixed-height {
  height: 400px;
  width: 300px;

  > div {
    width: 100%;
  }

  @include breakpoint(medium up) {
    width: 380px;
    align-items: center;
    justify-content: center;
    display: flex;
    height: 500px;
  }
}
</style>
