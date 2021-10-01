<template>
  <div class="notification-container">
    <div class="scroll-wrapper">
      <NotificationBar
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
      />
      <div class="persistent-notification">
        <span>Potential persistent notification area....</span>
        <span>TaylorStitch +October 2</span>
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
.notification-container {
  position: relative;
  bottom: 0;
  width: 100%;
  left: 0;
  color: white;
  z-index: 100;
  grid-area: notifications;
  height: 100%;
  overflow: hidden;
  background-color: $color-white;
  border-right: dotted 1px black;
  border-left: dotted 1px black;
  border-top: solid 1px $color-ellen-light-gray;
  border-bottom: solid 1px $color-ellen-light-gray;

  .persistent-notification {
    color: #000;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    animation: scroll-left 20s linear infinite;

    > span {
      display: flex;
      min-width: 100%;
      height: 20px;
      margin: 0 5px;
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
