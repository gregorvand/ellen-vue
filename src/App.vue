<template>
  <div id="app" :class="`app-wrapper ${$route.name}`">
    <PaymentsModal v-if="loggedIn" />
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
      <a class="small-label" href="mailto:hello@ellen.me">Contact</a>
      <span class="small-label">All Rights Reserved, Ellen Inc.</span>
    </footer>
  </div>
</template>

<script>
import AppNav from '@/components/AppNav.vue'
import PaymentsModal from '@/components/PaymentsModal.vue'
// import NotificationContainer from '@/components/NotificationContainer.vue'
import { authComputed } from '@/store/helpers.js'
export default {
  name: 'Ellen',
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Ellen.me',
    // all titles will be injected into this template
    titleTemplate: '%s - eCom Benchmarking & Insights',
  },
  components: {
    AppNav,
    PaymentsModal,
  },
  computed: {
    ...authComputed,
  },
}
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
  z-index: 1;
  position: relative;
  flex: 1;

  // when payment modal open..
  &.open {
    overflow: hidden;
  }

  @include breakpoint(small only) {
    // padding: 10px;
    padding-bottom: $mobile-footer-nav-height + 20px;

    &.home {
      padding: 0;
    }
  }

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
