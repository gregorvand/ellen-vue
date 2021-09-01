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
      <router-link v-if="!loggedIn" to="/login" class="login-link">
        Login
      </router-link>

      <div v-if="!loggedIn">:: Space for promo ::</div>

      <router-link v-if="loggedIn" :to="{ name: 'dashboard' }"
        >My Companies</router-link
      >
      <span v-if="loggedIn">{{ user.user.email }}</span>
      <span>{{ credits.displayCreditBalance }}</span>
    </section>
    <div v-if="loggedIn" class="logoutButton" @click="logout">Logout</div>
  </div>
</template>

<script>
import { authComputed } from '@/store/helpers.js'
import { mapState } from 'vuex'
export default {
  computed: {
    ...authComputed,
    ...mapState(['user', 'credits']),
  },

  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    },
  },
  created() {
    this.$store.dispatch('credits/fetchBalance')
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
    padding: 5px 15px;
    align-items: center;
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
