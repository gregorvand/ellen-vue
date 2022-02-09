<template>
  <div class="nav-header">
    <div class="nav-header-pattern" :style="patternProps"></div>
    <section class="nav-header-main">
      <div class="nav-header-left">
        <router-link to="/">
          <img
            src="@/assets/ELLENv2logo.svg"
            class="logo"
            alt="welcome to ELLEN insights"
          />
        </router-link>
        <h1 class="tagline">
          INSIGHTS. <br />
          BENCHMARKING.
        </h1>
      </div>

      <div class="nav-header-search">
        <SearchForm v-if="loggedIn && showNavSearch" />
      </div>

      <div class="nav-header-right">
        <div class="user-details" v-if="loggedIn">
          <span>{{ user.user.email }}</span>
          <CreditsBalance />
        </div>
      </div>
    </section>

    <section class="nav-header-subnav">
      <div class="nav-header-subnav-left"></div>

      <NotificationContainer />

      <div class="user-controls">
        <router-link v-if="loggedIn" :to="{ name: 'dashboard' }"
          >My Companies
        </router-link>
        <router-link v-if="loggedIn" :to="{ name: 'account' }"
          >Account</router-link
        >
        <router-link v-if="!loggedIn" to="/login" class="login-link">
          Login
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import { authComputed } from '@/store/helpers.js'
import { mapState } from 'vuex'

import CreditsBalance from '@/components/CreditsBalance'
import SearchForm from '@/components/SearchForm'
import NotificationContainer from '@/components/NotificationContainer.vue'

export default {
  components: { CreditsBalance, SearchForm, NotificationContainer },

  data: function () {
    return {
      patternProps: {
        backgroundImage: `url(${require('@/assets/ellen_pattern.svg')})`,
      },
    }
  },
  computed: {
    showNavSearch() {
      return this.$route.name === 'home' ? false : true
    },
    ...authComputed,
    ...mapState(['user', 'credits']),
  },

  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    },
  },
}
</script>

<style lang="scss" scoped>
.nav-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: $nav-height-mobile + 10px;

  @include breakpoint(medium up) {
    height: $nav-height;
    position: fixed;
    top: 0;
    width: 100%;
    background-color: white;
    z-index: 100;
  }

  &-pattern {
    background-size: 100%;
    background-position: 0 0;
    position: absolute;
    width: 100%;
    height: $nav-height-mobile + 10px;
    background-size: cover;
    opacity: 0.2;

    @include breakpoint(medium up) {
      height: $nav-height -10px;
    }
  }

  &-left {
    display: flex;
    flex-direction: row;
    grid-area: logo;
    padding: 10px;
    background-color: $color-white;
    height: 70px;
    align-items: center;

    h1 {
      margin-left: 15px;
    }
  }

  &-search {
    height: 50px;
    align-items: center;
    justify-content: center;
    display: flex;
    grid-area: search;
  }

  &-right {
    grid-area: user;
    padding: 0 10px;
  }

  &-main {
    width: 100%;
    background-color: $color-ellen-white-transparent;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    height: 70px;
    display: grid;
    position: relative;
    z-index: base-index(top);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      'logo search search'
      'user user user';

    @include breakpoint(medium up) {
      grid-template-columns: 1fr 1fr 1fr;
      align-content: center;
      grid-template-areas: 'logo search user';
    }

    img.logo {
      max-width: 25vw;
      display: flex;
    }

    h1.tagline {
      font-size: rem-calc(18px);
      color: $color-ellen-dark-gray;
      text-align: left;

      @include breakpoint(large up) {
        display: flex;
      }
    }
  }

  &-subnav {
    display: grid;
    width: 100%;
    height: 40px;
    justify-content: flex-end;
    padding: $mobile-padding;
    font-size: $small-label-font-size;
    background-color: $color-ellen-gray-transparent;
    padding: 0;
    align-items: center;
    position: relative;
    z-index: base-index(middle);
    position: relative;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 'login notifications user';

    @include breakpoint(medium up) {
      padding: 0px 15px;
      height: 100%;
    }

    > a:hover {
      text-decoration: underline;
    }

    &-left {
      @include breakpoint(medium up) {
        grid-area: login;
      }
    }

    .user-controls {
      grid-area: user;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
    }

    @include breakpoint(small only) {
      background-color: $color-ellen-brand-bright;
      position: fixed;
      bottom: 0;
      width: 100%;
      z-index: 10;
      grid-template-columns: 1fr 1fr;
      grid-template-areas: 'notifications user';
      display: grid;
      height: $mobile-footer-nav-height;

      a {
        background: $color-ellen-dark;
        color: $color-white;
        height: 35px;
        align-items: center;
        display: flex;
        justify-content: center;
        border-radius: $border-radius;
        padding: 5px;
        font-size: 11px;
        width: 100%;
        margin: 10px;
      }
    }

    .onboarding & {
      display: none;
    }
  }

  .user-details {
    display: flex;
    font-size: $small-label-font-size;
    grid-area: user;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    @include breakpoint(medium up) {
      flex-direction: column;
      align-items: flex-end;
    }

    .balance-details {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 40px;

      &-prefix {
        font-weight: 600;
      }

      img {
        width: 20px;
        object-fit: cover;
        height: 22px;
      }
    }

    span {
      display: flex;
    }
  }
}
.nav-welcome {
  margin-left: auto;
  margin-right: 1rem;
  color: white;
}
a {
  font-weight: bold;
  color: #2c3e50;
  margin: auto 0.8em auto 0.4em;
  text-decoration: none;
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
}
.logoutButton {
  cursor: pointer;
}
.nav-welcome + button {
  margin-left: 0;
}
</style>
