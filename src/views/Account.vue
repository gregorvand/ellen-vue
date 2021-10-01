<template>
  <div>
    <div v-if="loggedIn" class="logoutButton" @click="logout">Logout</div>
    <CurrentPayments />
  </div>
</template>

<script>
import CurrentPayments from '../components/CurrentPayments.vue'
import { mapState } from 'vuex'

export default {
  components: { CurrentPayments },
  computed: {
    ...mapState(['user']),
  },
}
</script>

<style lang="scss" scoped></style>
