<template>
  <div class="balance-details">
    <span class="balance-details-prefix">Credits Balance:</span>
    <span v-if="!credits.displayCreditBalance">
      <img
        src="@/assets/coin_gif.gif"
        class="coin"
        alt="welcome to ELLEN insights"
    /></span>
    <span v-else>&nbsp;{{ credits.displayCreditBalance }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    loading: true,
  }),

  computed: {
    ...mapState(['user', 'credits']),
  },
  mounted() {
    this.$store.dispatch('credits/fetchBalance').then((data) => {
      console.log('fetched', data)
      this.loading = false
    })
  },
}
</script>

<style lang="scss" scoped>
.balance-details {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 30px;
  justify-content: flex-end;

  &-prefix {
    font-weight: 600;
  }

  img {
    width: 20px;
    object-fit: cover;
    height: 22px;
  }
}
</style>
