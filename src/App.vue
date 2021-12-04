<template>
  <div id="app" :class="'app-wrapper ' + $route.name">
    <AppNav />
    <router-view :key="$route.fullPath" />
    <footer>
      <router-link to="/">
        <img
          src="@/assets/ELLENv2logo.svg"
          class="logo"
          alt="welcome to ELLEN insights"
        />
      </router-link>
    </footer>
  </div>
</template>

<script>
import AppNav from '@/components/AppNav.vue'
// import NotificationContainer from '@/components/NotificationContainer.vue'

export default {
  name: 'Ellen',
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Insights | Benchmarking',
    // all titles will be injected into this template
    titleTemplate: '%s :: ELLEN',
  },
  components: {
    AppNav,
    // NotificationContainer,
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
  justify-content: flex-start;
  height: auto;
  min-height: 100vh;

  @include breakpoint(small only) {
    padding: 10px;
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
