<template>
  <div id="app" :class="'app-wrapper ' + $route.name">
    <AppNav />
    <NotificationContainer />
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
import AppNav from '@/components/AppNav.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'

export default {
  components: {
    AppNav,
    NotificationContainer,
  },
}
// comment for deploy
</script>
<style lang="scss">
@import './styles/global.scss';
.page {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 56px);
}
.app-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;

  @include breakpoint(small only) {
    padding-bottom: $mobile-footer-nav-height + 20px;
  }

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
