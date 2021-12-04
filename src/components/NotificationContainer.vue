<template>
  <div class="notification-container">
    <div class="scroll-wrapper">
      <NotificationBar
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
      />
      <div class="persistent-notification">
        <span
          >Thanks for visiting. Create an account to save companies to your
          dashboard. We are in beta, please do not share the site. Email
          <a href="mailto:mac@ellen.me">mac@ellen.me</a>
          with any questions
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import NotificationBar from './NotificationBar'
import { mapState } from 'vuex'

export default {
  components: { NotificationBar },
  computed: mapState('notification', ['notifications']),
}
</script>

<style lang="scss" scoped>
$mobile-height: 50px;

.notification-container {
  height: $mobile-height;
  position: relative;
  bottom: 0;
  width: 100%;
  left: 0;
  color: white;
  z-index: 100;
  grid-area: notifications;
  overflow: hidden;
  background-color: $color-white;
  border-right: dotted 1px black;
  border-left: dotted 1px black;
  border-top: solid 1px $color-ellen-light-gray;
  border-bottom: solid 1px $color-ellen-light-gray;

  .persistent-notification {
    color: #000;
    height: $mobile-height;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    animation: scroll-left 20s linear infinite;
    width: 520px;

    @include breakpoint(medium up) {
      height: 100%;
    }

    > span {
      display: flex;
      min-width: 200%;
      height: 20px;
      margin: 0 5px;
      align-items: center;

      @include breakpoint(medium up) {
        > a {
          margin: 0 5px;
          display: flex;
        }
      }
    }
  }
}

.scroll-wrapper {
  height: auto;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  // animation: data-enter-up 5s infinite;
}

@keyframes scroll-left {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
