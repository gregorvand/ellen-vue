<template>
  <div class="nav-header">
    <section class="topnav">
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
      <!-- <router-link to="/"> Home </router-link>
    <template v-if="loggedIn">
      <router-link :to="{ name: 'dashboard' }"> Dashboard </router-link>
      <router-link :to="{ name: 'earnings' }"> Earnings </router-link>
    </template> -->
    </section>

    <section class="subnav">
      <router-link v-if="!loggedIn" to="/login" class="button">
        Login
      </router-link>
      <router-link v-else :to="{ name: 'dashboard' }">My Companies</router-link>
      <!-- <button v-else type="button" class="logoutButton" @click="logout">
        Logout
      </button> -->
      <span v-if="loggedIn">{{ user.user.email }}</span>
    </section>
  </div>
</template>

<script>
import { authComputed } from '@/store/helpers.js'
import { mapState } from 'vuex'
export default {
  computed: {
    ...authComputed,
    ...mapState(['user']),
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

  .topnav {
    width: 100%;
    background-color: $color-ellen-dark;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    min-height: 70px;
    display: flex;

    img.logo {
      max-width: 25vw;
      display: flex;
    }
    h1 {
      font-size: rem-calc(18px);
      display: flex;
      color: white;
      text-align: left;
      margin: 0;
    }
  }

  .subnav {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: $mobile-padding;
    font-size: 12px;
    background-color: $color-ellen-light-gray;
    padding: 10px;
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
