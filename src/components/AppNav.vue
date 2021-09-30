<template>
  <div class="nav-header">
    <div class="nav-header-pattern" :style="patternProps"></div>
    <section class="topnav">
      <div class="nav-header-left">
        <router-link to="/">
          <img
            src="@/assets/ELLENv2logo.svg"
            class="logo"
            alt="welcome to ELLEN insights"
          />
        </router-link>
        <h1>
          INSIGHTS. <br />
          BENCHMARKING.
        </h1>
      </div>

      <div class="nav-header-search"></div>

      <div class="nav-header-right"></div>
    </section>

    <section class="subnav">
      <router-link v-if="!loggedIn" to="/login" class="login-link">
        Login
      </router-link>

      <div v-if="!loggedIn">:: Space for promo ::</div>

      <router-link v-if="loggedIn" :to="{ name: 'dashboard' }"
        >My Companies</router-link
      >
      <router-link v-if="loggedIn" :to="{ name: 'account' }"
        >My Account</router-link
      >
      <div v-if="loggedIn" class="logoutButton" @click="logout">Logout</div>

      <div class="user-details" v-if="loggedIn">
        <span>{{ user.user.email }}</span>
        <CreditsBalance />
      </div>
    </section>
  </div>
</template>

<script>
import { authComputed } from '@/store/helpers.js'
import { mapState } from 'vuex'

import CreditsBalance from '@/components/CreditsBalance'
export default {
  components: { CreditsBalance },
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
.nav-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 130px;

  &-pattern {
    background-size: 100%;
    background-position: 0 0;
    position: absolute;
    width: 100%;
    height: 130px;
    background-size: cover;
    opacity: 0.2;
  }

  &-left {
    display: flex;
    flex-direction: row;

    h1 {
      margin-left: 15px;
    }
  }

  .topnav {
    width: 100%;
    background-color: rgba(246, 246, 246, 0.7);
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    height: 70px;
    display: flex;
    position: relative;

    img.logo {
      max-width: 25vw;
      display: flex;
    }
    h1 {
      font-size: rem-calc(18px);
      display: flex;
      color: $color-ellen-dark-gray;
      text-align: left;
    }
  }

  .subnav {
    display: flex;
    width: 100%;
    height: 60px;
    justify-content: space-between;
    padding: $mobile-padding;
    font-size: 12px;
    background-color: $color-ellen-light-gray;
    padding: 5px 15px;
    align-items: center;
    position: relative;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .balance-details {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 30px;

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
      margin-left: 10px;
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
