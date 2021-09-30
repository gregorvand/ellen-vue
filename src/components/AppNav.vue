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
        <SearchForm v-if="loggedIn && this.$route.name !== 'home'" />
      </div>

      <div class="nav-header-right">
        <div class="user-details" v-if="loggedIn">
          <span>{{ user.user.email }}</span>
          <CreditsBalance />
        </div>
      </div>
    </section>

    <section class="nav-header-subnav">
      <router-link v-if="!loggedIn" to="/login" class="login-link">
        Login
      </router-link>

      <div v-if="!loggedIn">:: Space for promo ::</div>

      <router-link v-if="loggedIn" :to="{ name: 'dashboard' }"
        >My Companies</router-link
      >
      <router-link v-if="loggedIn" :to="{ name: 'account' }"
        >Account</router-link
      >
      <div v-if="loggedIn" class="logoutButton" @click="logout">Logout</div>
    </section>
  </div>
</template>

<script>
import { authComputed } from '@/store/helpers.js'
import { mapState } from 'vuex'

import CreditsBalance from '@/components/CreditsBalance'
import SearchForm from '@/components/SearchForm'

export default {
  components: { CreditsBalance, SearchForm },

  data: function () {
    return {
      patternProps: {
        backgroundImage: `url(${require('@/assets/ellen_pattern.svg')})`,
      },
    }
  },
  computed: {
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
$nav-height-mobile: 100px;
$nav-height: 110px;

.nav-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: $nav-height-mobile;

  @include breakpoint(medium up) {
    height: $nav-height;
  }

  &-pattern {
    background-size: 100%;
    background-position: 0 0;
    position: absolute;
    width: 100%;
    height: $nav-height-mobile;
    background-size: cover;
    opacity: 0.2;

    @include breakpoint(medium up) {
      height: $nav-height;
    }
  }

  &-left {
    display: flex;
    flex-direction: row;
    grid-area: logo;

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
  }

  &-main {
    width: 100%;
    background-color: $color-ellen-white-transparent;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
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
      display: none;
      font-size: rem-calc(18px);
      color: $color-ellen-dark-gray;
      text-align: left;

      @include breakpoint(large up) {
        display: flex;
      }
    }
  }

  &-subnav {
    display: flex;
    width: 100%;
    height: 40px;
    justify-content: flex-end;
    padding: $mobile-padding;
    font-size: $small-label-font-size;
    background-color: $color-ellen-gray-transparent;
    padding: 5px 15px;
    align-items: center;
    position: relative;
    z-index: base-index(middle);

    > a:hover {
      text-decoration: underline;
    }

    @include breakpoint(small only) {
      position: fixed;
      bottom: 0;
      width: 100%;
      z-index: 10;
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
