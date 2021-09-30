<template>
  <div class="balance-details">
    <span class="balance-details-prefix">Credits Balance</span>
    <span
      class="balance-value"
      v-if="credits.displayCreditBalance === 'loading'"
    >
      <img
        src="@/assets/coin_gif.gif"
        class="coin"
        alt="welcome to ELLEN insights"
    /></span>
    <span class="balance-value" v-else
      >&nbsp;{{ credits.displayCreditBalance }}</span
    >
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

  .balance-value {
    width: 50px;
    background-color: $color-ellen-brand-bright;
    padding: 2px;
    border-radius: 5px;
    margin-left: 5px;
    font-weight: 600;
    font-size: 14px;
    align-items: center;
    justify-content: center;
    display: flex;
  }
}
</style>
