<template>
  <div class="notification-bar" :class="notificationTypeClass">
    <p>{{ notification.message }}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { mapState } from 'vuex'

export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  computed: mapState('notification', ['notifications']),
  data() {
    return {
      timeout: null,
    }
  },
  // lifecyle hooks
  mounted() {
    this.timeout = setTimeout(() => this.remove(this.notification), 10000)
  },
  beforeDestroy() {
    clearTimeout(this.timeout)
  },
  computed: {
    notificationTypeClass() {
      return `-text-${this.notification.type}`
    },
  },
  methods: mapActions('notification', ['remove']),
}
</script>

<style lang="scss" scoped>
.notification-bar {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  animation: data-enter-up 10s infinite;
  background-color: $color-white;
  position: relative;
  line-height: 1;
  z-index: 10;

  p {
    margin: 0;
    display: flex;
    align-items: center;
    height: 100%;
    @extend %heading-font-family;
    font-size: $small-label-font-size;

    @include breakpoint(medium up) {
      font-size: 14px;
    }
  }

  &.-text-success {
    color: rgb(19, 155, 19);
    font-weight: 600;
  }

  &.-text-error {
    color: salmon;
  }
}

@keyframes data-enter-up {
  0% {
    transform: translateY(-40px);
  }

  10% {
    transform: translateY(0);
  }

  75% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(40px);
  }
}
</style>
